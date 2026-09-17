"""
CrediFair AI: Streamlit Underwriting Dashboard
Decoupled presentation layer utilizing FinancialDataPipeline.
"""
from decimal import Decimal
import streamlit as st
import plotly.graph_objects as go
import pandas as pd

from credifair_engine import CrediFairEngine
from credifair_compliance import CrediFairComplianceGuard
from credifair_security import CrediFairSecurityGuard
from credifair_explainability import generate_dual_language_explanation
from credifair_ingestion import FinancialDataPipeline
from seed_data import PRELOADED_PROFILES, generate_merchant_csv

st.set_page_config(
    page_title="CrediFair AI | Fair Credit for Nigerian MSMEs",
    page_icon="🛡️",
    layout="wide"
)

@st.cache_resource
def load_ml_engine() -> CrediFairEngine:
    engine = CrediFairEngine(random_state=42)
    engine.train_and_calibrate(synthetic_samples=800)
    return engine

engine = load_ml_engine()

st.title("🛡️ CrediFair AI: Fair Alternative Credit Scoring")
st.caption("Distribution-Free Conformal Risk Engine & NDPA 2023 §37 Compliant Underwriting")

# Sidebar
st.sidebar.header("📁 Merchant Profile Ingestion")
mode = st.sidebar.radio("Data Ingestion Method:", ["Pre-loaded MSME Archetype", "Upload Raw POS / Bank CSV"])

if mode == "Pre-loaded MSME Archetype":
    profile_choice = st.sidebar.selectbox("Choose Verified Profile:", list(PRELOADED_PROFILES.keys()))
    preloaded = PRELOADED_PROFILES[profile_choice]
    df_raw = generate_merchant_csv(preloaded["csv_key"])

    # Standardize via FinancialDataPipeline
    merchant_profile = {
        "merchant_id": FinancialDataPipeline.generate_deterministic_merchant_id(profile_choice),
        "merchant_name": profile_choice,
        "monthly_inflow_decimal": FinancialDataPipeline.parse_currency(preloaded["monthly_inflow"]),
        "monthly_inflow_float": float(preloaded["monthly_inflow"]),
        "volatility": float(preloaded["volatility"]),
        "daily_tx": int(preloaded["daily_tx"]),
        "loan_requested_decimal": FinancialDataPipeline.parse_currency(preloaded["loan_requested"]),
        "driver": str(preloaded["driver"])
    }
else:
    uploaded_file = st.sidebar.file_uploader("Upload Bank/POS CSV (Max 5MB):", type=["csv"])
    if uploaded_file:
        file_bytes = uploaded_file.read()
        valid, msg, df_raw = CrediFairSecurityGuard.validate_csv_upload(file_bytes)
        if not valid:
            st.error(msg)
            st.stop()
        else:
            st.sidebar.success(msg)
            # Decoupled ingestion & feature extraction
            processed = FinancialDataPipeline.process_ledger(
                df=df_raw,
                merchant_name="Merchant Applicant",
                loan_requested=Decimal("500000.00"),
                custom_driver="Custom uploaded ledger data with parsed merchant transaction velocity."
            )
            merchant_profile = {
                "merchant_id": processed["merchant_id"],
                "merchant_name": processed["merchant_name"],
                "monthly_inflow_decimal": processed["monthly_inflow_decimal"],
                "monthly_inflow_float": processed["monthly_inflow_float"],
                "volatility": processed["volatility"],
                "daily_tx": processed["daily_tx"],
                "loan_requested_decimal": processed["loan_requested_decimal"],
                "driver": processed["driver"]
            }
    else:
        st.info("Please select a pre-loaded archetype or upload a valid merchant CSV to begin.")
        st.stop()

# Compliance Layer: Deep PII Sanitization
df_clean = CrediFairComplianceGuard.sanitize_merchant_dataframe(df_raw)

# Layout Metrics
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("📊 Financial Vitals (Sanitized Ledger)")
    m1, m2, m3 = st.columns(3)
    m1.metric("Est. Monthly Inflow", f"₦{merchant_profile['monthly_inflow_decimal']:,.2f}")
    m2.metric("Cashflow Volatility", f"{merchant_profile['volatility']:.1f}%")
    m3.metric("Daily Tx Count", f"{merchant_profile['daily_tx']}")

    st.write("Recent Transaction Activity:")
    st.dataframe(df_clean.head(5), use_container_width=True)

# Risk Prediction with Conformal Bounds
risk_results = engine.predict_risk_band(
    monthly_inflow=merchant_profile["monthly_inflow_float"],
    volatility=merchant_profile["volatility"],
    daily_tx=merchant_profile["daily_tx"]
)

with col2:
    st.subheader("🎯 Calibrated Conformal Risk Assessment")
    fig = go.Figure()
    fig.add_trace(go.Bar(
        y=["Default Risk"],
        x=[risk_results["upper_bound_pct"] - risk_results["lower_bound_pct"]],
        base=[risk_results["lower_bound_pct"]],
        orientation="h",
        marker=dict(color="rgba(33, 150, 243, 0.4)", line=dict(color="#1976D2", width=2)),
        name="95% Conformal Confidence Interval"
    ))
    fig.add_trace(go.Scatter(
        y=["Default Risk"],
        x=[risk_results["point_risk_pct"]],
        mode="markers",
        marker=dict(color="#D32F2F", size=14, symbol="diamond"),
        name="Point Estimate"
    ))
    fig.update_layout(
        title=f"Honest Risk Interval (alpha=0.05): [{risk_results['lower_bound_pct']}% — {risk_results['upper_bound_pct']}%]",
        xaxis=dict(title="Probability of Default (%)", range=[0, 100]),
        height=220,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    st.plotly_chart(fig, use_container_width=True)

    status_color = "green" if "APPROVAL" in risk_results["recommendation"] else (
        "orange" if "MANUAL" in risk_results["recommendation"] else "red"
    )
    st.markdown(f"Underwriting Recommendation: :{status_color}[**{risk_results['recommendation']}**]")

st.markdown("---")
st.subheader("📝 Transparent Decision Reasoning & Merchant Guidance")

explanation = generate_dual_language_explanation(
    merchant_name=merchant_profile["merchant_name"],
    loan_amount=int(merchant_profile["loan_requested_decimal"]),
    point_risk=risk_results["point_risk_pct"],
    lower_bound=risk_results["lower_bound_pct"],
    upper_bound=risk_results["upper_bound_pct"],
    recommendation=risk_results["recommendation"],
    primary_driver=merchant_profile["driver"]
)

tab_eng, tab_pid = st.tabs(["🏦 Credit Officer Audit Report (English)", "🛍️ Merchant Advisory (Nigerian Pidgin)"])

if "raw_explanation" in explanation:
    st.markdown(explanation["raw_explanation"])
else:
    with tab_eng:
        st.markdown(explanation["officer_report"])
    with tab_pid:
        st.markdown(explanation["merchant_advisory"])

st.markdown("---")
st.subheader("⚖️ Regulatory Compliance & Human Underwriting Sign-Off")
st.caption("Per NDPA 2023 Section 37, loans cannot be granted via solely automated processing.")

officer_name = st.text_input("Enter Loan Officer Name / Staff ID for Sign-off:", value="LO-ABUJA-741")

if st.button("Generate Immutable Compliance Audit Manifest"):
    manifest = CrediFairComplianceGuard.generate_audit_manifest(
        merchant_id=merchant_profile["merchant_id"],
        point_risk=risk_results["point_risk_pct"],
        lower_bound=risk_results["lower_bound_pct"],
        upper_bound=risk_results["upper_bound_pct"],
        recommendation=risk_results["recommendation"],
        officer_id=officer_name
    )
    st.json(manifest)
    st.success(f"Audit Manifest Sealed under SHA-256: `{manifest['audit_hash_sha256']}`")
