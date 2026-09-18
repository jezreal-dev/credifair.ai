"""
CrediFair AI: Headless REST API for Frontend (React / Tailwind & Lovable)
Provides decoupled endpoints for dynamic statement ingestion, conformal risk assessment,
multi-provider LLM explainability, and NDPA 2023 §37 statutory human sign-off.
"""
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from credifair_parser import RealDocumentParser
from credifair_engine import CrediFairEngine
from credifair_compliance import CrediFairComplianceGuard
from credifair_security import CrediFairSecurityGuard
from credifair_explainability import get_active_llm_provider, generate_dual_language_explanation
from credifair_forensics import ForensicRiskGuard
from seed_data import PRELOADED_PROFILES, generate_merchant_csv

app = FastAPI(title="CrediFair AI Engine API", version="2.0.0")

# Enable CORS for React / Lovable frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global singleton ML engine
engine = CrediFairEngine(random_state=42)
engine.train_and_calibrate(synthetic_samples=800)


class SignOffPayload(BaseModel):
    merchant_id: str
    point_risk: float
    lower_bound: float
    upper_bound: float
    recommendation: str
    officer_id: str


class AssessProfilePayload(BaseModel):
    profile_key: str
    loan_requested: Optional[float] = None


@app.get("/api/v1/health")
@app.get("/health")
def health_check() -> Dict[str, Any]:
    """Returns engine calibration status and active multi-provider LLM connectivity."""
    provider, model, is_live = get_active_llm_provider()
    return {
        "status": "healthy",
        "engine_calibrated": engine.is_calibrated,
        "empirical_test_coverage_95": engine.empirical_test_coverage,
        "llm_connection": {
            "is_connected": is_live,
            "provider": provider,
            "active_model": model,
            "status_badge": "LIVE" if is_live else "FALLBACK_OFFLINE"
        }
    }


@app.get("/api/v1/profiles")
def list_profiles() -> Dict[str, Any]:
    """Returns the dictionary of preloaded Nigerian merchant archetypes for frontend picker."""
    return {
        "status": "success",
        "profiles": PRELOADED_PROFILES
    }


@app.post("/api/v1/assess-profile")
def assess_profile(payload: AssessProfilePayload) -> Dict[str, Any]:
    """
    Assesses a preloaded merchant archetype using the calibrated Conformal Prediction engine.
    Returns financial vitals, 95% conformal bounds, and dual-language LLM advisories.
    """
    profile_key = payload.profile_key
    profile = PRELOADED_PROFILES.get(
        profile_key,
        list(PRELOADED_PROFILES.values())[0] if PRELOADED_PROFILES else {
            "monthly_inflow": 1850000,
            "volatility": 11.8,
            "daily_tx": 48,
            "loan_requested": 750000,
            "driver": "Consistent transaction frequency",
            "csv_key": "mama_bukky"
        }
    )

    csv_key = profile.get("csv_key", "mama_bukky")
    df = generate_merchant_csv(csv_key, rows=150)
    df_clean = CrediFairComplianceGuard.sanitize_merchant_dataframe(df)

    loan_req = payload.loan_requested if payload.loan_requested is not None else float(profile.get("loan_requested", 750000))
    monthly_inflow = float(profile["monthly_inflow"])
    volatility = float(profile["volatility"])
    daily_tx = float(profile["daily_tx"])

    forensics = ForensicRiskGuard.analyze_ledger_forensics(df_clean)

    # Conformal Risk Assessment
    risk = engine.predict_risk_band(
        monthly_inflow=monthly_inflow,
        volatility=volatility,
        daily_tx=daily_tx
    )

    # Dual-Language Explanation
    explanation = generate_dual_language_explanation(
        merchant_name=profile_key,
        loan_amount=loan_req,
        point_risk=risk["point_risk_pct"],
        lower_bound=risk["lower_bound_pct"],
        upper_bound=risk["upper_bound_pct"],
        recommendation=risk["recommendation"],
        primary_driver=profile["driver"]
    )

    sample_records = []
    for _, row in df_clean.head(10).iterrows():
        sample_records.append({
            "date": str(row["date"]),
            "amount": float(row["amount"]),
            "category": str(row.get("category", "General")),
            "description": str(row["description"]),
            "balance": float(row.get("balance", 0.0))
        })

    merchant_vitals = {
        "merchant_id": f"MERCH-{csv_key.upper()[:6]}",
        "merchant_name": profile_key,
        "monthly_inflow": monthly_inflow,
        "monthly_inflow_formatted": f"₦{monthly_inflow:,.2f}",
        "volatility": volatility,
        "daily_tx": daily_tx,
        "loan_requested": loan_req,
        "total_records": len(df),
        "active_days": 30,
        "driver": profile["driver"],
        "forensic_audit": forensics
    }

    return {
        "status": "success",
        "merchant_vitals": merchant_vitals,
        "conformal_risk": risk,
        "llm_explanation": explanation,
        "sample_records": sample_records,
        "forensic_audit": forensics
    }


@app.post("/api/v1/analyze")
async def analyze_document(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Dynamically ingests CSV or PDF statement, scrubs PII, extracts empirical features,
    executes the conformal prediction engine, and generates explainability advice.
    """
    contents = await file.read()

    # AppSec Size Validation (CWE-400)
    if len(contents) > CrediFairSecurityGuard.MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 5MB ceiling (CWE-400).")
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Ingestion & Dynamic Parsing
    try:
        filename_lower = (file.filename or "").lower()
        if filename_lower.endswith(".pdf") or contents.startswith(b"%PDF"):
            df = RealDocumentParser.parse_pdf_file(contents)
        elif filename_lower.endswith(".csv") or filename_lower.endswith(".txt"):
            df = RealDocumentParser.parse_csv_file(contents)
        else:
            df = RealDocumentParser.parse_csv_file(contents)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Parsing error: {str(e)}")

    # Compliance Layer: Deep PII Sanitization
    df_clean = CrediFairComplianceGuard.sanitize_merchant_dataframe(df)

    # Real Feature Calculation (includes forensic audit & volatility adjustment)
    features = RealDocumentParser.extract_features(df_clean)

    # Conformal Risk Assessment
    risk = engine.predict_risk_band(
        monthly_inflow=features["monthly_inflow"],
        volatility=features["volatility"],
        daily_tx=features["daily_tx"]
    )

    # Dual-Language Explanation with Live Provider
    explanation = generate_dual_language_explanation(
        merchant_name=features["merchant_id"],
        loan_amount=features["loan_requested"],
        point_risk=risk["point_risk_pct"],
        lower_bound=risk["lower_bound_pct"],
        upper_bound=risk["upper_bound_pct"],
        recommendation=risk["recommendation"],
        primary_driver=features["driver"]
    )

    sample_records = []
    for _, row in df_clean.head(10).iterrows():
        sample_records.append({
            "date": str(row["date"]),
            "amount": float(row["amount"]),
            "description": str(row["description"])
        })

    return {
        "status": "success",
        "merchant_vitals": features,
        "conformal_risk": risk,
        "llm_explanation": explanation,
        "sample_records": sample_records,
        "forensic_audit": features["forensic_audit"]
    }


@app.post("/api/v1/sign-off")
def officer_sign_off(payload: SignOffPayload) -> Dict[str, Any]:
    """
    Receives loan officer authorization and generates a canonical SHA-256 
    audit manifest per NDPA 2023 Section 37.
    """
    manifest = CrediFairComplianceGuard.generate_audit_manifest(
        merchant_id=payload.merchant_id,
        point_risk=payload.point_risk,
        lower_bound=payload.lower_bound,
        upper_bound=payload.upper_bound,
        recommendation=payload.recommendation,
        officer_id=payload.officer_id
    )
    return {
        "status": "SUCCESS",
        "sealed_manifest": manifest
    }
