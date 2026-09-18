# 🛡️ CrediFair AI (`credifair.ai`)

> **Statistically calibrated, explainable credit underwriting pipeline for Nigerian micro, small, and medium enterprises (MSMEs).**

[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-v2.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Conformal Prediction](https://img.shields.io/badge/MAPIE-Conformal%2095%25-green.svg)](https://mapie.readthedocs.io/)
[![Compliance](https://img.shields.io/badge/NDPA%202023-%C2%A737%20Compliant-success.svg)](https://ndpc.gov.ng/)
[![Tests](https://img.shields.io/badge/pytest-19%20passed-brightgreen.svg)]()

---

## Technical Overview

Over 90 percent of informal merchants in Nigeria lack formal audited accounts or landed property collateral required by commercial lending frameworks. Traditional point-prediction credit models generate static, overconfident default probabilities that fail to account for cash-flow variance in volatile retail environments.

CrediFair AI ingests raw digital point-of-sale (POS) and commercial bank statements to evaluate credit risk using distribution-free **Inductive Conformal Prediction (ICP)**. Instead of a single risk score, the pipeline generates a statistically valid 95 percent confidence interval:

$$\mathbb{P}\left(Y \in \left[\hat{y}_{\text{lower}}, \hat{y}_{\text{upper}}\right]\right) \ge 1 - \alpha \quad (\alpha = 0.05)$$

The system couples these statistical bounds with a dual-language large language model (LLM) advisory interface and enforces statutory compliance under Section 37 of the **Nigeria Data Protection Act (NDPA) 2023**.

---

## Architectural Components

### 1. Statistical Risk Engine (`credifair_engine.py`)
* **Base Regressor:** Gradient-boosted decision trees (`XGBRegressor`) fitted to transactional vitals, including monthly inflow sums, coefficient of variation, and daily transaction frequency.
* **Calibration Layer:** `MapieRegressor` implementing split conformal prediction across three partitions (60% train, 20% calibration, 20% test) to ensure data exchangeability.
* **Guarantees:** Generates finite-sample valid prediction intervals at significance level $\alpha = 0.05$. The upper and lower risk bounds dictate three routing pathways:
  * **Upper bound $\le$ 20.0%:** Recommended for Approval.
  * **Upper bound $\le$ 45.0%:** Flagged for Manual Underwriter Review.
  * **Upper bound $>$ 45.0%:** Recommended for Decline.

### 2. Regulatory Compliance Guard (`credifair_compliance.py`)
* **Automated Decision Safeguards:** Complies with NDPA 2023 Section 37 by classifying model outputs as advisory recommendations. Solely automated lending decisions are programmatically restricted.
* **Cryptographic Audit Logs:** Generates a deterministic SHA-256 digital signature over input metrics, bounds, decision status, and officer IDs to produce tamper-evident audit trails.
* **Data Minimization:** Scans and strips statutory identifiers (Bank Verification Numbers, National Identification Numbers, telephone numbers, and account records) from tabular columns and free-text transaction notes.

### 3. Application Security Controls (`credifair_security.py`)
* **Payload Constraints:** Enforces a 5 MB upload ceiling to mitigate Denial of Service vectors (CWE-400).
* **Schema Enforcement:** Requires strict column whitelisting on incoming structured files.
* **Prompt Hardening:** Filters command-override keywords and structural delimiters to defend against Indirect Prompt Injection (OWASP LLM01) and sensitive data leakage (OWASP LLM06).
* **Formula Neutralization:** Neutralizes CSV Formula Injection (CWE-1236 / DDE) on exported transaction records.

### 4. Dual-Language Explainability Gateway (`credifair_explainability.py`)
* **Multi-Provider Support:** Automated routing across Groq Cloud (`Llama-3.3-70b-versatile`), Google Gemini (`Gemini-2.5-flash`), Fireworks AI (`Llama-v3p3-70b-instruct`), or an internal deterministic fallback engine.
* **Dual Output Formatting:**
  * **Credit Officer Audit Report:** Formal financial English detailing variance triggers, liquidity indices, and debt-service capacity.
  * **Merchant Advisory:** Localized Nigerian Pidgin translating financial metrics into operational cash-flow guidance.

### 5. Ingestion and Presentation Interfaces
* **Ingestion Pipeline (`credifair_ingestion.py` & `credifair_parser.py`):** Ingests unstructured CSV ledgers and PDF exports using `decimal.Decimal` arithmetic with `ROUND_HALF_UP` to eliminate floating-point currency drift.
* **Forensic Guard (`credifair_forensics.py`):** Identifies round-trip transfers, artificial wash trading, turnover concentration spikes, and velocity deficits.
* **Headless REST API (`api.py`):** Exposes FastAPI endpoints with Cross-Origin Resource Sharing (CORS) enabled for external web clients (e.g., Lovable React/Tailwind frontends).
* **Verification Dashboard (`app.py`):** Local Streamlit interface for internal evaluation and audit reviews.
* **CLI Audit Tool (`run_live_audit.py`):** Command-line verification tool for instant file audits.

---

## Repository Structure

```text
credifair-ai/
├── api.py                      # FastAPI REST endpoints for external clients
├── app.py                      # Streamlit inspection interface
├── credifair_compliance.py     # NDPA 2023 Section 37 compliance interceptor & PII scrubber
├── credifair_engine.py         # XGBoost and MAPIE conformal prediction logic
├── credifair_explainability.py # Multi-provider LLM explainability router
├── credifair_forensics.py      # Forensic wash trading & transaction anomaly detector
├── credifair_ingestion.py      # Decoupled Decimal financial pipeline & feature extraction
├── credifair_parser.py         # Multi-format CSV and PDF statement parser
├── credifair_security.py       # Input validation, CWE defenses, and prompt injection filters
├── run_live_audit.py           # End-to-end CLI statement audit tool
├── requirements.txt            # Pinned system dependencies
├── seed_data.py                # Deterministic validation profiles & merchant archetypes
├── LICENSE                     # Apache License, Version 2.0
├── .gitignore                  # Git exclude patterns
└── tests/
    ├── __init__.py
    ├── test_credifair.py       # Unit tests for ML bounds, PII sanitization, and security
    ├── test_forensics.py       # Unit tests for wash trading and volume concentration
    ├── test_api.py             # Core FastAPI endpoint tests
    └── test_api_llm.py         # Integration tests for API, CORS, and provider routing
```

---

## Installation and Setup

### Prerequisites
* **Operating System:** Linux or WSL2 (Ubuntu recommended)
* **Python Version:** Python 3.10 to Python 3.12

### Step 1: Clone Repository and Prepare Virtual Environment
```bash
git clone https://github.com/jezreal-dev/credifair.ai.git
cd credifair.ai

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

### Step 2: Install Dependencies
```bash
pip install --no-cache-dir -r requirements.txt
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:

```ini
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
FIREWORKS_API_KEY=your_fireworks_key_here
```

*Note: If no API keys are provided, the system defaults automatically to the deterministic offline explanation engine.*

---

## Usage

### Run the FastAPI Server (Headless Mode)
Use this mode to serve external web frontends such as Lovable (React / Tailwind):

```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

* **Interactive API Documentation:** http://localhost:8000/docs
* **Health Check Probe:** http://localhost:8000/api/v1/health

### Run the Streamlit Dashboard (Internal Review)
Use this mode to inspect the pipeline locally:

```bash
streamlit run app.py
```

Access the application at `http://localhost:8501`.

### Run a Live Statement Audit via CLI
```bash
python run_live_audit.py --file sample_bodija_market_statement.csv --merchant-name "Bodija Retail Archetype"
```

---

## Automated Testing

Execute the test suite to verify statistical monotonicity, conformal coverage, PII redaction, file upload constraints, and API status codes:

```bash
pytest tests/ -v
```

---

## Compliance and Security Standards

This project implements technical controls aligned with the following frameworks:

* **NDPA 2023 Section 37:** Prohibition of solely automated profiling decisions without human underwriter intervention.
* **NDPA 2023 Section 24:** Principles of personal data processing, data minimization, and indirect identifier masking.
* **NITDA Ethical AI Principles:** Traceability, model interpretability, and algorithmic accountability.
* **OWASP Top 10:** CWE-400 (Resource Exhaustion / 5MB ceiling), CWE-434 (Unrestricted File Upload), and CWE-1236 (CSV Formula Injection).
* **OWASP Top 10 for LLM Applications:** Mitigation of LLM01 (Prompt Injection) and LLM06 (Sensitive Information Disclosure).

---

## License

Licensed under the Apache License, Version 2.0. Refer to the [LICENSE](LICENSE) file for terms and conditions.

---

## Author & Attribution
* **Lead Developer:** Jezreal Momoh ([@jezreal-dev](https://github.com/jezreal-dev))
* **Project:** CrediFair AI (`credifair.ai`)
* **Track:** MIT Open Learning / 3MTT Universal AI Innovation Challenge
