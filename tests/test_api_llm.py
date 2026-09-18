import pytest
from fastapi.testclient import TestClient
from api import app
from credifair_explainability import get_active_llm_provider, generate_dual_language_explanation

client = TestClient(app)

def test_health_check_and_secret_isolation():
    """Verify health check exposes connection status without leaking raw keys."""
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    
    assert data["status"] == "healthy"
    assert "llm_connection" in data
    assert "is_connected" in data["llm_connection"]
    assert "status_badge" in data["llm_connection"]
    
    # Assert zero secret leakage
    raw_response_text = resp.text
    assert "gsk_" not in raw_response_text
    assert "AIza" not in raw_response_text

def test_cors_headers_present():
    """Ensure CORS middleware correctly allows cross-origin requests for Lovable."""
    headers = {
        "Origin": "https://lovable.app",
        "Access-Control-Request-Method": "POST"
    }
    resp = client.options("/api/v1/analyze", headers=headers)
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == "*"

def test_dual_language_format_and_offline_fallback():
    """Ensure output format always splits into English Audit and Pidgin Advisory."""
    result = generate_dual_language_explanation(
        merchant_name="TEST-MERCHANT",
        loan_amount=500000,
        point_risk=6.5,
        lower_bound=4.2,
        upper_bound=8.9,
        recommendation="RECOMMENDED FOR APPROVAL",
        primary_driver="Steady daily POS credit flow."
    )
    
    assert "is_live_connection" in result
    assert "content" in result
    content = result["content"]
    
    # Verify required structural sections exist
    assert "Officer Audit Report" in content or "OFFICER AUDIT REPORT" in content
    assert "Merchant Advisory" in content or "MERCHANT ADVISORY" in content

def test_appsec_file_upload_limit():
    """Ensure oversized payloads trigger 400 rejection (CWE-400)."""
    giant_content = b"0" * (6 * 1024 * 1024)  # 6 MB payload
    files = {"file": ("statement.csv", giant_content, "text/csv")}
    resp = client.post("/api/v1/analyze", files=files)
    assert resp.status_code == 400
    assert "exceeds 5MB" in resp.json()["detail"]
