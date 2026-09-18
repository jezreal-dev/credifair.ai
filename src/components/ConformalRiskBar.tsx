import React, { useEffect, useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { ConformalRisk, ForensicAudit } from '../types';

interface ConformalRiskBarProps {
  risk: ConformalRisk;
  forensicAudit?: ForensicAudit;
}

export const ConformalRiskBar: React.FC<ConformalRiskBarProps> = ({ risk, forensicAudit }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 40);
    return () => clearTimeout(timer);
  }, [risk]);

  const isApproval = risk.upper_bound_pct <= 20.0;
  const isManual = risk.upper_bound_pct > 20.0 && risk.upper_bound_pct <= 45.0;

  // Semantic decision labels & styles per Directive #2
  const verdict = isApproval
    ? 'RECOMMENDED FOR APPROVAL'
    : isManual
      ? 'MANUAL UNDERWRITING REVIEW REQUIRED'
      : 'RECOMMENDED FOR DECLINE';

  const badgeStyle = isApproval
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : isManual
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  const Icon = isApproval ? CheckCircle2 : isManual ? AlertTriangle : XCircle;

  const leftPct = Math.max(0, Math.min(100, risk.lower_bound_pct));
  const rightPct = Math.max(0, Math.min(100, risk.upper_bound_pct));
  const pointPct = Math.max(0, Math.min(100, risk.point_risk_pct));
  const bandWidth = Math.max(1.5, rightPct - leftPct);

  return (
    <div
      id="conformal-risk-panel"
      className="bg-[#121824] rounded-xl border border-slate-800/80 p-5 sm:p-6 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs"
    >
      {/* Header with Title and Deterministic Semantic Decision Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-100 tracking-tight">
              Conformal Prediction Range Gauge
            </h2>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              α = 0.05
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Distribution-free finite-sample coverage calibrated over empirical Nigerian MSME trade cycles
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {forensicAudit && (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border ${
                forensicAudit.fraud_risk_level === 'CLEAN'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>FORENSIC: {forensicAudit.fraud_risk_level}</span>
            </div>
          )}

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-semibold border ${badgeStyle}`}>
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{verdict}</span>
          </div>
        </div>
      </div>

      {/* 3-Column Monospace Vitals for Intervals */}
      <div className="grid grid-cols-3 gap-3 mb-6 font-mono">
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">95% Lower Bound</div>
          <div className="text-xl font-bold text-slate-50 mt-1 tabular-nums">
            {risk.lower_bound_pct.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Optimistic floor</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-blue-500/40 hover:border-blue-500/70 transition-colors">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-rose-500" />
            <span>Point Estimate</span>
          </div>
          <div className="text-xl font-bold text-rose-400 mt-1 tabular-nums">
            {risk.point_risk_pct.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Expected default risk</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">95% Upper Bound</div>
          <div className="text-xl font-bold text-slate-50 mt-1 tabular-nums">
            {risk.upper_bound_pct.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Statutory cutoff gate</div>
        </div>
      </div>

      {/* Multi-Layer Conformal Gauge per Directive #3.A */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
          <span>0.0% (Zero Risk)</span>
          <span className="text-slate-300 font-medium">Underwriting Cutoffs: τ = 20% (Approval) / τ = 45% (Review)</span>
          <span>100.0% (Maximum Risk)</span>
        </div>

        {/* Gauge Track Area */}
        <div className="relative pt-3 pb-8 px-1">
          {/* Subtle Inset Rail Track (h-3 rounded-full bg-slate-800/60) */}
          <div className="relative h-3 w-full bg-slate-800/60 rounded-full border border-slate-700/50 overflow-visible flex items-center">
            {/* 95% Confidence Interval Band: Colored gradient pill with soft ambient glow */}
            <div
              className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-600/30 via-indigo-500/40 to-blue-600/30 border border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all ease-out"
              style={{
                transitionDuration: '300ms',
                left: animated ? `${leftPct}%` : `${pointPct}%`,
                width: animated ? `${bandWidth}%` : '0%',
              }}
              title={`95% Conformal Confidence Band: [${risk.lower_bound_pct}% — ${risk.upper_bound_pct}%]`}
            />

            {/* Precision Diamond Marker for Point Estimate (rotate-45 bg-rose-500 border-2 border-white shadow-md) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 transition-all ease-out cursor-pointer"
              style={{
                transitionDuration: '300ms',
                left: `${pointPct}%`,
              }}
              title={`Point Estimate: ${risk.point_risk_pct.toFixed(2)}%`}
            >
              <div className="w-3.5 h-3.5 rotate-45 bg-rose-500 border-2 border-white shadow-md hover:scale-125 transition-transform" />
            </div>

            {/* Critical Threshold Marker lines at tau = 20% and tau = 45% */}
            <div
              className="absolute -top-3 -bottom-3 border-r border-dashed border-emerald-500/60 z-10 pointer-events-none"
              style={{ left: '20%' }}
            />
            <div
              className="absolute -top-3 -bottom-3 border-r border-dashed border-amber-500/60 z-10 pointer-events-none"
              style={{ left: '45%' }}
            />
          </div>

          {/* Under-Gauge Tick Labels & Threshold Markers */}
          <div className="relative h-5 mt-2 font-mono text-[10px]">
            {/* 20% Tick Indicator */}
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: '20%' }}
            >
              <div className="w-px h-1.5 bg-emerald-500/60 mb-0.5" />
              <span className="text-emerald-400 bg-slate-950/90 px-1 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                τ = 20%
              </span>
            </div>

            {/* 45% Tick Indicator */}
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: '45%' }}
            >
              <div className="w-px h-1.5 bg-amber-500/60 mb-0.5" />
              <span className="text-amber-400 bg-slate-950/90 px-1 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                τ = 45%
              </span>
            </div>

            {/* Point Estimate Tooltip Value Pill */}
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
              style={{ left: `${pointPct}%` }}
            >
              <div className="w-px h-1.5 bg-rose-500 mb-0.5" />
              <span className="text-rose-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-rose-500/40 shadow-xs whitespace-nowrap">
                {risk.point_risk_pct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Legend / Diagnostics */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-full bg-gradient-to-r from-blue-600/50 to-indigo-500/50 border border-blue-400/60 inline-block shadow-xs" />
              <span>95% Conformal Confidence Band (Spread: {(risk.upper_bound_pct - risk.lower_bound_pct).toFixed(2)}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rotate-45 bg-rose-500 border border-white inline-block" />
              <span>Point Estimate Marker</span>
            </span>
          </div>
          <div className="text-slate-400">
            Holdout Coverage: {(risk.empirical_calibration_coverage * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
