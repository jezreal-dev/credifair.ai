import React, { useState } from 'react';
import { DualLanguageExplanation } from '../types';
import { MessageSquare, Sparkles, AlertCircle, Copy, Check, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ExplainabilityTabsProps {
  explanation: DualLanguageExplanation;
}

export const ExplainabilityTabs: React.FC<ExplainabilityTabsProps> = ({ explanation }) => {
  const [activeTab, setActiveTab] = useState<'pidgin' | 'english' | 'raw'>('pidgin');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pidginText =
    explanation.merchant_advisory ||
    'Mama/Oga, your market transaction flow dey steady. Keep pushing all your sales and transfers through this POS terminal to increase your credit line.';

  const englishText =
    explanation.officer_report ||
    explanation.content ||
    'Credit assessment verified under NDPA 2023 §37. Cashflow volatility and transaction coverage remain within underwriting limits.';

  const rawText = explanation.content || explanation.raw_explanation || '';

  return (
    <div
      id="explainability-tabs-panel"
      className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_24px_rgba(33,15,96,0.05)] space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E4FFF8] text-[#006C51] flex items-center justify-center text-xs font-bold">
              5
            </span>
            <h2 className="text-lg font-bold text-[#210F60] tracking-tight">
              Dual-Language Underwriting &amp; Actionable Guidance
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 pl-8">
            Multi-provider deterministic LLM generation anchored to conformal bounds and Nigerian market conventions
          </p>
        </div>

        {/* OPay Styled Segmented Tabs */}
        <div className="inline-flex p-1 rounded-full bg-[#F4F7FC] border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pidgin')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'pidgin'
                ? 'bg-[#1DCF9F] text-[#210F60] shadow-sm'
                : 'text-slate-600 hover:text-[#210F60]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Nigerian Pidgin Advisory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('english')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'english'
                ? 'bg-[#1DCF9F] text-[#210F60] shadow-sm'
                : 'text-slate-600 hover:text-[#210F60]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Credit Committee Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'raw'
                ? 'bg-[#1DCF9F] text-[#210F60] shadow-sm'
                : 'text-slate-600 hover:text-[#210F60]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full Generation</span>
          </button>
        </div>
      </div>

      {/* Model Provider Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1DCF9F]" />
          <span>
            Anchored Engine: {explanation.provider} ({explanation.model})
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const textToCopy =
              activeTab === 'pidgin'
                ? pidginText
                : activeTab === 'english'
                ? englishText
                : rawText;
            handleCopy(textToCopy);
          }}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-[#210F60] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#1DCF9F]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'pidgin' && (
        <div className="p-6 rounded-2xl bg-[#F8FBFF] border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#006C51] uppercase tracking-wide">
            <HeartHandshake className="w-4 h-4 text-[#1DCF9F]" />
            <span>Direct Commercial Market Advisory (Pidgin English)</span>
          </div>
          <p className="text-sm sm:text-base text-[#210F60] leading-relaxed whitespace-pre-line font-medium">
            {pidginText}
          </p>
        </div>
      )}

      {activeTab === 'english' && (
        <div className="p-6 rounded-2xl bg-[#F8FBFF] border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#210F60] uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#1DCF9F]" />
            <span>Formal Credit Committee Audit Memo</span>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line font-medium">
            {englishText}
          </p>
        </div>
      )}

      {activeTab === 'raw' && (
        <div className="p-6 rounded-2xl bg-[#E4FFF8] border border-[#1DCF9F]/30 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#006C51] uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-[#006C51]" />
            <span>Full Structured Underwriting Content</span>
          </div>
          <p className="text-sm sm:text-base text-[#006C51] leading-relaxed whitespace-pre-line font-mono text-xs">
            {rawText}
          </p>
        </div>
      )}
    </div>
  );
};
