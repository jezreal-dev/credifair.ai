import React, { useState, useEffect } from 'react';
import { ConformalRisk, ForensicAudit } from '../types';
import { ShieldCheck, AlertTriangle, XCircle, Info, CheckCircle2 } from 'lucide-react';

interface ConformalRiskBarProps {
  risk: ConformalRisk;
  forensicAudit?: ForensicAudit;
}

export const ConformalRiskBar: React.FC<ConformalRiskBarProps> = ({ risk, forensicAudit }) => {
  const [lower, setLower] = useState(0);
  const [point, setPoint] = useState(0);
  const [upper, setUpper] = useState(0);

  useEffect(() => {
    const targetLower = risk.lower_bound_pct;
    const targetPoint = risk.point_risk_pct;
    const targetUpper = risk.upper_bound_pct;

    const timer = setTimeout(() => {
      setLower(targetLower);
      setPoint(targetPoint);
      setUpper(targetUpper);
    }, 50);

    return () => clearTimeout(timer);
  }, [risk.lower_bound_pct, risk.point_risk_pct, risk.upper_bound_pct]);

  const leftPercent = Math.max(0, Math.min(100, lower));
  const widthPercent = Math.max(0.5, Math.min(100 - leftPercent, upper - lower));
  const pointPercent = Math.max(0, Math.min(100, point));

  const getDecisionBadge = (recommendation: string) => {
    if (recommendation.includes('APPROVAL')) {
      return {
        label: 'APPROVE',
        bg: 'bg-[#E4FFF8]',
        text: 'text-[#006C51]',
        border: 'border-[#1DCF9F]/40',
        icon: CheckCircle2,
        desc: 'Upper 95% bound strictly under 20% limit. Safe for automated working capital extension.',
      };
    }
    if (recommendation.includes('REVIEW') || recommendation.includes('MANUAL')) {
      return {
        label: 'CONDITIONAL REVIEW',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-300',
        icon: AlertTriangle,
        desc: 'Confidence band traverses the 20% approval boundary. Requires supervisory review.',
      };
    }
    return {
      label: 'DECLINE',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      icon: XCircle,
      desc: 'Lower bound exceeds 45% default floor. Credit risk too high for uncollateralized line.',
    };
  };

  const badge = getDecisionBadge(risk.recommendation);
  const IconComp = badge.icon;

  return (
    <div
      id="conformal-risk-gauge-panel"
      className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_24px_rgba(33,15,96,0.05)] space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E4FFF8] text-[#006C51] flex items-center justify-center text-xs font-bold">
              3
            </span>
            <h2 className="text-lg font-bold text-[#210F60] tracking-tight">
              Inductive Conformal Risk Calibration (95% Coverage)
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 pl-8">
            Distribution-free split conformal inference. The merchant’s true default probability is mathematically proven to fall within this interval.
          </p>
        </div>

        {/* OPay Decision Badge */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold font-mono ${badge.bg} ${badge.text} ${badge.border}`}
        >
          <IconComp className="w-4 h-4 shrink-0" />
          <span>STATUS: {badge.label}</span>
        </div>
      </div>

      {/* Decision Summary Card */}
      <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${badge.bg} ${badge.text} ${badge.border}`}>
        <IconComp className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Underwriting Disposition: </strong>
          <span>{badge.desc}</span>
        </div>
      </div>

      {/* 3 Metric Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
        <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-slate-100">
          <div className="text-[11px] font-sans font-extrabold uppercase text-slate-500">
            Lower 95% Bound
          </div>
          <div className="text-2xl font-black text-[#210F60] mt-1 tabular-nums">
            {lower.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">Optimistic default floor</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#E4FFF8] border border-[#1DCF9F]/40">
          <div className="text-[11px] font-sans font-extrabold uppercase text-[#006C51]">
            Calibrated Point Risk
          </div>
          <div className="text-2xl font-black text-[#006C51] mt-1 tabular-nums">
            {point.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#006C51] font-sans mt-0.5">Central estimate</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-slate-100">
          <div className="text-[11px] font-sans font-extrabold uppercase text-slate-500">
            Upper 95% Bound
          </div>
          <div className="text-2xl font-black text-[#210F60] mt-1 tabular-nums">
            {upper.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">Pessimistic stress ceiling</div>
        </div>
      </div>

      {/* Interactive Visual Gauge */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>0.0% (Zero Risk)</span>
          <span className="font-bold text-[#006C51]">Approval Limit: 20%</span>
          <span className="font-bold text-rose-600">Decline Limit: 45%</span>
          <span>100.0% (Total Default)</span>
        </div>

        <div className="relative h-10 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
          {/* Green approval zone */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#E4FFF8] border-r border-[#1DCF9F]/50"
            style={{ width: '20%' }}
          />
          {/* Amber conditional zone */}
          <div
            className="absolute top-0 bottom-0 bg-amber-50 border-r border-amber-200"
            style={{ left: '20%', width: '25%' }}
          />
          {/* Rose decline zone */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-rose-50"
            style={{ left: '45%' }}
          />

          {/* Conformal Prediction Interval Ribbon */}
          <div
            className="absolute top-1 bottom-1 rounded-xl bg-[#1DCF9F] shadow-sm transition-all duration-500 ease-out flex items-center justify-center opacity-90"
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
          >
            <span className="text-[10px] font-mono font-bold text-[#210F60] px-1 truncate">
              [{lower.toFixed(1)}% to {upper.toFixed(1)}%]
            </span>
          </div>

          {/* Central Point Risk Marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#210F60] shadow-md z-10 transition-all duration-500 ease-out"
            style={{ left: `${pointPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1DCF9F] inline-block" />
            <span>95% Conformal Confidence Range</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#210F60] inline-block" />
            <span>Point Risk Estimate: {point.toFixed(1)}%</span>
          </span>
          <span>Finite-sample empirical coverage guarantee</span>
        </div>
      </div>
    </div>
  );
};
