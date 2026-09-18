import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple


class ForensicRiskGuard:
    """
    Forensic transaction integrity analyzer mitigating wash-trading,
    round-tripping, artificial turnover inflation, and dormant ledger anomalies.
    """

    @classmethod
    def analyze_ledger_forensics(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Runs forensic checks across transaction sizes, date concentrations, and velocity.
        Returns forensic metrics, detection flags, and calculated penalty score.
        """
        flags: List[str] = []
        penalty: float = 0.0

        if df.empty or len(df) < 5:
            return {
                "is_flagged": False,
                "fraud_risk_level": "LOW",
                "risk_penalty_points": 0.0,
                "forensic_flags": ["Minimal ledger density; baseline audit applied."],
                "round_trip_ratio_pct": 0.0,
                "volume_concentration_pct": 0.0
            }

        # 1. Round-Trip / Artificial Round Number Clustering Check
        amounts = df["amount"].astype(float).to_numpy()
        round_count = sum(1 for a in amounts if a >= 5000 and a % 10000 == 0)
        round_ratio = round_count / len(amounts)

        if round_ratio >= 0.40:
            flags.append(f"Artificial Pattern: {round_ratio * 100:.1f}% of transactions are exact round sums.")
            penalty += 15.0

        # 2. Date Concentration / Turnover Spike Anomaly
        concentration_pct = 0.0
        if "date" in df.columns:
            # Defensively ensure amounts are cast to float to avoid object dtype issues with Decimal
            daily_totals = df.assign(_amt=df["amount"].astype(float)).groupby("date")["_amt"].sum()
            total_vol = float(daily_totals.sum())
            if total_vol > 0 and len(daily_totals) >= 5:
                top_2_vol = float(daily_totals.nlargest(2).sum())
                concentration_pct = (top_2_vol / total_vol) * 100.0
                if concentration_pct >= 70.0:
                    flags.append(f"Turnover Spike: {concentration_pct:.1f}% of volume concentrated in just 2 days.")
                    penalty += 20.0

        # 3. Dormant Velocity Check
        active_days = max(1, df["date"].nunique()) if "date" in df.columns else 1
        tx_velocity = len(df) / active_days
        if tx_velocity < 0.4 and len(df) < 15:
            flags.append("Velocity Deficit: Transaction frequency below active merchant baseline.")
            penalty += 10.0

        # Determine qualitative severity
        if penalty >= 25.0:
            risk_level = "HIGH"
        elif penalty >= 10.0:
            risk_level = "ELEVATED"
        else:
            risk_level = "CLEAN"

        return {
            "is_flagged": len(flags) > 0,
            "fraud_risk_level": risk_level,
            "risk_penalty_points": round(penalty, 1),
            "forensic_flags": flags if flags else ["All forensic pattern integrity checks passed."],
            "round_trip_ratio_pct": round(round_ratio * 100, 1),
            "volume_concentration_pct": round(concentration_pct, 1)
        }
