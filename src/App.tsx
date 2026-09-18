import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProfileSelector } from './components/ProfileSelector';
import { FinancialVitals } from './components/FinancialVitals';
import { ConformalRiskCard } from './components/ConformalRiskCard';
import { ExplainabilityTabs } from './components/ExplainabilityTabs';
import { ComplianceSignOff } from './components/ComplianceSignOff';
import { PRELOADED_PROFILES } from './data/seedData';
import { AnalysisResponse, HealthResponse } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [mode, setMode] = useState<'archetype' | 'upload'>('archetype');
  const [selectedProfileKey, setSelectedProfileKey] = useState<string>('Bodija Retail Archetype');
  const [loanRequested, setLoanRequested] = useState<number>(750000);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial health
  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.warn('Health check failed:', err));
  }, []);

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
        throw new Error(err.error || 'Failed to parse ledger');
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Header health={health} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
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

        {analysis && (
          <>
            {/* 2. Financial Vitals & Sanitized Ledger */}
            <FinancialVitals
              vitals={analysis.merchant_vitals}
              sampleRecords={analysis.sample_records}
            />

            {/* 3. Calibrated Conformal Risk Assessment */}
            <ConformalRiskCard risk={analysis.conformal_risk} />

            {/* 4. Decision Reasoning & Merchant Guidance */}
            <ExplainabilityTabs explanation={analysis.llm_explanation} />

            {/* 5. Statutory Underwriting Sign-Off */}
            <ComplianceSignOff vitals={analysis.merchant_vitals} risk={analysis.conformal_risk} />
          </>
        )}
      </main>
    </div>
  );
}
