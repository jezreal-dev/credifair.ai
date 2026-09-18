import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Layers,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Landmark,
  Shield,
  Activity,
  SlidersHorizontal,
  Clock,
  HelpCircle,
  BarChart2,
  FileText,
  BadgeAlert,
  ArrowUpRight,
  Check,
  Minus,
  FileDown,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { Footer } from '../components/Footer';
import { generateOperationalPdfReport } from '../utils/generatePdfReport';

export const LandingPage: React.FC = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        generateOperationalPdfReport();
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3500);
      } catch (err) {
        console.error('Failed to generate operational PDF report:', err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 200);
  };
  return (
    <div id="landing-page-root" className="min-h-screen bg-[#F8FBFF] text-[#210F60] font-sans pb-16">
      {/* 1. HERO SECTION - Modern Sleek Fintech Aesthetic */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-[#F8FBFF] to-[#EFFFF9]">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#1DCF9F]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#210F60]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category pill tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4FFF8] border border-[#1DCF9F]/30 text-xs font-bold text-[#006C51] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#1DCF9F] inline-block animate-pulse" />
                <span>Next-Gen MSME Underwriting</span>
                <span className="text-[#1DCF9F]">/</span>
                <span>Alternative Cashflow Credit</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#210F60] leading-[1.15]">
                Fast, Fair Credit for Nigerian MSMEs. <br />
                <span className="text-[#1DCF9F]">Zero Landed Collateral.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                CrediFair AI transforms merchant POS and digital payment transaction flow into verified revolving credit limits.
                Using finite-sample Inductive Conformal Prediction intervals and automated Pidgin explanations,
                merchants receive instant credit evaluations with mathematical risk bounds.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#1DCF9F] hover:bg-[#1ac395] text-[#210F60] font-bold text-base transition-all shadow-[0_6px_20px_rgba(29,207,159,0.35)] hover:shadow-[0_8px_25px_rgba(29,207,159,0.45)] hover:-translate-y-0.5"
                >
                  <span>Launch Underwriting Studio</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/ledger"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-slate-50 text-[#210F60] border border-slate-200 font-bold text-base transition-colors shadow-xs"
                >
                  <span>Inspect Sanitized Ledger</span>
                </Link>
              </div>

              {/* Quality Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1DCF9F]" />
                  <span>Deterministic PII Scrubbing</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1DCF9F]" />
                  <span>Empirical Confidence Interval Guarantee</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1DCF9F]" />
                  <span>Dual-Language Market Advisory</span>
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card - Merchant Dashboard Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(33,15,96,0.08)] border border-slate-200/80 space-y-5">
                {/* Top Header in Card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E4FFF8] flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#006C51]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#210F60]">Merchant Terminal ID</div>
                      <div className="text-[11px] text-[#1DCF9F] font-semibold">Mama Bukky Foodstuff</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E4FFF8] text-[#006C51] text-xs font-extrabold">
                    ACTIVE TERMINAL
                  </span>
                </div>

                {/* Approved Credit Limit Hero Box */}
                <div className="rounded-xl bg-gradient-to-br from-[#210F60] to-[#2c1b75] p-5 text-white shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-[#1DCF9F]/20" />
                  <div className="text-xs text-slate-300 font-medium">Approved Working Capital Facility</div>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-white font-mono">
                    ₦750,000.00
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-200">
                    <span>Conformal Risk Range: [2.2% to 8.4%]</span>
                    <span className="text-[#1DCF9F] font-bold">APPROVED</span>
                  </div>
                </div>

                {/* 3 Quick Stats Rows */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-lg bg-[#F8FBFF] border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 font-medium">Daily POS Count</div>
                    <div className="text-sm font-bold text-[#210F60] mt-0.5 font-mono">48 tx/day</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F8FBFF] border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 font-medium">Monthly Inflow</div>
                    <div className="text-sm font-bold text-[#210F60] mt-0.5 font-mono">₦1.85M</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F8FBFF] border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 font-medium">Stability Score</div>
                    <div className="text-sm font-bold text-[#10B981] mt-0.5 font-mono">11.8% CoV</div>
                  </div>
                </div>

                {/* Direct Action */}
                <Link
                  to="/app"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#E4FFF8] hover:bg-[#1DCF9F]/20 text-[#006C51] font-bold text-xs transition-colors"
                >
                  <span>Open Underwriting Assessment</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES HIGHLIGHT STRIP - 3 Core Underwriting Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold text-[#1DCF9F] uppercase tracking-wider">
            Our Core Underwriting Pillars
          </div>
          <h2 className="text-3xl font-extrabold text-[#210F60] tracking-tight">
            Designed for the Real Nigerian Commercial Economy
          </h2>
          <p className="text-slate-600 text-sm">
            Informal merchants generate massive daily cash flow and inventory velocity.
            CrediFair AI translates verified operational ledger data into formal uncollateralized credit limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Fast Transactions & Instant Underwriting */}
          <div className="p-7 rounded-xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(33,15,96,0.03)] hover:shadow-[0_8px_30px_rgba(33,15,96,0.07)] transition-all hover:-translate-y-0.5 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#E4FFF8] flex items-center justify-center text-[#006C51]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#210F60]">
              Instant Working Capital
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Eliminate physical collateral appraisals and paperwork bottlenecks. Evaluate raw POS settlement streams in under 3 seconds to establish approved debt ceilings.
            </p>
            <div className="pt-2 text-xs font-bold text-[#1DCF9F] flex items-center gap-1">
              <span>35% Debt Service Ratio Safeguard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: 95% Conformal Confidence Guarantee */}
          <div className="p-7 rounded-xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(33,15,96,0.03)] hover:shadow-[0_8px_30px_rgba(33,15,96,0.07)] transition-all hover:-translate-y-0.5 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#E8ECF2] flex items-center justify-center text-[#210F60]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#210F60]">
              95% Conformal Coverage
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Replace fragile single-point credit scores. Inductive split conformal prediction guarantees that actual merchant default risk falls within computed statistical bounds with 95% certainty.
            </p>
            <div className="pt-2 text-xs font-bold text-[#210F60] flex items-center gap-1">
              <span>Distribution-free Calibration Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Dual-Language Underwriting & Actionable Advisories */}
          <div className="p-7 rounded-xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(33,15,96,0.03)] hover:shadow-[0_8px_30px_rgba(33,15,96,0.07)] transition-all hover:-translate-y-0.5 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#FFF4E5] flex items-center justify-center text-[#D97706]">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#210F60]">
              Dual-Language Underwriting
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Institutional credit memos for risk officers combined with native Nigerian Pidgin commercial advisories so Bodija, Alaba, and Dawanau traders know exactly how to grow their credit lines.
            </p>
            <div className="pt-2 text-xs font-bold text-[#D97706] flex items-center gap-1">
              <span>Supervisory Officer Sign-Off</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROFESSIONAL INSTITUTIONAL COMPARISON SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-[0_8px_30px_rgba(33,15,96,0.04)] space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F4F7FC] text-xs font-bold text-[#210F60] uppercase tracking-wider">
                <Landmark className="w-4 h-4 text-[#1DCF9F]" />
                <span>Institutional Architecture Comparison</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#210F60] tracking-tight">
                Traditional Commercial Underwriting vs. CrediFair AI
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                A granular, dimension-by-dimension assessment of how conventional banking frameworks systematically exclude high-velocity informal merchants, and how CrediFair AI resolves each bottleneck.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3.5 py-1.5 rounded-md bg-[#E4FFF8] border border-[#1DCF9F]/30 text-[#006C51] text-xs font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1DCF9F]" />
                <span>Validated Production Standards</span>
              </span>
            </div>
          </div>

          {/* Structured Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column 1: Traditional Commercial Banks */}
            <div className="rounded-lg bg-slate-50/70 border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#210F60] text-lg">Traditional Commercial Banks</h3>
                    <span className="text-xs text-slate-500 font-medium">Conventional Brick-and-Mortar Framework</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-rose-100/70 border border-rose-200 text-rose-800 text-xs font-bold tracking-wide">
                  High Barrier
                </span>
              </div>

              {/* Key Dimensions */}
              <div className="space-y-6">
                {/* Dimension 1: Collateral */}
                <div className="space-y-2 pb-5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Collateral &amp; Asset Pledging</span>
                  </div>
                  <p className="text-sm text-slate-600 pl-7 leading-relaxed">
                    Mandates landed real estate with statutory <strong>Certificate of Occupancy (C of O)</strong> or high cash security deposits, disqualifying over 90% of active, profitable market traders.
                  </p>
                </div>

                {/* Dimension 2: Risk Scoring */}
                <div className="space-y-2 pb-5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <BarChart2 className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Scoring Methodology</span>
                  </div>
                  <p className="text-sm text-slate-600 pl-7 leading-relaxed">
                    Relies on static single-point bureau files (CRC, CreditRegistry) that ignore daily terminal liquidity, weekly trade seasonality, and high-frequency cash turnover.
                  </p>
                </div>

                {/* Dimension 3: Turnaround Time */}
                <div className="space-y-2 pb-5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Turnaround Time</span>
                  </div>
                  <p className="text-sm text-slate-600 pl-7 leading-relaxed">
                    Requires 2 to 6 weeks of bureaucratic processing, physical on-site branch inspections, and manual branch credit committee deliberations.
                  </p>
                </div>

                {/* Dimension 4: Transparency & Guidance */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Post-Decision Advisory</span>
                  </div>
                  <p className="text-sm text-slate-600 pl-7 leading-relaxed">
                    Issues generic rejection notices with zero diagnostic explanation or guidance on how an applicant can improve eligibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: CrediFair AI Model */}
            <div className="rounded-lg bg-white border border-[#1DCF9F] p-6 sm:p-8 space-y-6 shadow-xs relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E4FFF8] text-[#006C51] border border-[#1DCF9F]/40 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#210F60] text-lg">CrediFair AI Underwriting</h3>
                    <span className="text-xs text-[#006C51] font-semibold">Alternative Cashflow-Driven Platform</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#E4FFF8] border border-[#1DCF9F]/40 text-[#006C51] text-xs font-bold tracking-wide">
                  Approved Standard
                </span>
              </div>

              {/* Key Dimensions */}
              <div className="space-y-6">
                {/* Dimension 1: Collateral */}
                <div className="space-y-2 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-[#006C51]">
                    <ShieldCheck className="w-4 h-4 text-[#1DCF9F] shrink-0" />
                    <span>Collateral &amp; Asset Pledging</span>
                  </div>
                  <p className="text-sm text-slate-700 pl-7 leading-relaxed">
                    <strong>100% Uncollateralized.</strong> Credit limits (₦200,000 to ₦5,000,000) are dynamically backed by verified daily POS settlement inflows and verifiable trade turnover.
                  </p>
                </div>

                {/* Dimension 2: Risk Scoring */}
                <div className="space-y-2 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-[#006C51]">
                    <SlidersHorizontal className="w-4 h-4 text-[#1DCF9F] shrink-0" />
                    <span>Scoring Methodology</span>
                  </div>
                  <p className="text-sm text-slate-700 pl-7 leading-relaxed">
                    <strong>95% Inductive Conformal Prediction.</strong> Computes mathematical lower and upper risk bounds to prevent unfair rejections during harvest or fuel price volatility.
                  </p>
                </div>

                {/* Dimension 3: Turnaround Time */}
                <div className="space-y-2 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-[#006C51]">
                    <Clock className="w-4 h-4 text-[#1DCF9F] shrink-0" />
                    <span>Turnaround Time</span>
                  </div>
                  <p className="text-sm text-slate-700 pl-7 leading-relaxed">
                    <strong>Under 3 seconds.</strong> Instant algorithmic ingestion with automated PII privacy scrubbing and immediate facility recommendation.
                  </p>
                </div>

                {/* Dimension 4: Transparency & Guidance */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-[#006C51]">
                    <FileText className="w-4 h-4 text-[#1DCF9F] shrink-0" />
                    <span>Post-Decision Advisory</span>
                  </div>
                  <p className="text-sm text-slate-700 pl-7 leading-relaxed">
                    <strong>Localized Dual-Language Feedback.</strong> Clear Nigerian Pidgin recommendations for merchants paired with technical audit memos for risk committees.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Comparison Data Matrix Table */}
          <div className="rounded-lg border border-slate-200 bg-[#F8FBFF] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#210F60] uppercase tracking-wide">
                    Summary Operational Matrix
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E4FFF8] text-[#006C51] border border-[#1DCF9F]/30">
                    Institutional Benchmark
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Feature-by-Feature Institutional Benchmark Dossier</span>
              </div>

              <button
                id="download-pdf-report-btn"
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                title="Export current operational comparison as a branded executive PDF"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#210F60] hover:bg-[#2c167b] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md active:scale-95 disabled:opacity-60 cursor-pointer shrink-0"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating PDF Dossier...</span>
                  </>
                ) : pdfSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1DCF9F]" />
                    <span>Report Downloaded!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-[#1DCF9F]" />
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FBFF] text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Evaluation Dimension</th>
                    <th className="py-3.5 px-6">Commercial Banks</th>
                    <th className="py-3.5 px-6 text-[#006C51]">CrediFair AI Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 bg-white">
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#210F60] text-sm">Collateral Requirement</td>
                    <td className="py-4 px-6 text-rose-600 font-medium">Physical C of O / Land Asset</td>
                    <td className="py-4 px-6 font-bold text-[#006C51]">Zero Landed Collateral Required</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#210F60] text-sm">Underwriting Uncertainty</td>
                    <td className="py-4 px-6 text-slate-500">Opaque Single-Point Score</td>
                    <td className="py-4 px-6 font-bold text-[#006C51]">Rigorous 95% Conformal Confidence Band</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#210F60] text-sm">Assessment Speed</td>
                    <td className="py-4 px-6 text-slate-500">14 to 45 Days</td>
                    <td className="py-4 px-6 font-bold text-[#006C51]">Real-time (&lt; 3 Seconds)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#210F60] text-sm">Trader Communication</td>
                    <td className="py-4 px-6 text-slate-500">Rigid Legal Jargon</td>
                    <td className="py-4 px-6 font-bold text-[#006C51]">Nigerian Pidgin + Actionable Counterfactuals</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER BANNER & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-xl bg-[#210F60] text-white p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-[#1DCF9F]/15 blur-2xl pointer-events-none" />

          <div className="max-w-2xl space-y-5 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-xs font-semibold text-[#1DCF9F]">
              <Activity className="w-4 h-4 text-[#1DCF9F]" />
              <span>Commercial Underwriting Evaluation Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Test Any Merchant Statement or Archetype Live.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore preloaded Nigerian market archetypes or upload raw bank statements with automatic PII sanitization and human supervisory sign-off.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1DCF9F] hover:bg-[#1ac395] text-[#210F60] font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Launch Underwriting Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/compliance"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
              >
                <span>Open Compliance Vault</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
};
