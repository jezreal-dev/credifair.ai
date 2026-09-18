"""
CrediFair AI: Live Statement Audit CLI Runner
Executes the non-mocked, end-to-end evaluation pipeline on real CSV/PDF bank statements.
"""
import argparse
import os
import sys
import json
from decimal import Decimal
from credifair_parser import StatementParser
from credifair_engine import CrediFairEngine
from credifair_compliance import CrediFairComplianceGuard
from credifair_explainability import generate_dual_language_explanation


def run_audit(file_path: str, loan_amount: int = 750_000, merchant_name: str = "Merchant Applicant", officer_id: str = "LO-CLI-001") -> None:
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}", file=sys.stderr)
        sys.exit(1)

    print(f"\n{'='*70}")
    print(f"CREDIFAIR AI: LIVE STATEMENT AUDIT RUNNER")
    print(f"{'='*70}")
    print(f"Target Document: {file_path}")
    print(f"Applicant Name:  {merchant_name}")
    print(f"Requested Loan:  ₦{loan_amount:,.2f}")
    print(f"{'='*70}\n")

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    # Step 1: Parse statement & extract real empirical features
    print("[1/5] Ingesting document & extracting empirical features...")
    parsed_df, features = StatementParser.parse_statement(
        file_content=file_bytes,
        filename=os.path.basename(file_path),
        loan_requested=loan_amount
    )

    print(f"  • Total Transactions Parsed: {features['total_tx_count']}")
    print(f"  • Credit Inflow Rows:        {features['credit_tx_count']}")
    print(f"  • Calendar Span:             {features['span_days']} days")
    print(f"  • Normalized Monthly Inflow: ₦{features['monthly_inflow_decimal']:,.2f}")
    print(f"  • Empirical Cashflow CV:     {features['volatility']}%")
    print(f"  • Daily Credit Velocity:     {features['daily_tx']} tx/day")
    print(f"  • Context Driver:            {features['primary_driver']}")

    # Step 2: Deep PII Sanitization preview
    print("\n[2/5] Enforcing NDPA 2023 Deep PII Scrubbing...")
    sanitized_preview = parsed_df.head(3)
    print(f"  • First 3 sanitized transaction records:")
    for _, row in sanitized_preview.iterrows():
        print(f"    - [{row['date']}] ₦{row['amount_decimal']:,.2f} | {row['description']}")

    # Step 3: Conformal Prediction Inference
    print("\n[3/5] Executing Calibrated Conformal Risk Engine...")
    engine = CrediFairEngine(random_state=42)
    engine.train_and_calibrate(synthetic_samples=800)

    risk_results = engine.predict_risk_band(
        monthly_inflow=features["monthly_inflow_float"],
        volatility=features["volatility"],
        daily_tx=features["daily_tx"]
    )

    print(f"  • Point Risk of Default:     {risk_results['point_risk_pct']}%")
    print(f"  • 95% Conformal Bounds:      [{risk_results['lower_bound_pct']}% to {risk_results['upper_bound_pct']}%]")
    print(f"  • Conformal Interval Width:  {risk_results['upper_bound_pct'] - risk_results['lower_bound_pct']:.2f}%")
    print(f"  • Underwriting Decision:     >>> {risk_results['recommendation']} <<<")
    print(f"  • Holdout Empirical Cov:     {risk_results['empirical_calibration_coverage']*100:.1f}%")

    # Step 4: Dual-Language Explainability via Groq
    print("\n[4/5] Generating Dual-Language Explainability Guidance...")
    explanation = generate_dual_language_explanation(
        merchant_name=merchant_name,
        loan_amount=loan_amount,
        point_risk=risk_results["point_risk_pct"],
        lower_bound=risk_results["lower_bound_pct"],
        upper_bound=risk_results["upper_bound_pct"],
        recommendation=risk_results["recommendation"],
        primary_driver=features["primary_driver"]
    )

    if "raw_explanation" in explanation:
        print("\n--- [LLM REASONING VIA GROQ (LLAMA-3.3-70B)] ---")
        print(explanation["raw_explanation"])
    else:
        print("\n--- [OFFICER AUDIT REPORT (ENGLISH)] ---")
        print(explanation.get("officer_report", ""))
        print("\n--- [MERCHANT ADVISORY (NIGERIAN PIDGIN)] ---")
        print(explanation.get("merchant_advisory", ""))

    # Step 5: Cryptographic SHA-256 Audit Manifest
    print("\n[5/5] Generating NDPA 2023 §37 Cryptographic Manifest...")
    manifest = CrediFairComplianceGuard.generate_audit_manifest(
        merchant_id=f"MERCH-LIVE-{abs(hash(features['primary_driver'])) % 100000:05d}",
        point_risk=risk_results["point_risk_pct"],
        lower_bound=risk_results["lower_bound_pct"],
        upper_bound=risk_results["upper_bound_pct"],
        recommendation=risk_results["recommendation"],
        officer_id=officer_id
    )

    print(json.dumps(manifest, indent=2))
    print(f"\n✅ Audit Manifest sealed under SHA-256: {manifest['audit_hash_sha256']}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CrediFair AI Live Statement Auditor")
    parser.add_argument("--file", required=True, help="Path to CSV or PDF statement file")
    parser.add_argument("--loan-amount", type=int, default=750_000, help="Requested loan amount in NGN")
    parser.add_argument("--merchant-name", default="Mama Bukky Foodstuff", help="Merchant Name")
    parser.add_argument("--officer-id", default="LO-ABUJA-741", help="Underwriting Officer Staff ID")

    args = parser.parse_args()
    run_audit(
        file_path=args.file,
        loan_amount=args.loan_amount,
        merchant_name=args.merchant_name,
        officer_id=args.officer_id
    )
