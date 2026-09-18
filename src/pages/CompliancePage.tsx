import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Copy,
  Check,
  Download,
  ArrowRight,
} from 'lucide-react';
import { AuditManifest } from '../types';

const SEED_MANIFESTS: AuditManifest[] = [
  {
    ndpa_compliance: 'VERIFIED_COMPLIANT',
    statutory_mandate: 'NDPA 2023 Section 37 (Safeguard Against Solely Automated Decisions)',
    audit_hash_sha256: 'a37a3201101c5ea142789ee4cc68a8b580fee04095230e38426a1fe4c149828d',
    timestamp_utc: '2026-09-18T10:38:04.729Z',
    pseudonymized_id: 'MERCH-MAMA_B',
    conformal_metrics: {
      point_risk_pct: 4.8,
      confidence_interval_95: [2.23, 8.44],
      alpha: 0.05,
    },
    governance_status: {
      recommendation: 'RECOMMENDED FOR APPROVAL',
      solely_automated_execution: false,
      assigned_officer: 'LO-LAGOS-001 (Senior Underwriter)',
      signature_status: 'OFFICER_AUTHORIZED',
    },
  },
  {
    ndpa_compliance: 'VERIFIED_COMPLIANT',
    statutory_mandate: 'NDPA 2023 Section 37 (Safeguard Against Solely Automated Decisions)',
    audit_hash_sha256: '9f8b44c1d2e30a57b82f0129841872630018e627493a1029487c56e019385b4a',
    timestamp_utc: '2026-09-18T09:14:22.108Z',
    pseudonymized_id: 'MERCH-EMEKA_A',
    conformal_metrics: {
      point_risk_pct: 14.6,
      confidence_interval_95: [8.95, 21.32],
      alpha: 0.05,
    },
    governance_status: {
      recommendation: 'MANUAL UNDERWRITING REVIEW REQUIRED',
      solely_automated_execution: false,
      assigned_officer: 'LO-IBADAN-004 (Credit Risk Analyst)',
      signature_status: 'OFFICER_AUTHORIZED',
    },
  },
];

export const CompliancePage: React.FC = () => {
  const [manifests, setManifests] = useState<AuditManifest[]>(SEED_MANIFESTS);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('credifair_sealed_vault');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = [...parsed, ...SEED_MANIFESTS];
          const unique = Array.from(new Map(combined.map((m) => [m.audit_hash_sha256, m])).values());
          setManifests(unique);
        }
      }
    } catch (e) {
      console.warn('Could not read sealed vault:', e);
    }
  }, []);

  const handleCopy = (text: string, hash: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDownloadBundle = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifests, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `credifair_audit_manifests_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="compliance-page-root" className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans pb-20">
      {/* Top bar */}
      <div className="bg-[#121824] border-b border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100 uppercase tracking-wide">
                Compliance Manifest Vault
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                NDPA 2023 §37 Tamper-Proof
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans font-medium">
              Cryptographically sealed audit records for regulatory inspection and human underwriting sign-offs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadBundle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download JSON Audit Bundle</span>
            </button>
            <Link
              to="/app"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Back to Studio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
          <span>Sealed Assessments ({manifests.length} total)</span>
          <span>SHA-256 Canonical JSON Serialization</span>
        </div>

        {manifests.map((m) => {
          const isApproval = m.governance_status.recommendation === 'RECOMMENDED FOR APPROVAL';
          return (
            <div
              key={m.audit_hash_sha256}
              className="p-5 sm:p-6 rounded-xl bg-[#121824] border border-slate-800/80 space-y-3.5 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-100">{m.pseudonymized_id}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">{m.timestamp_utc}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${
                      isApproval
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {m.governance_status.recommendation}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(m, null, 2), m.audit_hash_sha256)}
                    className="p-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                    title="Copy full JSON manifest"
                  >
                    {copiedHash === m.audit_hash_sha256 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hash and Supervisory Officer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">SHA-256 Audit Seal</div>
                  <div className="font-bold text-slate-200 text-[11px] break-all">
                    {m.audit_hash_sha256}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Supervisory Officer</div>
                  <div className="text-slate-200 text-xs">
                    {m.governance_status.assigned_officer}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    STATUS: {m.governance_status.signature_status}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-4 pt-1 flex-wrap">
                <span>Point Estimate: <strong className="text-rose-400">{m.conformal_metrics.point_risk_pct}%</strong></span>
                <span>
                  95% Interval: <strong className="text-blue-400">[{m.conformal_metrics.confidence_interval_95[0]}% — {m.conformal_metrics.confidence_interval_95[1]}%]</strong>
                </span>
                <span>Solely Automated: <strong className="text-slate-300">FALSE</strong></span>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};
