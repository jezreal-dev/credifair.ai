import React, { useState } from 'react';
import { FileText, MessageSquareQuote, Copy, Check, Sparkles } from 'lucide-react';
import { DualLanguageExplanation } from '../types';

interface ExplainabilityTabsProps {
  explanation: DualLanguageExplanation;
}

export const ExplainabilityTabs: React.FC<ExplainabilityTabsProps> = ({ explanation }) => {
  const [activeTab, setActiveTab] = useState<'officer' | 'pidgin'>('officer');
  const [copied, setCopied] = useState(false);

  const officerText =
    explanation.officer_report ||
    (explanation.raw_explanation && explanation.raw_explanation.includes('Officer Audit Report')
      ? explanation.raw_explanation
      : explanation.content);

  const pidginText =
    explanation.merchant_advisory ||
    (explanation.raw_explanation && explanation.raw_explanation.includes('Nigerian Pidgin')
      ? explanation.raw_explanation
      : explanation.content);

  const activeContent = activeTab === 'officer' ? officerText : pidginText;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="explainability-panel"
      className="bg-[#121824] rounded-xl border border-slate-800/80 p-5 sm:p-6 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 tracking-tight">
            Dual-Language Underwriting Intelligence
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Automated generation with multi-provider routing, strictly conditioned on conformal bounds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{explanation.provider}</span>
            <span className="text-slate-500">({explanation.model})</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900/80 text-xs font-mono text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Modern Segmented Control per Directive #3.D */}
      <div className="flex flex-wrap sm:flex-nowrap p-1 rounded-lg bg-slate-950 border border-slate-800/90 mb-4 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('officer')}
          className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'officer'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0 text-blue-400" />
          <span className="hidden sm:inline">Credit Committee Audit Report (English)</span>
          <span className="sm:hidden">Credit Audit (English)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pidgin')}
          className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'pidgin'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <MessageSquareQuote className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span className="hidden sm:inline">Merchant Advisory Notice (Nigerian Pidgin)</span>
          <span className="sm:hidden">Merchant Advisory (Pidgin)</span>
        </button>
      </div>

      {/* Content Panel with Soft Inner Padding & Distinct Typography */}
      <div className="p-5 rounded-lg bg-slate-950 border border-slate-800 text-xs leading-relaxed text-slate-200 font-mono whitespace-pre-wrap selection:bg-blue-500/30">
        {activeTab === 'officer' ? (
          <div className="space-y-3 font-mono">
            <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
              <span>Statutory Credit Committee Review Record</span>
              <span className="text-slate-500 font-normal">Audit Trail Verified</span>
            </div>
            <div className="text-slate-300 leading-relaxed text-xs">
              {activeContent}
            </div>
          </div>
        ) : (
          <div className="space-y-3 font-sans">
            <div className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
              <span>Direct Merchant Commercial Guidance (Pidgin English)</span>
              <span className="text-slate-500 font-normal font-mono">Actionable Steps</span>
            </div>
            <div className="text-slate-200 leading-relaxed text-sm font-normal">
              {activeContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
