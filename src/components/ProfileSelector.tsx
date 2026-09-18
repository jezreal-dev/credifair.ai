import React, { useRef, useState } from 'react';
import { Upload, Users, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PRELOADED_PROFILES } from '../data/seedData';

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size exceeds 5MB ceiling (${(file.size / 1024 / 1024).toFixed(2)} MB). Please upload a smaller file.`);
      return;
    }
    onFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <div
      id="profile-selector-panel"
      className="bg-[#121824] rounded-xl border border-slate-800/80 p-5 sm:p-6 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 tracking-tight">
            1. Merchant Ingestion &amp; Statement Selection
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Select an authentic Nigerian market profile or ingest a raw bank or POS statement
          </p>
        </div>

        {/* Modern Segmented Control */}
        <div className="inline-flex p-1 rounded-lg bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onModeChange('archetype')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              mode === 'archetype'
                ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Verified Archetypes</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              mode === 'upload'
                ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Statement</span>
          </button>
        </div>
      </div>

      {mode === 'archetype' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {Object.entries(PRELOADED_PROFILES).map(([key, p]) => {
              const isSelected = selectedProfileKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onProfileSelect(key)}
                  disabled={isLoading}
                  className={`p-4 rounded-lg text-left transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/60 text-slate-100 shadow-xs ring-1 ring-blue-500/40'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-100 font-sans">{p.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {p.driver}
                    </p>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="text-slate-200 font-medium">Inflow: ₦{(p.monthly_inflow / 1000).toFixed(0)}k/mo</span>
                    <span className="text-slate-400">Vol: {p.volatility}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Requested Facility Slider & Input */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-300 font-mono">
                Requested Facility Limit (₦)
              </label>
              <p className="text-xs text-slate-400 font-sans">
                Adjust target credit facility to simulate underwriting stress testing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={200000}
                max={5000000}
                step={50000}
                value={loanRequested}
                onChange={(e) => onLoanRequestedChange(Number(e.target.value))}
                className="w-36 sm:w-48 accent-blue-500 cursor-pointer"
              />
              <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-50 tabular-nums">
                ₦{loanRequested.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Ingestion Dropzone per Directive #3.C */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-950/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-blue-500/60 hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Soft blue circular badge wrapping the upload icon */}
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-3 text-blue-400 shadow-sm">
            <Upload className="w-5 h-5" />
          </div>

          <h3 className="text-xs font-semibold text-slate-100 font-mono mb-1">
            Drop raw CSV, TXT, or PDF bank statement here
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
            5MB maximum file size. Deterministic PII sanitization (BVN, phone numbers, customer accounts) executes automatically before feature extraction.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors shadow-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>Browse Statement File</span>
          </div>
        </div>
      )}
    </div>
  );
};
