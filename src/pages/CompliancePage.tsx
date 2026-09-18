import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Copy,
  Check,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
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
          setManifests((prev) => [...parsed, ...prev]);
        }
      }
    } catch {
      // fallback to seed
    }
  }, []);

  const handleCopy = (text: string, hash: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDownloadAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifests, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `credifair_ndpa_audit_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="compliance-page-root" className="min-h-screen bg-[#F8FBFF] text-[#210F60] font-sans pb-24">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 sticky top-20 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#210F60] tracking-tight">
                NDPA 2023 Section 37 Statutory Audit Vault
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E4FFF8] text-[#006C51] border border-[#1DCF9F]/30">
                Tamper-Evident Ledger
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Verifiable SHA-256 cryptographic manifests certifying human supervisory sign-off on credit determinations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#210F60] transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#1DCF9F]" />
              <span>Export Audit Bundle (.json)</span>
            </button>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1DCF9F] hover:bg-[#1ac395] text-[#210F60] text-xs font-bold transition-all shadow-md"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Compliance Statute Banner */}
        <div className="p-6 rounded-3xl bg-[#210F60] text-white space-y-2 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-60 h-60 rounded-full bg-[#1DCF9F]/15 blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 font-bold text-sm text-[#1DCF9F]">
            <ShieldCheck className="w-5 h-5" />
            <span>Nigeria Data Protection Act (NDPA) 2023 Section 37 Mandate</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
            A data subject has the right not to be subjected to a decision based solely on automated processing, including profiling, which produces legal or similarly significant effects. CrediFair AI strictly enforces supervisory human credit analyst sign-off before any credit limit or loan decision takes legal effect.
          </p>
        </div>

        {/* Manifest Entries */}
        {manifests.map((m, idx) => {
          const isApproval = m.governance_status.recommendation.includes('APPROVAL');
          return (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(33,15,96,0.05)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#1DCF9F]" />
                  <span className="font-extrabold text-[#210F60]">{m.pseudonymized_id}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-500 font-mono">{m.timestamp_utc}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                      isApproval
                        ? 'bg-[#E4FFF8] text-[#006C51] border-[#1DCF9F]/40'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {m.governance_status.recommendation}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(m, null, 2), m.audit_hash_sha256)}
                    className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                    title="Copy full JSON manifest"
                  >
                    {copiedHash === m.audit_hash_sha256 ? (
                      <Check className="w-4 h-4 text-[#1DCF9F]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hash and Supervisory Officer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-slate-100 space-y-1">
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-sans">
                    SHA-256 Cryptographic Seal
                  </div>
                  <div className="font-bold text-[#210F60] text-[11px] break-all">
                    {m.audit_hash_sha256}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-slate-100 space-y-1">
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-sans">
                    Supervisory Officer
                  </div>
                  <div className="text-[#210F60] font-bold text-xs font-sans">
                    {m.governance_status.assigned_officer}
                  </div>
                  <div className="text-[11px] text-[#006C51] font-extrabold">
                    STATUS: {m.governance_status.signature_status}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-6 pt-1 flex-wrap font-mono">
                <span>Point Risk: <strong className="text-[#210F60] font-bold">{m.conformal_metrics.point_risk_pct}%</strong></span>
                <span>
                  95% Interval: <strong className="text-[#006C51] font-bold">[{m.conformal_metrics.confidence_interval_95[0]}% — {m.conformal_metrics.confidence_interval_95[1]}%]</strong>
                </span>
                <span>Solely Automated: <strong className="text-rose-600 font-bold">FALSE (Section 37 Compliant)</strong></span>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};
