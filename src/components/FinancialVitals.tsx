import React, { useEffect, useState } from 'react';
import { Database, ShieldAlert, CheckCircle, ArrowUpRight, TrendingUp, Activity } from 'lucide-react';
import { MerchantVitals, TransactionRecord } from '../types';

interface FinancialVitalsProps {
  vitals: MerchantVitals;
  sampleRecords: TransactionRecord[];
}

export const FinancialVitals: React.FC<FinancialVitalsProps> = ({ vitals, sampleRecords }) => {
  // High-velocity counter animation for inflow and loan capacity
  const [displayInflow, setDisplayInflow] = useState(0);
  const [displayFacility, setDisplayFacility] = useState(0);

  useEffect(() => {
    let start = 0;
    const endInflow = vitals.monthly_inflow;
    const endFacility = vitals.loan_requested;
    const duration = 350; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayInflow(Math.round(endInflow * easeOut));
      setDisplayFacility(Math.round(endFacility * easeOut));

      if (step >= totalSteps) {
        clearInterval(timer);
        setDisplayInflow(endInflow);
        setDisplayFacility(endFacility);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [vitals.monthly_inflow, vitals.loan_requested]);

  // Qualitative stability assessment based on cashflow volatility per Directive #2
  const getVolatilityRating = (vol: number) => {
    if (vol <= 25) {
      return {
        label: 'Low Variance',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      };
    }
    if (vol <= 50) {
      return {
        label: 'Moderate Dispersion',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      };
    }
    return {
      label: 'High Dispersion',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    };
  };

  const volRating = getVolatilityRating(vitals.volatility);

  // Velocity micro-badge
  const velocityBadge =
    vitals.daily_tx >= 30
      ? { label: 'High Daily Velocity', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
      : vitals.daily_tx >= 15
        ? { label: 'Medium Velocity', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' }
        : { label: 'Batch Cyclical', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };

  return (
    <div
      id="financial-vitals-panel"
      className="bg-[#121824] rounded-xl border border-slate-800/80 p-5 sm:p-6 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 tracking-tight">
            Financial Vitals &amp; Normalized Run-Rate
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Raw POS and ledger metrics scrubbed per NDPA 2023 §24; non-point risk features extracted
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 text-xs font-mono font-medium text-slate-300 border border-slate-800">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>{vitals.merchant_id}</span>
        </div>
      </div>

      {/* 4-Column Metric Cards with subtle top border accents per Directive #3.B */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5 font-mono">
        {/* 1. Monthly Inflow Card */}
        <div
          id="metric-inflow"
          className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80 border-t-2 border-t-blue-500/50 hover:border-slate-700 transition-colors"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Monthly Inflow</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-50 tabular-nums">
            ₦{displayInflow.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-sans">30-day run-rate</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Verified
            </span>
          </div>
        </div>

        {/* 2. Cashflow Volatility Card */}
        <div
          id="metric-volatility"
          className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80 border-t-2 border-t-indigo-500/50 hover:border-slate-700 transition-colors"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Cashflow Volatility</span>
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-50 tabular-nums">
            {vitals.volatility.toFixed(1)}%
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-sans">CoV index</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border ${volRating.color}`}>
              {volRating.label}
            </span>
          </div>
        </div>

        {/* 3. Daily POS Count Card */}
        <div
          id="metric-velocity"
          className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80 border-t-2 border-t-cyan-500/50 hover:border-slate-700 transition-colors"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Daily POS Count</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-50 tabular-nums">
            {vitals.daily_tx} tx/day
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-sans">{vitals.total_records} tx in {vitals.active_days}d</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border ${velocityBadge.color}`}>
              {velocityBadge.label}
            </span>
          </div>
        </div>

        {/* 4. Debt Capacity Card */}
        <div
          id="metric-loan"
          className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80 border-t-2 border-t-emerald-500/50 hover:border-slate-700 transition-colors"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Debt Capacity</span>
            <span className="text-[10px] text-emerald-400 font-sans font-semibold">35% DSR</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">
            ₦{displayFacility.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-sans">Suggested ceiling</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Approved Cap
            </span>
          </div>
        </div>
      </div>

      {/* Forensic Risk Guard Status per Directive #2 */}
      {vitals.forensic_audit && (
        <div
          id="forensic-guard-banner"
          className={`mb-5 px-4 py-2.5 rounded-lg border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
            vitals.forensic_audit.is_flagged
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {vitals.forensic_audit.is_flagged ? (
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-semibold text-slate-200">Forensic Integrity Audit:</span>
            <span className="text-slate-300">{vitals.forensic_audit.forensic_flags.join(' • ')}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px]">
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Round-Sum Ratio: {vitals.forensic_audit.round_trip_ratio_pct}%
            </span>
            <span
              className={`px-2 py-0.5 rounded font-semibold uppercase tracking-wider border ${
                vitals.forensic_audit.fraud_risk_level === 'CLEAN'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {vitals.forensic_audit.fraud_risk_level}
            </span>
          </div>
        </div>
      )}

      {/* Cashflow Context Note */}
      <div className="px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2 mb-5 font-mono">
        <span className="text-slate-400 font-semibold shrink-0">Cashflow Profile:</span>
        <span className="font-sans text-slate-300">{vitals.driver}</span>
      </div>

      {/* Sanitized Transactions Table with high-density Slate styling */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-200 font-mono">
            Sanitized Ledger Sample (PII Redacted)
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            NDPA 2023 §24 Compliant
          </span>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121824] text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Amount (₦)</th>
                {sampleRecords.some((r) => r.balance !== undefined) && (
                  <th className="py-2.5 px-3 text-right">Balance (₦)</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sampleRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-900/70 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap text-[11px] tabular-nums">
                    {r.date}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs truncate text-slate-200 font-sans">
                    {r.description.includes('[REDACTED') ? (
                      <span className="font-mono text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded text-[11px] border border-amber-500/30">
                        {r.description}
                      </span>
                    ) : (
                      r.description
                    )}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    {r.category || 'General'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-50 whitespace-nowrap tabular-nums">
                    ₦{r.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {r.balance !== undefined && (
                    <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums whitespace-nowrap text-[11px]">
                      ₦{r.balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
