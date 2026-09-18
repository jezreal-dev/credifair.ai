import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Cpu,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileCheck2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div id="landing-page-root" className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans pb-24">
      {/* Top Status Strip */}
      <div className="border-b border-slate-800/80 bg-[#121824] py-2.5 px-4 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="text-slate-300 font-medium">SYSTEM STATUS: OPERATIONAL</span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">MAPIE INDUCTIVE CONFORMAL ENGINE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">COVERAGE: 95% GUARANTEED</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">NDPA §37 ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Institutional Alternative Credit Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
            Alternative Credit Underwriting for Nigerian MSMEs Without Landed Collateral.
          </h1>

          <p className="text-base text-slate-400 leading-relaxed max-w-2xl font-sans">
            Evaluates raw POS transaction ledgers using 95% Inductive Conformal Prediction intervals and dual-language underwriting reports. Compliant with NDPA 2023 Section 37.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-xs hover:shadow-blue-500/25"
            >
              <span>Open Underwriting Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/ledger"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#121824] hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs font-medium transition-colors shadow-xs"
            >
              <span>Inspect PII-Scrubbed Ledger</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Matrix: Two High-Contrast Comparison Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
        <div className="mb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
            Comparative Architecture
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Underwriting Paradigm Comparison
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {/* Card 1: Traditional Bank Underwriting */}
          <div className="p-6 rounded-xl bg-[#121824] border border-rose-500/30 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-sm font-bold text-rose-400 font-sans">
                Traditional Bank Underwriting
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                LEGACY
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-400 font-sans">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Rigid Point Scores:</strong> Single-number probability scores create false confidence without acknowledging statistical variance or seasonal liquidity shocks.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Collateral Demands:</strong> Requires landed property Certificate of Occupancy (C of O), excluding 90%+ of creditworthy informal traders.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Opaque Rejection:</strong> Black-box decisions with zero actionable guidance in local commercial dialects.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Non-Compliant Automated Profiling:</strong> Unregulated algorithmic rejection violating NDPA 2023 §37 safeguards against solely automated evaluation.
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: CrediFair Conformal Architecture */}
          <div className="p-6 rounded-xl bg-[#121824] border border-emerald-500/30 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-sm font-bold text-emerald-400 font-sans">
                CrediFair Conformal Architecture
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PROVABLE 95%
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-400 font-sans">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Finite-Sample Coverage Intervals:</strong> Guaranteed 95% confidence bands calculated mathematically without assuming Gaussian distributions.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Volatility Penalties:</strong> Elastic intervals expand dynamically during trade shocks, protecting lenders while extending credit to active merchants.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Dual English &amp; Pidgin Advisories:</strong> Formal credit committee audit combined with localized merchant turnaround guidance.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Mandatory Human Sign-Off:</strong> Cryptographic SHA-256 seal signed by designated credit officer complying with NDPA 2023 §37.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#121824] border border-slate-800/80 space-y-1.5 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold font-sans">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>MAPIE Conformal Calibration</span>
            </div>
            <p className="text-slate-400 font-sans">
              Split conformal inference over historical trade records guarantees empirical coverage across all Nigerian merchant profiles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121824] border border-slate-800/80 space-y-1.5 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold font-sans">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Multi-Provider LLM Gateway</span>
            </div>
            <p className="text-slate-400 font-sans">
              Deterministic prompt anchoring across Groq, Gemini, and offline fallback models eliminates hallucinations and enforces grounding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121824] border border-slate-800/80 space-y-1.5 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold font-sans">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 Tamper-Evident Manifests</span>
            </div>
            <p className="text-slate-400 font-sans">
              Statutory underwriting decisions generate verifiable cryptographic hashes ensuring complete regulatory auditability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
