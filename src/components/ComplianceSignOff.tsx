import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Lock, CheckCircle2 } from 'lucide-react';
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

        try {
          const stored = localStorage.getItem('credifair_sealed_vault');
          const list: AuditManifest[] = stored ? JSON.parse(stored) : [];
          list.unshift(data.sealed_manifest);
          localStorage.setItem('credifair_sealed_vault', JSON.stringify(list.slice(0, 50)));
        } catch (e) {
          console.warn('Vault storage notice:', e);
        }
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
    <div
      id="compliance-signoff-panel"
      className="bg-[#121824] rounded-xl border border-slate-800/80 p-5 sm:p-6 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-100 tracking-tight">
              Section 37 Statutory Underwriting Sign-Off
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Statutory Gate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Nigeria Data Protection Act (NDPA) 2023 §37 mandate: automated credit profiling cannot solely determine credit facilities without verifiable human intervention.
          </p>
        </div>
      </div>

      {!manifest ? (
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
          <div className="text-xs text-slate-300 font-mono space-y-1.5">
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Statutory Notice &amp; Attestation:
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              By executing this cryptographic signature, the designated human credit risk officer confirms direct oversight, verifies the conformal risk interval, and certifies the evaluation as legally binding under Nigerian financial law.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-slate-400">Loan Officer ID:</label>
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. LO-LAGOS-012"
                className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSignOff}
              disabled={isSealing || !officerId.trim()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold transition-all shadow-xs disabled:opacity-50 hover:shadow-blue-500/25"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSealing ? 'Sealing Cryptographic Manifest...' : 'Execute Human Sign-Off'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 font-mono">
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">
                Legally Binding Audit Manifest Sealed (NDPA 2023 §37 Verified)
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyManifest}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-emerald-500/40 text-xs text-emerald-300 hover:bg-slate-800 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Canonical SHA-256 Audit Seal:</span>
              <span className="font-bold text-slate-100 font-mono text-xs break-all">
                {manifest.audit_hash_sha256}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
              <div>
                <span className="text-slate-400">Merchant Pseudonym:</span>{' '}
                <span className="text-slate-200">{manifest.pseudonymized_id}</span>
              </div>
              <div>
                <span className="text-slate-400">Assigned Officer:</span>{' '}
                <span className="text-slate-200">{manifest.governance_status.assigned_officer}</span>
              </div>
              <div>
                <span className="text-slate-400">Timestamp UTC:</span>{' '}
                <span className="text-slate-200">{manifest.timestamp_utc}</span>
              </div>
              <div>
                <span className="text-slate-400">Signature Status:</span>{' '}
                <span className="text-emerald-400 font-semibold">{manifest.governance_status.signature_status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
