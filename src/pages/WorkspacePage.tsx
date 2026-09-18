import React, { useState, useEffect, useCallback } from 'react';
import { ProfileSelector } from '../components/ProfileSelector';
import { FinancialVitals } from '../components/FinancialVitals';
import { ConformalRiskBar } from '../components/ConformalRiskBar';
import { ExplainabilityTabs } from '../components/ExplainabilityTabs';
import { ComplianceSignOff } from '../components/ComplianceSignOff';
import { PRELOADED_PROFILES } from '../data/seedData';
import { AnalysisResponse, HealthResponse } from '../types';
import { AlertCircle, ArrowLeft, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkspacePageProps {
  health: HealthResponse | null;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ health }) => {
  const [mode, setMode] = useState<'archetype' | 'upload'>('archetype');
  const [selectedProfileKey, setSelectedProfileKey] = useState<string>('Mama Bukky Foodstuff (Bodija Market)');
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
    loadArchetype('Mama Bukky Foodstuff (Bodija Market)', 750000);
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
    <div id="workspace-page-root" className="min-h-screen bg-[#0B0E14] text-slate-100 pb-20 font-sans">
      {/* Workspace Sub-header */}
      <div className="bg-[#121824] border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wide">
              Underwriting Studio
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NDPA 2023 §37 Active</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Model: {health?.llm_connection?.active_model || 'Gemini'}</span>
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {errorMessage && (
          <div
            id="workspace-error-banner"
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadArchetype(selectedProfileKey, loanRequested)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-mono shadow-xs transition-colors"
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
          <div className="p-12 text-center bg-[#121824] rounded-xl border border-slate-800/80 font-mono shadow-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-100">
              Calibrating Conformal Risk Intervals &amp; Dual Explanations...
            </p>
            <p className="text-xs text-slate-400 mt-1">Applying split conformal calibration over empirical trade cycles</p>
          </div>
        )}

        {analysis && (
          <>
            {/* 2. Financial Vitals & Normalized Run-Rate */}
            <FinancialVitals vitals={analysis.merchant_vitals} sampleRecords={analysis.sample_records} />

            {/* 3. Conformal Prediction Range Gauge */}
            <ConformalRiskBar risk={analysis.conformal_risk} forensicAudit={analysis.forensic_audit} />

            {/* 4. Dual-Language Underwriting Tabs */}
            <ExplainabilityTabs explanation={analysis.llm_explanation} />

            {/* 5. Section 37 Statutory Underwriting Sign-Off */}
            <ComplianceSignOff vitals={analysis.merchant_vitals} risk={analysis.conformal_risk} />
          </>
        )}
      </main>
    </div>
  );
};
