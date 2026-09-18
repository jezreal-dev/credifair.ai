# CrediFair AI: Algorithmic Credit Underwriting for Nigerian MSMEs

Statistically calibrated, distribution-free conformal risk engine for underserved Nigerian enterprises. The pipeline provides certified uncertainty intervals and statutory decision support.

---

## 1. Submission Resources

* **Track**: MIT Open Learning / 3MTT Universal AI Innovation Challenge.
* **Project Name**: CrediFair AI.
* **Repository**: https://github.com/jezreal-dev/credifair.ai
* **Live Demo**: https://credifair.ai.studio/
* **Video Walkthrough**: [Submission Video Placeholder].
* **Developer**: [Jezreal Momoh](https://www.linkedin.com/in/jezreal-momoh/).

---

## 2. Executive Summary

Nigerian banks exclude micro-merchants from credit due to missing collateral and balance sheets. Traditional scoring models output overconfident point estimates that penalize seasonal cashflow variance.

CrediFair AI resolves credit rationing using distribution-free Inductive Conformal Prediction. The engine ingests POS ledgers, scrubs personal data, and yields valid 95% confidence intervals:

$$P(Y \in [\hat{y}_{\text{lower}}, \hat{y}_{\text{upper}}]) \ge 1 - \alpha \quad (\alpha = 0.05)$$

The system enforces human oversight under NDPA 2023 Section 37 via tamper-evident SHA-256 audit manifests. It also generates dual-language explanations in formal English and Nigerian Pidgin.

---

## 3. Hackathon Rubric Alignment

### 3.1 Problem and Market Impact
* **Market Scope**: Over 39.6 million Nigerian MSMEs drive 48% of GDP but lack access to formal credit markets.
* **Credit Gap**: The IFC and Central Bank of Nigeria document an annual MSME financing shortfall exceeding $32 billion.
* **Data Exclusion**: Over 90% of informal merchants rely on digital POS flows rather than audited books, leaving them unrated by bureaus.
* **Economic Bridge**: CrediFair AI qualifies solvent merchants using transaction density, opening working-capital access.

### 3.2 Technical Rigor and Mathematical Depth
* **Predictive Model**: Gradient-boosted trees (XGBRegressor) estimate default probabilities from empirical transaction signals.
* **Distribution-Free ICP**: Implemented via MapieRegressor to bound risk without assuming normal cashflow distributions.
* **Data Partitioning**: 60% training, 20% calibration, and 20% holdout testing preserves strict data exchangeability.
* **Coverage Guarantee**: Certified 95% marginal coverage (alpha = 0.05) expands intervals during volatile periods.
* **Uncertainty Bound**: Replaces overconfident single-point estimates with honest mathematical risk intervals.

### 3.3 Responsible AI, Regulatory Compliance, and Security
* **Statutory Compliance**: NDPA 2023 Section 37 blocks automated lending, requiring designated human underwriter sign-off.
* **Cryptographic Auditing**: Generates RFC 8785 canonical manifests sealed with SHA-256 digests over metrics and decisions.
* **Privacy Protection**: In-memory regex scrubbers mask 11-digit BVNs, NINs, phone numbers, and emails per NDPA Section 24.
* **Application Security**: Enforces 5MB limits (CWE-400), blocks formula injection (CWE-1236), and filters prompt injections.
* **Forensic Detection**: Algorithms identify wash trading, circular transfers, and sudden 48-hour volume concentration spikes.

### 3.4 Usability, Explainability, and Localization
* **Officer Reports**: Formal English summaries detail liquidity ratios, volatility metrics, and debt-service bounds.
* **Merchant Guidance**: Nigerian Pidgin advisories translate financial metrics into practical cashflow recommendations.
* **Actionable Recourse**: Adverse decisions specify exact metric triggers and prescribe concrete steps for re-application.

---

## 4. Architectural Data Flow

![CrediFair AI Architectural Data Flow](assets/architecture_data_flow.svg)

---

## 5. Decision Routing Thresholds

Underwriting recommendations depend strictly on the upper risk bound of the 95% conformal interval. This three-tier matrix guides credit committee decisions:

| Conformal Interval Upper Bound | Underwriting Determination | Operational Routing Action |
| :--- | :--- | :--- |
| Upper Bound <= 20.0% | Recommended for Approval | Low-risk profile with proven liquidity stability. Eligible for facility origination following supervisory officer sign-off. |
| 20.0% < Upper Bound <= 45.0% | Flagged for Manual Review | Moderate volatility or limited historical span. Requires officer inspection of supplier receipts or inventory cycles. |
| Upper Bound > 45.0% | Recommended for Decline | High default risk or pronounced turnover deficit. Generates structured remediation advisory for future re-application. |

---

## 6. Repository Structure

```text
credifair-ai/
├── api.py                      # FastAPI REST endpoints for headless clients
├── app.py                      # Streamlit inspection and underwriting dashboard
├── credifair_compliance.py     # NDPA Section 37 compliance interceptor and PII scrubber
├── credifair_engine.py         # XGBoost and MAPIE conformal prediction engine
├── credifair_explainability.py # Dual-language LLM and deterministic fallback router
├── credifair_forensics.py      # Forensic wash trading and transaction anomaly detector
├── credifair_ingestion.py      # Decimal-precision financial parser and feature extractor
├── credifair_parser.py         # Multi-format CSV and PDF statement parser
├── credifair_security.py       # Input validation, CWE guards, and prompt sanitizers
├── run_live_audit.py           # Command-line statement audit tool
├── seed_data.py                # Generic MSME archetype definitions and legacy test aliases
├── requirements.txt            # Pinned system dependencies
├── LICENSE                     # Apache License, Version 2.0
├── .gitignore                  # Git exclude specifications
└── tests/
    ├── __init__.py
    ├── test_credifair.py       # Unit tests for ML coverage, PII redaction, and precision
    ├── test_forensics.py       # Unit tests for wash trading and volume spikes
    ├── test_api.py             # FastAPI client endpoint and sign-off tests
    └── test_api_llm.py         # Tests for provider fallback, CORS, and upload limits
```

---

## 7. Installation and Quickstart

### Prerequisites
* **Supported OS**: Linux or Windows Subsystem for Linux (WSL2 Ubuntu).
* **Python Runtime**: Python 3.10, 3.11, or 3.12.

### Step 1: Environment Setup
```bash
git clone https://github.com/jezreal-dev/credifair.ai.git credifair-ai
cd credifair-ai

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

### Step 2: Dependency Installation
```bash
pip install --no-cache-dir -r requirements.txt
```

### Step 3: API Key Configuration (Optional)
Configure an environment file for optional live cloud language model routing. When omitted, the engine defaults to deterministic offline explanations without interruption:
```bash
cat << 'EOF' > .env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FIREWORKS_API_KEY=your_fireworks_api_key_here
EOF
```

### Step 4: Launch Services
Launch backend and frontend services using the commands below. Each component runs independently to support automated audits or visual underwriting:

* **REST API**: Launch FastAPI at port 8000 with interactive docs at `http://localhost:8000/docs`.
```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

* **Dashboard**: Launch the Streamlit underwriting review application at `http://localhost:8501`.
```bash
streamlit run app.py
```

* **CLI Audit**: Execute a live statement audit against sample merchant transactions.
```bash
python run_live_audit.py --file sample_bodija_market_statement.csv --merchant-name "Bodija Retail Archetype"
```

---

## 8. Verified Test Suite Output

Automated test suites confirm end-to-end system integrity across all modules. All 19 unit and integration tests pass consistently.

<details>
<summary>Click to inspect passing pytest execution log (19 passed)</summary>

```text
============================= test session starts ==============================
platform linux -- Python 3.12.3, pytest-9.1.1, pluggy-1.6.0
cachedir: .pytest_cache
rootdir: /home/jmomoh/credifair_ai/credifair-ai
plugins: anyio-4.15.1
collected 19 items

tests/test_api.py::test_health_endpoint PASSED                           [  5%]
tests/test_api.py::test_profiles_endpoint PASSED                         [ 10%]
tests/test_api.py::test_assess_profile_endpoint PASSED                   [ 15%]
tests/test_api.py::test_analyze_endpoint_with_csv PASSED                 [ 21%]
tests/test_api.py::test_sign_off_endpoint PASSED                         [ 26%]
tests/test_api_llm.py::test_health_check_and_secret_isolation PASSED     [ 31%]
tests/test_api_llm.py::test_cors_headers_present PASSED                  [ 36%]
tests/test_api_llm.py::test_dual_language_format_and_offline_fallback PASSED [ 42%]
tests/test_api_llm.py::test_appsec_file_upload_limit PASSED              [ 47%]
tests/test_credifair.py::test_conformal_engine_coverage_and_archetype_decisions PASSED [ 52%]
tests/test_credifair.py::test_conformal_interval_elasticity PASSED       [ 57%]
tests/test_credifair.py::test_zerodivisionerror_defensive_handling PASSED [ 63%]
tests/test_credifair.py::test_deep_pii_redaction_in_text_descriptions PASSED [ 68%]
tests/test_credifair.py::test_currency_decimal_precision_no_float_drift PASSED [ 73%]
tests/test_credifair.py::test_security_csv_validation_and_injection_filter PASSED [ 78%]
tests/test_forensics.py::test_clean_retail_ledger_passes_forensics PASSED [ 84%]
tests/test_forensics.py::test_round_trip_wash_trading_detection PASSED   [ 89%]
tests/test_forensics.py::test_turnover_spike_anomaly_detection PASSED    [ 94%]
tests/test_forensics.py::test_api_integration_preserves_contract PASSED  [100%]

======================== 19 passed, 1 warning in 5.63s =========================
```

</details>

---

## 9. Standards and Licensing

* **Regulatory Laws**: Conforms to NDPA 2023 Section 37 (Automated Decisions) and Section 24 (Data Minimization).
* **Ethical Guidance**: Adheres to NITDA Ethical AI principles for algorithmic transparency and traceability.
* **Application Security**: Implements OWASP Top 10 defenses for CWE-400, CWE-1236, and OWASP LLM01 injection.
* **Cryptographic Standards**: Follows RFC 8785 canonical JSON formatting and FIPS 180-4 SHA-256 digital seals.
* **Open Source License**: Distributed under the Apache License, Version 2.0 terms. Refer to LICENSE for details.
