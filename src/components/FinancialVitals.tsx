import React from 'react';
import { DollarSign, Activity, TrendingUp, ShieldCheck, Database } from 'lucide-react';
import { MerchantVitals, TransactionRecord } from '../types';

interface FinancialVitalsProps {
  vitals: MerchantVitals;
  sampleRecords: TransactionRecord[];
}

export const FinancialVitals: React.FC<FinancialVitalsProps> = ({ vitals, sampleRecords }) => {
  return (
    <div id="financial-vitals-panel" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">2. Financial Vitals &amp; Sanitized Ledger</h2>
          <p className="text-xs text-slate-500">
            PII minimized per NDPA 2023 §24; non-point features extracted without mock data
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-mono font-medium text-slate-700">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>{vitals.merchant_id}</span>
        </div>
      </div>

      {/* Vitals metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div id="metric-inflow" className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Monthly Inflow</span>
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {vitals.monthly_inflow_formatted || `₦${vitals.monthly_inflow.toLocaleString()}`}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">30-day normalized</div>
        </div>

        <div id="metric-volatility" className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Cashflow Volatility</span>
          </div>
          <div className="text-base font-bold text-slate-900">{vitals.volatility}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Coeff. of Variation</div>
        </div>

        <div id="metric-velocity" className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span>Daily Tx Count</span>
          </div>
          <div className="text-base font-bold text-slate-900">{vitals.daily_tx} tx/day</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{vitals.total_records} tx over {vitals.active_days}d</div>
        </div>

        <div id="metric-loan" className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Facility Size</span>
          </div>
          <div className="text-base font-bold text-slate-900">₦{vitals.loan_requested.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">35% of run-rate</div>
        </div>
      </div>

      {/* Context driver note */}
      <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
        <span className="font-semibold shrink-0">Cashflow Context:</span>
        <span>{vitals.driver}</span>
      </div>

      {/* Sanitized Transactions Table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700">Sanitized Ledger Samples (PII Redacted)</span>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
            NDPA §24 Compliant
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-medium border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {sampleRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-slate-500">{r.date}</td>
                  <td className="py-2 px-3 max-w-xs truncate font-medium text-slate-800">
                    {r.description.includes('[REDACTED') ? (
                      <span className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded text-[11px] font-mono">
                        {r.description}
                      </span>
                    ) : (
                      r.description
                    )}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.category || 'General'}</td>
                  <td className="py-2 px-3 text-right font-medium text-slate-900 whitespace-nowrap">
                    ₦{r.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </td>
                  {r.balance !== undefined && (
                    <td className="py-2 px-3 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      ₦{r.balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
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
