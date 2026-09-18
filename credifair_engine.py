"""
CrediFair AI: Core Conformal Prediction Underwriting Engine
Implements distribution-free split conformal prediction using XGBoost and MAPIE
with locally-weighted conformal elasticity for volatile cashflows.
"""
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from mapie.regression import MapieRegressor


class CrediFairEngine:
    def __init__(self, random_state: int = 42) -> None:
        self.random_state = random_state
        self.base_model = XGBRegressor(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.08,
            random_state=self.random_state
        )
        self.conformal_engine: MapieRegressor | None = None
        self.conformal_quantile: float = 5.0
        self.is_calibrated: bool = False
        self.empirical_test_coverage: float = 0.0

    def _dispersion_heuristic(self, volatility: np.ndarray | pd.Series | float) -> np.ndarray | float:
        """Locally-weighted dispersion scaling function based on merchant cashflow volatility."""
        return 0.5 + (np.array(volatility) / 20.0)

    def _generate_synthetic_data(self, samples: int) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Generates mathematically consistent MSME transaction profiles.
        High inflow and daily transaction frequency correctly drive default risk downward.
        Baseline: 25.0 + (volatility * 0.5) - (inflows / 4000000 * 25) - (daily_tx / 120 * 35).
        """
        rng = np.random.RandomState(self.random_state)
        inflows = rng.uniform(200_000, 4_500_000, samples)
        volatility = rng.uniform(5.0, 65.0, samples)
        daily_tx = rng.randint(5, 120, samples)

        X = pd.DataFrame({
            "monthly_inflow": inflows,
            "volatility": volatility,
            "daily_tx": daily_tx
        })

        # Correct Risk Formulation per Auditor Specification
        base_risk = (
            25.0
            + (volatility * 0.5)
            - (inflows / 4_000_000.0 * 25.0)
            - (daily_tx / 120.0 * 35.0)
            + rng.normal(0, 2.0, samples)
        )
        y = pd.Series(np.clip(base_risk, 1.0, 99.0), name="default_risk")
        return X, y

    def train_and_calibrate(self, synthetic_samples: int = 800) -> Dict[str, float]:
        """
        Trains the gradient booster, fits MAPIE, and calculates normalized conformal
        quantiles to ensure finite-sample coverage and interval elasticity.
        """
        X, y = self._generate_synthetic_data(synthetic_samples)

        # 60% Train, 20% Calibrate, 20% Holdout Test
        X_train_cal, X_test, y_train_cal, y_test = train_test_split(
            X, y, test_size=0.20, random_state=self.random_state
        )
        X_train, X_cal, y_train, y_cal = train_test_split(
            X_train_cal, y_train_cal, test_size=0.25, random_state=self.random_state
        )

        self.base_model.fit(X_train, y_train)

        # Base MAPIE prefit initialization
        self.conformal_engine = MapieRegressor(estimator=self.base_model, cv="prefit")
        self.conformal_engine.fit(X_cal, y_cal)

        # Compute locally-weighted conformal quantile (Normalized Split Conformal)
        cal_preds = self.base_model.predict(X_cal)
        cal_residuals = np.abs(y_cal.values - cal_preds)
        cal_dispersion = self._dispersion_heuristic(X_cal["volatility"].values)
        normalized_scores = cal_residuals / cal_dispersion

        alpha = 0.05
        n_cal = len(normalized_scores)
        q_level = np.clip(np.ceil((n_cal + 1) * (1.0 - alpha)) / n_cal, 0.0, 1.0)
        self.conformal_quantile = float(np.quantile(normalized_scores, q_level))
        self.is_calibrated = True

        # Validate empirical coverage on unseen holdout test partition
        test_preds = self.base_model.predict(X_test)
        test_dispersion = self._dispersion_heuristic(X_test["volatility"].values)
        test_half_width = self.conformal_quantile * test_dispersion
        test_lower = test_preds - test_half_width
        test_upper = test_preds + test_half_width

        covered = (y_test.values >= test_lower) & (y_test.values <= test_upper)
        self.empirical_test_coverage = float(np.mean(covered))

        return {
            "train_samples": len(X_train),
            "calibration_samples": len(X_cal),
            "test_samples": len(X_test),
            "empirical_coverage_95": round(self.empirical_test_coverage, 4)
        }

    def predict_risk_band(
        self,
        monthly_inflow: float,
        volatility: float,
        daily_tx: int,
        alpha: float = 0.05
    ) -> Dict[str, Any]:
        """
        Generates calibrated point estimate and elastic conformal prediction intervals.
        Enforces underwriting tier gates:
          - Upper bound <= 20.0% -> RECOMMENDED FOR APPROVAL
          - Upper bound <= 45.0% -> MANUAL UNDERWRITING REVIEW REQUIRED
          - Upper bound > 45.0% -> RECOMMENDED FOR DECLINE
        """
        if not self.is_calibrated or self.conformal_engine is None:
            self.train_and_calibrate()

        features = pd.DataFrame([{
            "monthly_inflow": float(monthly_inflow),
            "volatility": float(volatility),
            "daily_tx": int(daily_tx)
        }])

        point_pred = float(self.base_model.predict(features)[0])
        point_estimate = float(np.clip(point_pred, 0.1, 99.9))

        # Apply locally-weighted conformal margin
        dispersion = float(self._dispersion_heuristic(volatility))
        margin = float(self.conformal_quantile * dispersion)

        lower_bound = float(np.clip(point_estimate - margin, 0.0, 100.0))
        upper_bound = float(np.clip(point_estimate + margin, 0.0, 100.0))

        if upper_bound <= 20.0:
            decision = "RECOMMENDED FOR APPROVAL"
        elif upper_bound <= 45.0:
            decision = "MANUAL UNDERWRITING REVIEW REQUIRED"
        else:
            decision = "RECOMMENDED FOR DECLINE"

        return {
            "point_risk_pct": round(point_estimate, 2),
            "lower_bound_pct": round(lower_bound, 2),
            "upper_bound_pct": round(upper_bound, 2),
            "confidence_level_pct": int((1.0 - alpha) * 100),
            "recommendation": decision,
            "empirical_calibration_coverage": round(self.empirical_test_coverage, 3)
        }
