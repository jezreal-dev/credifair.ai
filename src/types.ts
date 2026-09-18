export interface TransactionRecord {
  date: string;
  amount: number;
  category?: string;
  description: string;
  balance?: number;
}

export interface MerchantVitals {
  merchant_id: string;
  merchant_name?: string;
  monthly_inflow: number;
  monthly_inflow_formatted?: string;
  volatility: number;
  daily_tx: number;
  loan_requested: number;
  total_records: number;
  active_days: number;
  driver: string;
}

export interface ConformalRisk {
  point_risk_pct: number;
  lower_bound_pct: number;
  upper_bound_pct: number;
  confidence_level_pct: number;
  recommendation: 'RECOMMENDED FOR APPROVAL' | 'MANUAL UNDERWRITING REVIEW REQUIRED' | 'RECOMMENDED FOR DECLINE';
  empirical_calibration_coverage: number;
}

export interface DualLanguageExplanation {
  provider: string;
  model: string;
  is_live_connection: boolean;
  content: string;
  officer_report?: string;
  merchant_advisory?: string;
  raw_explanation?: string;
}

export interface AuditManifest {
  ndpa_compliance: string;
  statutory_mandate: string;
  audit_hash_sha256: string;
  timestamp_utc: string;
  pseudonymized_id: string;
  conformal_metrics: {
    point_risk_pct: number;
    confidence_interval_95: [number, number];
    alpha: number;
  };
  governance_status: {
    recommendation: string;
    solely_automated_execution: boolean;
    assigned_officer: string;
    signature_status: string;
  };
}

export interface AnalysisResponse {
  status: string;
  merchant_vitals: MerchantVitals;
  conformal_risk: ConformalRisk;
  llm_explanation: DualLanguageExplanation;
  sample_records: TransactionRecord[];
}

export interface PreloadedProfile {
  name: string;
  monthly_inflow: number;
  volatility: number;
  daily_tx: number;
  loan_requested: number;
  driver: string;
  csv_key: string;
}

export interface HealthResponse {
  status: string;
  engine_calibrated: boolean;
  empirical_test_coverage_95: number;
  llm_connection: {
    is_connected: boolean;
    provider: string;
    active_model: string;
    status_badge: string;
  };
}
