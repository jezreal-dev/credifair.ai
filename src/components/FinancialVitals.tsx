import React, { useEffect, useState } from 'react';
import { Database, ShieldAlert, CheckCircle, ArrowUpRight, TrendingUp, Activity, CreditCard } from 'lucide-react';
import { MerchantVitals, TransactionRecord } from '../types';

interface FinancialVitalsProps {
  vitals: MerchantVitals;
  sampleRecords: TransactionRecord[];
}

export const FinancialVitals: React.FC<FinancialVitalsProps> = ({ vitals, sampleRecords }) => {
  const [displayInflow, setDisplayInflow] = useState(0);
  const [displayFacility, setDisplayFacility] = useState(0);

  useEffect(() => {
    let start = 0;
    const endInflow = vitals.monthly_inflow;
    const endFacility = vitals.loan_requested;
    const duration = 300;
    const stepTime = 15;
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

  const getVolatilityRating = (vol: number) => {
    if (vol <= 25) {
      return {
        label: 'Low Variance',
        color: 'bg-[#E4FFF8] text-[#006C51] border border-[#1DCF9F]/30',
      };
    }
    if (vol <= 50) {
      return {
        label: 'Moderate Dispersion',
        color: 'bg-amber-50 text-amber-700 border border-amber-200',
      };
    }
    return {
      label: 'High Dispersion',
      color: 'bg-rose-50 text-rose-700 border border-rose-200',
    };
  };

  const volRating = getVolatilityRating(vitals.volatility);

  return (
    <div
      id="financial-vitals-panel"
      className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_24px_rgba(33,15,96,0.05)] space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E4FFF8] text-[#006C51] flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-lg font-bold text-[#210F60] tracking-tight">
              Merchant Financial Vitals &amp; POS Run-Rate
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 pl-8">
            Terminal transaction flow scrubbed per NDPA 2023 §24; non-point risk features extracted
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F7FC] text-xs font-mono font-bold text-[#210F60] border border-slate-200">
          <Database className="w-3.5 h-3.5 text-[#1DCF9F]" />
          <span>{vitals.merchant_id}</span>
        </div>
      </div>

      {/* 4-Column Metric Cards in OPay Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* 1. Monthly Inflow */}
        <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-slate-100 relative overflow-hidden shadow-xs hover:border-[#1DCF9F]/50 transition-colors">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-sans flex items-center justify-between">
            <span>Monthly Inflow</span>
            <ArrowUpRight className="w-4 h-4 text-[#1DCF9F]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#210F60] mt-2 tabular-nums">
            ₦{displayInflow.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-3 flex items-center justify-between font-sans">
            <span className="text-[11px] text-slate-400">30-day run-rate</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4FFF8] text-[#006C51]">
              Verified
            </span>
          </div>
        </div>

        {/* 2. Cashflow Volatility */}
        <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-slate-100 relative overflow-hidden shadow-xs hover:border-[#1DCF9F]/50 transition-colors">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-sans flex items-center justify-between">
            <span>Cashflow Volatility</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#210F60] mt-2 tabular-nums">
            {vitals.volatility.toFixed(1)}%
          </div>
          <div className="mt-3 flex items-center justify-between font-sans">
            <span className="text-[11px] text-slate-400">CoV Index</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${volRating.color}`}>
              {volRating.label}
            </span>
          </div>
        </div>

        {/* 3. Daily POS Count */}
        <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-slate-100 relative overflow-hidden shadow-xs hover:border-[#1DCF9F]/50 transition-colors">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-sans flex items-center justify-between">
            <span>Daily POS Count</span>
            <TrendingUp className="w-4 h-4 text-[#1DCF9F]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#210F60] mt-2 tabular-nums">
            {vitals.daily_tx} tx/day
          </div>
          <div className="mt-3 flex items-center justify-between font-sans">
            <span className="text-[11px] text-slate-400">{vitals.total_records} tx in {vitals.active_days}d</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4FFF8] text-[#006C51]">
              High Velocity
            </span>
          </div>
        </div>

        {/* 4. Suggested Debt Capacity */}
        <div className="p-5 rounded-2xl bg-[#F4FFF8] border border-[#1DCF9F]/40 relative overflow-hidden shadow-xs">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#006C51] font-sans flex items-center justify-between">
            <span>Debt Capacity</span>
            <span className="text-[10px] font-bold bg-[#1DCF9F]/30 text-[#006C51] px-1.5 py-0.5 rounded">35% DSR</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#006C51] mt-2 tabular-nums">
            ₦{displayFacility.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-3 flex items-center justify-between font-sans">
            <span className="text-[11px] text-slate-500">Approved Ceiling</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1DCF9F] text-[#210F60]">
              Facility Cap
            </span>
          </div>
        </div>
      </div>

      {/* Forensic Guard Banner */}
      {vitals.forensic_audit && (
        <div
          className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            vitals.forensic_audit.is_flagged
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-[#F4FFF8] border-[#1DCF9F]/30 text-[#006C51]'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {vitals.forensic_audit.is_flagged ? (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#1DCF9F] shrink-0" />
            )}
            <span className="font-bold">Forensic Integrity Audit:</span>
            <span>{vitals.forensic_audit.forensic_flags.join(' • ')}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
            <span className="bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
              Round-Trip: {vitals.forensic_audit.round_trip_ratio_pct}%
            </span>
            <span className="bg-[#1DCF9F] text-[#210F60] font-extrabold px-2.5 py-1 rounded-full uppercase">
              {vitals.forensic_audit.fraud_risk_level}
            </span>
          </div>
        </div>
      )}

      {/* Cashflow profile note */}
      <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
        <span className="font-bold text-[#210F60] shrink-0">Profile Evaluation:</span>
        <span className="leading-relaxed">{vitals.driver}</span>
      </div>

      {/* Sanitized Transactions Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#210F60]">
            Sanitized Ledger Sample (PII Redacted)
          </span>
          <span className="text-[11px] text-[#006C51] font-bold bg-[#E4FFF8] px-2.5 py-1 rounded-full">
            NDPA 2023 §24 Compliant
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFF] text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount (₦)</th>
                {sampleRecords.some((r) => r.balance !== undefined) && (
                  <th className="py-3 px-4 text-right">Balance (₦)</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sampleRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-[#F8FBFF] transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] tabular-nums whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-[#210F60] font-medium">
                    {r.description.includes('[REDACTED') ? (
                      <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] border border-amber-200">
                        {r.description}
                      </span>
                    ) : (
                      r.description
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {r.category || 'General'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#210F60] font-mono tabular-nums whitespace-nowrap">
                    ₦{r.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {r.balance !== undefined && (
                    <td className="py-3 px-4 text-right text-slate-500 font-mono tabular-nums whitespace-nowrap text-[11px]">
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
