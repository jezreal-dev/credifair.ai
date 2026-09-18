"""
Test suite for CrediFair AI Headless FastAPI endpoints
"""
from fastapi.testclient import TestClient
from api import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["engine_calibrated"] is True
    assert "llm_connection" in data
    assert "provider" in data["llm_connection"]
    assert "status_badge" in data["llm_connection"]


def test_profiles_endpoint():
    response = client.get("/api/v1/profiles")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "profiles" in data
    assert "Mama Bukky Foodstuff (Bodija Market)" in data["profiles"]


def test_assess_profile_endpoint():
    payload = {
        "profile_key": "Mama Bukky Foodstuff (Bodija Market)",
        "loan_requested": 750000
    }
    response = client.post("/api/v1/assess-profile", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "merchant_vitals" in data
    assert "conformal_risk" in data
    assert "llm_explanation" in data
    assert data["conformal_risk"]["recommendation"] == "RECOMMENDED FOR APPROVAL"
    assert data["conformal_risk"]["lower_bound_pct"] <= data["conformal_risk"]["point_risk_pct"]
    assert data["conformal_risk"]["point_risk_pct"] <= data["conformal_risk"]["upper_bound_pct"]


def test_analyze_endpoint_with_csv():
    with open("sample_bodija_market_statement.csv", "rb") as f:
        file_bytes = f.read()

    response = client.post(
        "/api/v1/analyze",
        files={"file": ("statement.csv", file_bytes, "text/csv")}
    )

    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "success"
    assert "merchant_vitals" in res
    assert "conformal_risk" in res
    assert "llm_explanation" in res
    assert res["conformal_risk"]["lower_bound_pct"] <= res["conformal_risk"]["point_risk_pct"]
    assert res["conformal_risk"]["point_risk_pct"] <= res["conformal_risk"]["upper_bound_pct"]


def test_sign_off_endpoint():
    payload = {
        "merchant_id": "MERCH-TEST-API",
        "point_risk": 15.5,
        "lower_bound": 10.0,
        "upper_bound": 21.0,
        "recommendation": "RECOMMENDED FOR APPROVAL",
        "officer_id": "LO-LAGOS-007"
    }

    response = client.post("/api/v1/sign-off", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "SUCCESS"
    assert "sealed_manifest" in res
    assert len(res["sealed_manifest"]["audit_hash_sha256"]) == 64
    assert res["sealed_manifest"]["ndpa_compliance"] == "VERIFIED_COMPLIANT"
