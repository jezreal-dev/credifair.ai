import React from 'react';
import { ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { HealthResponse } from '../types';

interface HeaderProps {
  health: HealthResponse | null;
}

export const Header: React.FC<HeaderProps> = ({ health }) => {
  return (
    <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">CrediFair AI</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v2.0 Conformal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Distribution-Free Conformal Risk Engine &amp; NDPA 2023 §37 Statutory Underwriting
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              id="engine-calibration-status"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Engine:</span>
              <span className="font-semibold text-emerald-700">
                {health?.engine_calibrated ? '95% Calibrated' : 'Active (MAPIE)'}
              </span>
            </div>

            <div
              id="llm-connection-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Provider:</span>
              <span className="font-semibold text-slate-900">
                {health?.llm_connection?.provider || 'Google Gemini / Local'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  health?.llm_connection?.is_connected ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
