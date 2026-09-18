import React, { useState } from 'react';
import { ShieldCheck, KeyRound, CheckCircle, Copy, Check, Lock } from 'lucide-react';
import { AuditManifest, ConformalRisk, MerchantVitals } from '../types';

interface ComplianceSignOffProps {
  vitals: MerchantVitals;
  risk: ConformalRisk;
}

export const ComplianceSignOff: React.FC<ComplianceSignOffProps> = ({ vitals, risk }) => {
  const [officerId, setOfficerId] = useState('LO-ABUJA-741');
  const [manifest, setManifest] = useState<AuditManifest | null>(null);
  const [isSealing, setIsSealing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSignOff = async () => {
    setIsSealing(true);
    try {
      const res = await fetch('/api/v1/sign-off', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: vitals.merchant_id,
          point_risk: risk.point_risk_pct,
          lower_bound: risk.lower_bound_pct,
          upper_bound: risk.upper_bound_pct,
          recommendation: risk.recommendation,
          officer_id: officerId,
        }),
      });
      const data = await res.json();
      if (data.sealed_manifest) {
        setManifest(data.sealed_manifest);
      }
    } catch (err) {
      console.error('Sign off failed:', err);
    } finally {
      setIsSealing(false);
    }
  };

  const handleCopyManifest = () => {
    if (!manifest) return;
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="compliance-signoff-panel" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              5. Regulatory Compliance &amp; Human Underwriting Sign-Off
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Statutory Gate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            NDPA 2023 Section 37: Solely automated credit decisions strictly prohibited. Human-in-the-Loop underwriting required.
          </p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Officer Input & Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="flex-1">
          <label htmlFor="officer-id-input" className="block text-xs font-medium text-slate-700 mb-1">
            Loan Officer Full Name / Staff Accreditation ID:
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="officer-id-input"
              type="text"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              placeholder="e.g. LO-ABUJA-741 or Grace Okon"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
            />
          </div>
        </div>

        <button
          id="btn-generate-manifest"
          type="button"
          onClick={handleSignOff}
          disabled={isSealing || !officerId.trim()}
          className="sm:self-end py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isSealing ? 'Sealing Cryptographic Manifest...' : 'Seal Statutory Audit Manifest'}</span>
        </button>
      </div>

      {/* Manifest Display */}
      {manifest && (
        <div id="sealed-manifest-result" className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-emerald-200/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  Statutory Audit Manifest Sealed Under SHA-256
                </div>
                <div className="text-[11px] text-emerald-800 font-mono break-all">
                  Hash: {manifest.audit_hash_sha256}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyManifest}
              className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-emerald-300 text-xs font-medium text-emerald-800 hover:bg-emerald-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy Manifest'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
            <div className="p-2 bg-white rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-400 block">NDPA Compliance</span>
              <span className="font-semibold text-emerald-700">{manifest.ndpa_compliance}</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-400 block">Assigned Officer</span>
              <span className="font-semibold text-slate-800">{manifest.governance_status.assigned_officer}</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-400 block">Automated Solely</span>
              <span className="font-semibold text-slate-800">
                {manifest.governance_status.solely_automated_execution ? 'Yes' : 'No (Human Verified)'}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-400 block">Sealed Timestamp</span>
              <span className="font-semibold text-slate-800 truncate block">
                {new Date(manifest.timestamp_utc).toLocaleTimeString()} UTC
              </span>
            </div>
          </div>

          <details className="text-xs">
            <summary className="font-mono text-slate-600 cursor-pointer hover:text-slate-900 select-none">
              Inspect Canonical RFC 8785 Manifest JSON
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
              {JSON.stringify(manifest, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};
