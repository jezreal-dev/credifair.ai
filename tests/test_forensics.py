import pytest
import pandas as pd
from decimal import Decimal
from credifair_forensics import ForensicRiskGuard
from fastapi.testclient import TestClient
from api import app

client = TestClient(app)


def test_clean_retail_ledger_passes_forensics():
    """Verify normal merchant transaction spread produces zero fraud flags."""
    df = pd.DataFrame({
        "date": ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06"],
        "amount": [Decimal("1250.00"), Decimal("4300.00"), Decimal("8700.00"), Decimal("2100.00"), Decimal("15400.00"), Decimal("3200.00")],
        "description": ["POS Retail sale" for _ in range(6)]
    })
    result = ForensicRiskGuard.analyze_ledger_forensics(df)
    assert not result["is_flagged"]
    assert result["fraud_risk_level"] == "CLEAN"
    assert result["risk_penalty_points"] == 0.0


def test_round_trip_wash_trading_detection():
    """Verify accounts cycling exact round sums trigger risk penalties."""
    df = pd.DataFrame({
        "date": [f"2026-09-0{i+1}" for i in range(8)],
        "amount": [Decimal("100000.00"), Decimal("50000.00"), Decimal("100000.00"), Decimal("200000.00"), 
                   Decimal("50000.00"), Decimal("100000.00"), Decimal("1250.00"), Decimal("3000.00")],
        "description": ["Transfer" for _ in range(8)]
    })
    result = ForensicRiskGuard.analyze_ledger_forensics(df)
    assert result["is_flagged"]
    assert result["round_trip_ratio_pct"] >= 40.0
    assert "Artificial Pattern" in result["forensic_flags"][0]
    assert result["risk_penalty_points"] >= 15.0


def test_turnover_spike_anomaly_detection():
    """Verify unnatural spikes where >65% of volume hits in 2 days trigger anomaly flags."""
    df = pd.DataFrame({
        "date": ["2026-09-01", "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06"],
        "amount": [Decimal("500000.00"), Decimal("450000.00"), Decimal("1200.00"), Decimal("2500.00"), Decimal("3000.00"), Decimal("1500.00"), Decimal("2000.00")],
        "description": ["POS Deposit" for _ in range(7)]
    })
    result = ForensicRiskGuard.analyze_ledger_forensics(df)
    assert result["is_flagged"]
    assert any("Turnover Spike" in flag for flag in result["forensic_flags"])
    assert result["risk_penalty_points"] >= 20.0


def test_api_integration_preserves_contract():
    """Ensure /api/v1/analyze returns forensic audit data alongside existing keys."""
    csv_content = (
        "date,amount,category,description,balance\n"
        "2026-09-01,15000,Retail,Sale,200000\n"
        "2026-09-02,22000,Retail,Sale,222000\n"
        "2026-09-03,18000,Retail,Sale,240000\n"
        "2026-09-04,31000,Retail,Sale,271000\n"
        "2026-09-05,19000,Retail,Sale,290000\n"
        "2026-09-06,25000,Retail,Sale,315000\n"
    ).encode("utf-8")

    files = {"file": ("test_statement.csv", csv_content, "text/csv")}
    response = client.post("/api/v1/analyze", files=files)
    assert response.status_code == 200
    data = response.json()

    # Core contracts remain untouched
    assert "merchant_vitals" in data
    assert "conformal_risk" in data
    assert "llm_explanation" in data

    # New non-breaking forensic payload verified
    assert "forensic_audit" in data
    assert "fraud_risk_level" in data["forensic_audit"]
    assert "is_flagged" in data["forensic_audit"]
