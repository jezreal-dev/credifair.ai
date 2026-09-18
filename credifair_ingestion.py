"""
CrediFair AI: Financial Data Ingestion & Feature Engineering Pipeline
Handles currency parsing using decimal.Decimal, defensive volatility calculation,
and deterministic merchant identification.
"""
from typing import Dict, Any, Tuple
from decimal import Decimal, ROUND_HALF_UP
import hashlib
import numpy as np
import pandas as pd


class FinancialDataPipeline:
    @staticmethod
    def parse_currency(value: Any) -> Decimal:
        """Parses an arbitrary value into a Decimal rounded to 2 decimal places."""
        if isinstance(value, Decimal):
            return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        try:
            val_str = str(value).replace(",", "").replace("₦", "").replace("$", "").strip()
            return Decimal(val_str).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        except Exception:
            return Decimal("0.00")

    @classmethod
    def calculate_volatility(cls, amounts: pd.Series) -> float:
        """
        Calculates volatility as the coefficient of variation (CV = std / mean * 100).
        Clamped defensively between 5.0% and 95.0%.
        Guarantees no ZeroDivisionError on empty, single-entry, or zero-mean series.
        """
        if len(amounts) < 2:
            return 25.0

        numeric_vals = pd.to_numeric(amounts, errors="coerce").dropna()
        if len(numeric_vals) < 2:
            return 25.0

        mean_val = float(numeric_vals.mean())
        if abs(mean_val) < 1e-6:
            return 25.0

        std_val = float(numeric_vals.std(ddof=1))
        cv = (std_val / abs(mean_val)) * 100.0
        return float(np.clip(cv, 5.0, 95.0))

    @classmethod
    def calculate_transaction_velocity(cls, df: pd.DataFrame) -> Tuple[int, int]:
        """
        Computes daily transaction count and total span in calendar days.
        Guarantees span_days >= 1.
        """
        if len(df) == 0:
            return 1, 1

        span_days = 30
        if "date" in df.columns:
            try:
                date_col = pd.to_datetime(df["date"], errors="coerce").dropna()
                if len(date_col) >= 2:
                    delta = (date_col.max() - date_col.min()).days
                    span_days = max(1, delta)
            except Exception:
                span_days = max(1, len(df) // 10)

        daily_tx = max(1, int(round(len(df) / span_days)))
        return daily_tx, span_days

    @classmethod
    def generate_deterministic_merchant_id(cls, seed_text: str) -> str:
        """Generates an immutable, deterministic merchant pseudonym using SHA-256."""
        normalized = (seed_text or "MERCHANT_ANONYMOUS").strip().encode("utf-8")
        digest = hashlib.sha256(normalized).hexdigest()[:8].upper()
        return f"MERCH-{digest}"

    @classmethod
    def process_ledger(
        cls,
        df: pd.DataFrame,
        merchant_name: str = "Merchant Applicant",
        loan_requested: Any = 500_000,
        custom_driver: str = "Custom uploaded ledger data with parsed merchant transaction velocity."
    ) -> Dict[str, Any]:
        """
        Ingests and aggregates ledger records using Decimal arithmetic.
        Outputs exact Decimal representations for reporting and float features for ML.
        """
        if len(df) == 0:
            zero_dec = Decimal("0.00")
            return {
                "merchant_id": cls.generate_deterministic_merchant_id(merchant_name),
                "merchant_name": merchant_name,
                "monthly_inflow_decimal": zero_dec,
                "monthly_inflow_float": 0.0,
                "loan_requested_decimal": cls.parse_currency(loan_requested),
                "volatility": 25.0,
                "daily_tx": 1,
                "span_days": 1,
                "tx_count": 0,
                "driver": custom_driver
            }

        # Accurate Decimal summation to prevent float drift
        decimal_amounts = [cls.parse_currency(val) for val in df["amount"]]
        total_inflow_dec = sum(decimal_amounts, Decimal("0.00"))

        daily_tx, span_days = cls.calculate_transaction_velocity(df)
        volatility = cls.calculate_volatility(df["amount"])

        # Normalize to 30-day monthly inflow
        monthly_multiplier = Decimal(str(round(30.0 / span_days, 4))) if span_days > 0 else Decimal("1.00")
        monthly_inflow_dec = (total_inflow_dec * monthly_multiplier).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        return {
            "merchant_id": cls.generate_deterministic_merchant_id(merchant_name + custom_driver),
            "merchant_name": merchant_name,
            "monthly_inflow_decimal": monthly_inflow_dec,
            "monthly_inflow_float": float(monthly_inflow_dec),
            "loan_requested_decimal": cls.parse_currency(loan_requested),
            "volatility": round(volatility, 2),
            "daily_tx": daily_tx,
            "span_days": span_days,
            "tx_count": len(df),
            "driver": custom_driver
        }
