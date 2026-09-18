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
    <div id="explainability-panel" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            4. Transparent Decision Reasoning &amp; Merchant Guidance
          </h2>
          <p className="text-xs text-slate-500">
            Multi-provider generative explanation grounded strictly in conformal risk metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{explanation.provider}</span>
            <span className="text-slate-400">({explanation.model})</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-4">
        <button
          type="button"
          id="tab-officer-report"
          onClick={() => setActiveTab('officer')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'officer'
              ? 'border-blue-600 text-blue-600 bg-blue-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>🏦 Credit Officer Audit Report (English)</span>
        </button>

        <button
          type="button"
          id="tab-merchant-advisory"
          onClick={() => setActiveTab('pidgin')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'pidgin'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>🛍️ Merchant Advisory (Nigerian Pidgin)</span>
        </button>
      </div>

      {/* Tab Content Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line min-h-[140px]">
        {activeContent}
      </div>
    </div>
  );
};
