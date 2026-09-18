import React from 'react';
import { Target, AlertCircle, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { ConformalRisk } from '../types';

interface ConformalRiskCardProps {
  risk: ConformalRisk;
}

export const ConformalRiskCard: React.FC<ConformalRiskCardProps> = ({ risk }) => {
  const isApproval = risk.recommendation === 'RECOMMENDED FOR APPROVAL';
  const isManual = risk.recommendation === 'MANUAL UNDERWRITING REVIEW REQUIRED';

  const badgeColor = isApproval
    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
    : isManual
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-rose-50 text-rose-800 border-rose-300';

  const Icon = isApproval ? CheckCircle2 : isManual ? AlertTriangle : XCircle;

  // Calculate position percentage on 0-100% scale
  const leftPct = Math.max(0, Math.min(100, risk.lower_bound_pct));
  const rightPct = Math.max(0, Math.min(100, risk.upper_bound_pct));
  const widthPct = Math.max(1, rightPct - leftPct);
  const pointPct = Math.max(0, Math.min(100, risk.point_risk_pct));

  return (
    <div id="conformal-risk-panel" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">3. Calibrated Conformal Risk Assessment</h2>
          <p className="text-xs text-slate-500">
            Distribution-free split conformal intervals with locally-weighted volatility elasticity
          </p>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
          <Icon className="w-4 h-4 shrink-0" />
          <span>{risk.recommendation}</span>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
          <div className="text-xs text-blue-700 font-medium">95% Lower Bound</div>
          <div className="text-xl font-extrabold text-blue-900 mt-0.5">{risk.lower_bound_pct}%</div>
          <div className="text-[11px] text-blue-600/80">Best-case ceiling</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-center shadow-xs">
          <div className="text-xs text-slate-300 font-medium flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Point Estimate</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-0.5">{risk.point_risk_pct}%</div>
          <div className="text-[11px] text-slate-400">Default probability</div>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-center">
          <div className="text-xs text-purple-700 font-medium">95% Upper Bound</div>
          <div className="text-xl font-extrabold text-purple-900 mt-0.5">{risk.upper_bound_pct}%</div>
          <div className="text-[11px] text-purple-600/80">Statutory gate bound</div>
        </div>
      </div>

      {/* Conformal Range Bar Visualization */}
      <div className="mb-6 px-1">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
          <span>0% (Lowest Risk)</span>
          <span className="font-medium text-slate-700">
            Honest Interval (α=0.05): [{risk.lower_bound_pct}% to {risk.upper_bound_pct}%]
          </span>
          <span>100% (High Risk)</span>
        </div>

        {/* Gauge Track */}
        <div className="relative h-7 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          {/* Color threshold zones */}
          <div className="absolute inset-y-0 left-0 w-[20%] bg-emerald-500/10 border-r border-dashed border-emerald-300" />
          <div className="absolute inset-y-0 left-[20%] w-[25%] bg-amber-500/10 border-r border-dashed border-amber-300" />
          <div className="absolute inset-y-0 left-[45%] right-0 bg-rose-500/10" />

          {/* Conformal interval span bar */}
          <div
            className="absolute top-1 bottom-1 bg-blue-500/35 border border-blue-600 rounded-md transition-all duration-300"
            style={{
              left: `${leftPct}%`,
              width: `${widthPct}%`,
            }}
          />

          {/* Point risk marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-rose-600 shadow-xs z-10 transition-all duration-300"
            style={{ left: `${pointPct}%` }}
          >
            <div className="w-3 h-3 -ml-1 mt-2 bg-rose-600 rotate-45 border border-white shadow-xs" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-200 border border-emerald-400 inline-block" />
              <span>≤20% Approval</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-200 border border-amber-400 inline-block" />
              <span>20% to 45% Review</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-400 inline-block" />
              <span>&gt;45% Decline</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="w-2 h-2 rotate-45 bg-rose-600 inline-block" />
            <span>Point Risk ({risk.point_risk_pct}%)</span>
          </div>
        </div>
      </div>

      {/* Conformal Explanation Footnote */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900">Why Conformal Prediction? </span>
          Unlike opaque credit scores that produce deceptive single numbers, CrediFair guarantees finite-sample 95%
          coverage ({risk.empirical_calibration_coverage * 100}% empirical holdout). Volatile MSME cashflows widen the
          band, preventing catastrophic underestimation of default risks.
        </div>
      </div>
    </div>
  );
};
