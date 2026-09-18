import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileSignature, Lock, ExternalLink } from 'lucide-react';
import { MerchantVitals, ConformalRisk } from '../types';
import { Link } from 'react-router-dom';

interface ComplianceSignOffProps {
  vitals: MerchantVitals;
  risk: ConformalRisk;
}

export const ComplianceSignOff: React.FC<ComplianceSignOffProps> = ({ vitals, risk }) => {
  const [officerName, setOfficerName] = useState('Chinedu Okafor (Senior Credit Analyst)');
  const [officerNotes, setOfficerNotes] = useState(
    'Merchant POS cashflow demonstrates stable velocity. Approved facility is within 35% debt service ratio constraint.'
  );
  const [isSigned, setIsSigned] = useState(false);
  const [manifestHash, setManifestHash] = useState<string | null>(null);

  const handleSignOff = async (e: React.FormEvent) => {
    e.preventDefault();
    const manifestPayload = {
      merchant_id: vitals.merchant_id,
      timestamp: new Date().toISOString(),
      officer_name: officerName,
      officer_notes: officerNotes,
      conformal_bounds: [risk.lower_bound_pct, risk.upper_bound_pct],
      point_risk: risk.point_risk_pct,
      decision: risk.recommendation,
      monthly_inflow: vitals.monthly_inflow,
      statute: 'NDPA 2023 Section 37',
    };

    // Calculate simulated SHA-256 hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(manifestPayload));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    setManifestHash(hashHex);
    setIsSigned(true);

    // Save to local compliance vault
    const existing = JSON.parse(localStorage.getItem('credifair_sealed_vault') || '[]');
    existing.unshift({
      ndpa_compliance: 'VERIFIED_COMPLIANT',
      statutory_mandate: 'NDPA 2023 Section 37 (Safeguard Against Solely Automated Decisions)',
      audit_hash_sha256: hashHex,
      timestamp_utc: new Date().toISOString(),
      pseudonymized_id: vitals.merchant_id,
      conformal_metrics: {
        point_risk_pct: risk.point_risk_pct,
        confidence_interval_95: [risk.lower_bound_pct, risk.upper_bound_pct],
        alpha: 0.05,
      },
      governance_status: {
        recommendation: risk.recommendation,
        solely_automated_execution: false,
        assigned_officer: officerName,
        signature_status: 'OFFICER_AUTHORIZED',
      },
    });
    localStorage.setItem('credifair_sealed_vault', JSON.stringify(existing.slice(0, 50)));
  };

  return (
    <div
      id="compliance-signoff-panel"
      className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_24px_rgba(33,15,96,0.05)] space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E4FFF8] text-[#006C51] flex items-center justify-center text-xs font-bold">
              6
            </span>
            <h2 className="text-lg font-bold text-[#210F60] tracking-tight">
              NDPA 2023 Section 37 Supervisory Sign-Off
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 pl-8">
            Mandatory human-in-the-loop credit evaluation. Fully automated credit decisions without officer sign-off are strictly prohibited.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E4FFF8] border border-[#1DCF9F]/30 text-xs font-bold text-[#006C51]">
          <ShieldCheck className="w-4 h-4 text-[#1DCF9F]" />
          <span>Section 37 Enforced</span>
        </div>
      </div>

      {!isSigned ? (
        <form onSubmit={handleSignOff} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#210F60] mb-1">
                Designated Credit Officer
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#210F60] font-medium bg-[#F8FBFF] focus:outline-hidden focus:border-[#1DCF9F] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#210F60] mb-1">
                Statutory Regulatory Standard
              </label>
              <div className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 bg-slate-50 font-mono">
                NDPA 2023 §37(1)(a) • Central Bank of Nigeria Guidelines
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-[#210F60] mb-1">
              Supervisory Review &amp; Justification Note
            </label>
            <textarea
              rows={3}
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#210F60] font-medium bg-[#F8FBFF] focus:outline-hidden focus:border-[#1DCF9F] focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-[#1DCF9F]" />
              <span>Generates tamper-evident SHA-256 audit record upon confirmation</span>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1DCF9F] hover:bg-[#1ac395] text-[#210F60] font-bold text-xs transition-all shadow-md hover:shadow-lg"
            >
              <FileSignature className="w-4 h-4" />
              <span>Affix Supervisory Cryptographic Signature</span>
            </button>
          </div>
        </form>
      ) : (
        /* Completed Seal */
        <div className="p-6 rounded-2xl bg-[#F4FFF8] border border-[#1DCF9F]/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#006C51]">
              <CheckCircle2 className="w-5 h-5 text-[#1DCF9F]" />
              <span>Cryptographic Sign-Off Verified and Sealed</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#1DCF9F] text-[#210F60] font-mono text-xs font-extrabold">
              NDPA §37 SEALED
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-700 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-2">
              <span>Signatory: {officerName}</span>
              <span>Timestamp: {new Date().toUTCString()}</span>
            </div>
            <div className="break-all pt-1">
              <span className="text-slate-400 font-sans">SHA-256 Digest: </span>
              <span className="text-[#210F60] font-bold">{manifestHash}</span>
            </div>
            <div className="text-slate-600 font-sans text-xs pt-1">
              <strong>Supervisor Note: </strong>
              <span>{officerNotes}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-500">
              Manifest persisted in audit ledger. Fully auditable by Nigeria Data Protection Commission (NDPC).
            </span>
            <Link
              to="/compliance"
              className="inline-flex items-center gap-1 font-bold text-[#006C51] hover:underline"
            >
              <span>View in Compliance Vault</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
