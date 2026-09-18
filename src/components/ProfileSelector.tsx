import React, { useRef } from 'react';
import { Upload, Users, FileSpreadsheet, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ARCHETYPE_PROFILES } from '../data/seedData';

interface ProfileSelectorProps {
  mode: 'archetype' | 'upload';
  onModeChange: (mode: 'archetype' | 'upload') => void;
  selectedProfileKey: string;
  onProfileSelect: (key: string) => void;
  loanRequested: number;
  onLoanRequestedChange: (val: number) => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  mode,
  onModeChange,
  selectedProfileKey,
  onProfileSelect,
  loanRequested,
  onLoanRequestedChange,
  onFileUpload,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div id="profile-selector-panel" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">1. Merchant Ingestion &amp; Profile</h2>
          <p className="text-xs text-slate-500">
            Select an authentic Nigerian market profile or ingest a raw bank/POS statement
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200 text-xs font-medium self-start sm:self-auto">
          <button
            id="tab-archetype"
            type="button"
            onClick={() => onModeChange('archetype')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              mode === 'archetype'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pre-loaded Archetypes</span>
          </button>
          <button
            id="tab-upload"
            type="button"
            onClick={() => onModeChange('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              mode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Raw CSV / Ledger</span>
          </button>
        </div>
      </div>

      {mode === 'archetype' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(ARCHETYPE_PROFILES).map(([key, profile]) => {
            const isSelected = selectedProfileKey === key;
            return (
              <button
                key={key}
                id={`profile-card-${profile.csv_key}`}
                type="button"
                onClick={() => onProfileSelect(key)}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 absolute top-3.5 right-3.5" />
                )}
                <div className="font-semibold text-sm text-slate-900 pr-6">{key}</div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{profile.driver}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Inflow:</span>
                  <span className="font-medium text-slate-800">
                    ₦{(profile.monthly_inflow / 1000).toFixed(0)}k/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-500">Volatility:</span>
                  <span className="font-medium text-slate-800">{profile.volatility}%</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-500">Velocity:</span>
                  <span className="font-medium text-slate-800">{profile.daily_tx} tx/day</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/20 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload-input"
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Upload Bank or POS Transaction Ledger</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Drop your CSV file here or click to browse (Max 5MB per CWE-400 policy). Columns will be deep-scrubbed for
            PII minimization per NDPA Section 24.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-600 font-medium">
            <span>Supported: OPay, Moniepoint, PalmPay, GTB, Access CSVs</span>
          </div>
        </div>
      )}

      {/* Loan Request input adjustment */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Target Loan Facility Request:</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₦</span>
            <input
              id="loan-amount-input"
              type="number"
              min={50000}
              max={50000000}
              step={50000}
              value={loanRequested}
              onChange={(e) => onLoanRequestedChange(Number(e.target.value) || 0)}
              className="pl-7 pr-3 py-1.5 w-44 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
