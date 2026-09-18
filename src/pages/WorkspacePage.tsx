import React, { useState, useEffect, useCallback } from 'react';
import { ProfileSelector } from '../components/ProfileSelector';
import { FinancialVitals } from '../components/FinancialVitals';
import { ConformalRiskBar } from '../components/ConformalRiskBar';
import { ConformalRiskTrendChart } from '../components/ConformalRiskTrendChart';
import { ExplainabilityTabs } from '../components/ExplainabilityTabs';
import { ComplianceSignOff } from '../components/ComplianceSignOff';
import { PRELOADED_PROFILES } from '../data/seedData';
import { AnalysisResponse, HealthResponse } from '../types';
import { AlertCircle, ArrowLeft, RefreshCw, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkspacePageProps {
  health: HealthResponse | null;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ health }) => {
  const [mode, setMode] = useState<'archetype' | 'upload'>('archetype');
  const [selectedProfileKey, setSelectedProfileKey] = useState<string>('Bodija Retail Archetype');
  const [loanRequested, setLoanRequested] = useState<number>(750000);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch assessment for archetype
  const loadArchetype = useCallback(
    async (profileKey: string, loanAmount?: number) => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/v1/assess-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile_key: profileKey,
            loan_requested: loanAmount !== undefined ? loanAmount : PRELOADED_PROFILES[profileKey]?.loan_requested,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to assess merchant profile');
        }
        const data: AnalysisResponse = await res.json();
        setAnalysis(data);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error running conformal assessment');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadArchetype('Bodija Retail Archetype', 750000);
  }, [loadArchetype]);

  const handleProfileSelect = (key: string) => {
    setSelectedProfileKey(key);
    const defaultLoan = PRELOADED_PROFILES[key]?.loan_requested || 500000;
    setLoanRequested(defaultLoan);
    loadArchetype(key, defaultLoan);
  };

  const handleLoanChange = (newLoan: number) => {
    setLoanRequested(newLoan);
    if (mode === 'archetype') {
      loadArchetype(selectedProfileKey, newLoan);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('merchant_name', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/v1/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to parse statement');
      }
      const data: AnalysisResponse = await res.json();
      setAnalysis(data);
      setLoanRequested(data.merchant_vitals.loan_requested);
    } catch (err: any) {
      setErrorMessage(err.message || 'File upload analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="workspace-page-root" className="min-h-screen bg-[#F8FBFF] text-[#210F60] pb-24 font-sans">
      {/* Workspace Sub-header */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-6 lg:px-8 sticky top-20 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1DCF9F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-[#210F60] uppercase tracking-wide">
              Underwriting Studio
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1DCF9F]" />
              <span className="text-[#006C51] font-bold">NDPA 2023 §37 Active</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Model: {health?.llm_connection?.active_model || 'Gemini'}</span>
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {errorMessage && (
          <div
            id="workspace-error-banner"
            className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadArchetype(selectedProfileKey, loanRequested)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1. Profile Ingestion & Selection */}
        <ProfileSelector
          mode={mode}
          onModeChange={setMode}
          selectedProfileKey={selectedProfileKey}
          onProfileSelect={handleProfileSelect}
          loanRequested={loanRequested}
          onLoanRequestedChange={handleLoanChange}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
        />

        {isLoading && !analysis && (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(33,15,96,0.05)]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#1DCF9F] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#210F60]">
              Calibrating Conformal Risk Intervals &amp; Dual Explanations...
            </p>
            <p className="text-xs text-slate-500 mt-1">Applying split conformal calibration over empirical trade cycles</p>
          </div>
        )}

        {analysis && (
          <>
            {/* 2. Financial Vitals & Normalized Run-Rate */}
            <FinancialVitals vitals={analysis.merchant_vitals} sampleRecords={analysis.sample_records} />

            {/* 3. Conformal Prediction Range Gauge */}
            <ConformalRiskBar risk={analysis.conformal_risk} forensicAudit={analysis.forensic_audit} />

            {/* 4. Conformal Historical Trajectory & Recharts Distribution */}
            <ConformalRiskTrendChart
              risk={analysis.conformal_risk}
              vitals={analysis.merchant_vitals}
              sampleRecords={analysis.sample_records}
            />

            {/* 5. Dual-Language Underwriting Tabs */}
            <ExplainabilityTabs explanation={analysis.llm_explanation} />

            {/* 6. Section 37 Statutory Underwriting Sign-Off */}
            <ComplianceSignOff vitals={analysis.merchant_vitals} risk={analysis.conformal_risk} />
          </>
        )}
      </main>
    </div>
  );
};
