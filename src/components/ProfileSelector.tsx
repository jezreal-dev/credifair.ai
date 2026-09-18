import React, { useRef, useState } from 'react';
import { Upload, Users, FileSpreadsheet, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
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
      className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_24px_rgba(33,15,96,0.05)] space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E4FFF8] text-[#006C51] flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-lg font-bold text-[#210F60] tracking-tight">
              Merchant Profile &amp; Statement Selection
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-8 font-medium">
            Select a verified Nigerian MSME archetype or ingest a raw bank / POS transaction statement
          </p>
        </div>

        {/* OPay Styled Segmented Switcher */}
        <div className="inline-flex p-1 rounded-full bg-[#F4F7FC] border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onModeChange('archetype')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              mode === 'archetype'
                ? 'bg-[#1DCF9F] text-[#210F60] shadow-sm'
                : 'text-slate-600 hover:text-[#210F60]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Market Archetypes</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('upload')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              mode === 'upload'
                ? 'bg-[#1DCF9F] text-[#210F60] shadow-sm'
                : 'text-slate-600 hover:text-[#210F60]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Statement</span>
          </button>
        </div>
      </div>

      {mode === 'archetype' ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(ARCHETYPE_PROFILES).map(([key, p]) => {
              const isSelected = selectedProfileKey === key;
              return (
                <button
                  key={key}
                  id={`profile-card-${p.csv_key}`}
                  type="button"
                  onClick={() => onProfileSelect(key)}
                  disabled={isLoading}
                  className={`p-5 rounded-2xl text-left transition-all border flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#F4FFF8] to-white border-[#1DCF9F] shadow-[0_6px_20px_rgba(29,207,159,0.18)] ring-2 ring-[#1DCF9F]'
                      : 'bg-white border-slate-200 hover:border-[#1DCF9F]/60 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-extrabold text-[#210F60]">{p.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#1DCF9F] shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.driver}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#210F60]">₦{(p.monthly_inflow / 1000).toFixed(0)}k/mo Inflow</span>
                    <span className="text-slate-500">{p.volatility}% Vol</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Requested Facility Slider with OPay Green Accent */}
          <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#210F60]">
                Requested Working Capital Limit
              </label>
              <p className="text-xs text-slate-500 font-medium">
                Adjust credit facility to simulate underwriting stress test and debt-service bounds
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={200000}
                max={5000000}
                step={50000}
                value={loanRequested}
                onChange={(e) => onLoanRequestedChange(Number(e.target.value))}
                className="w-36 sm:w-52 accent-[#1DCF9F] cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="px-4 py-2 rounded-xl bg-white border border-[#1DCF9F] text-sm font-extrabold text-[#210F60] font-mono shadow-xs tabular-nums">
                ₦{loanRequested.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* OPay Statement Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#1DCF9F] bg-[#E4FFF8]/40 shadow-lg'
              : 'border-slate-200 bg-[#F8FBFF] hover:border-[#1DCF9F] hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-full bg-[#E4FFF8] border border-[#1DCF9F]/30 flex items-center justify-center mx-auto mb-3 text-[#006C51] shadow-xs">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-bold text-[#210F60] mb-1">
            Drop raw CSV, TXT, or PDF bank / POS statement here
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            5MB maximum size. Automated deterministic PII scrubbing (BVN, phone numbers, customer accounts) executes automatically before feature extraction per NDPA 2023 §24.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#210F60] hover:bg-[#2c1b75] text-white text-xs font-bold transition-colors shadow-sm">
            <FileSpreadsheet className="w-4 h-4 text-[#1DCF9F]" />
            <span>Browse Statement File</span>
          </div>
        </div>
      )}
    </div>
  );
};
