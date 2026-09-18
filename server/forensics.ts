import { TransactionRecord } from '../src/types';

export interface ForensicAuditResult {
  is_flagged: boolean;
  fraud_risk_level: 'CLEAN' | 'ELEVATED' | 'HIGH';
  risk_penalty_points: number;
  forensic_flags: string[];
  round_trip_ratio_pct: number;
  volume_concentration_pct: number;
}

export class ForensicRiskGuard {
  /**
   * Analyzes merchant transaction records for wash-trading,
   * round-tripping, artificial turnover inflation, and dormant ledger anomalies.
   */
  static analyzeLedgerForensics(records: TransactionRecord[]): ForensicAuditResult {
    const flags: string[] = [];
    let penalty = 0.0;

    if (!records || records.length < 5) {
      return {
        is_flagged: false,
        fraud_risk_level: 'CLEAN',
        risk_penalty_points: 0.0,
        forensic_flags: ['Minimal ledger density; baseline audit applied.'],
        round_trip_ratio_pct: 0.0,
        volume_concentration_pct: 0.0,
      };
    }

    // 1. Round-Trip / Artificial Round Number Clustering Check
    const amounts = records.map((r) => Number(r.amount) || 0);
    const roundCount = amounts.filter((a) => a >= 5000 && a % 10000 === 0).length;
    const roundRatio = roundCount / amounts.length;

    if (roundRatio >= 0.4) {
      flags.push(`Artificial Pattern: ${(roundRatio * 100).toFixed(1)}% of transactions are exact round sums.`);
      penalty += 15.0;
    }

    // 2. Date Concentration / Turnover Spike Anomaly
    let concentrationPct = 0.0;
    const dailyTotals: Record<string, number> = {};
    for (const r of records) {
      const d = (r.date || '').split('T')[0] || 'unknown';
      dailyTotals[d] = (dailyTotals[d] || 0) + (Number(r.amount) || 0);
    }

    const totalVol = Object.values(dailyTotals).reduce((a, b) => a + b, 0);
    const dayEntries = Object.values(dailyTotals).sort((a, b) => b - a);

    if (totalVol > 0 && dayEntries.length >= 5) {
      const top2Vol = (dayEntries[0] || 0) + (dayEntries[1] || 0);
      concentrationPct = (top2Vol / totalVol) * 100.0;
      if (concentrationPct >= 70.0) {
        flags.push(`Turnover Spike: ${concentrationPct.toFixed(1)}% of volume concentrated in just 2 days.`);
        penalty += 20.0;
      }
    }

    // 3. Dormant Velocity Check
    const activeDays = Math.max(1, Object.keys(dailyTotals).length);
    const txVelocity = records.length / activeDays;
    if (txVelocity < 0.4 && records.length < 15) {
      flags.push('Velocity Deficit: Transaction frequency below active merchant baseline.');
      penalty += 10.0;
    }

    // Determine qualitative severity
    let riskLevel: 'CLEAN' | 'ELEVATED' | 'HIGH' = 'CLEAN';
    if (penalty >= 25.0) {
      riskLevel = 'HIGH';
    } else if (penalty >= 10.0) {
      riskLevel = 'ELEVATED';
    }

    return {
      is_flagged: flags.length > 0,
      fraud_risk_level: riskLevel,
      risk_penalty_points: Math.round(penalty * 10) / 10,
      forensic_flags: flags.length > 0 ? flags : ['All forensic pattern integrity checks passed.'],
      round_trip_ratio_pct: Math.round(roundRatio * 1000) / 10,
      volume_concentration_pct: Math.round(concentrationPct * 10) / 10,
    };
  }
}
