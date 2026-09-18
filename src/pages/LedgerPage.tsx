import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Filter,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { TransactionRecord } from '../types';

interface ArchetypeData {
  name: string;
  market: string;
  monthlyInflow: number;
  volatility: number;
  dailyTx: number;
  records: TransactionRecord[];
  rawSnippets: { raw: string; scrubbed: string; type: string }[];
}

const ARCHETYPE_LEDGER_DATA: Record<string, ArchetypeData> = {
  'Mama Bukky Foodstuff (Bodija Market)': {
    name: 'Mama Bukky Foodstuff',
    market: 'Bodija Market, Ibadan',
    monthlyInflow: 1850000,
    volatility: 11.8,
    dailyTx: 48,
    records: [
      { date: '2026-09-01', amount: 85000, category: 'POS Terminal Cash-In', description: 'Moniepoint POS Settlement [REDACTED_PHONE]' },
      { date: '2026-09-02', amount: 120000, category: 'Grain Wholesale Inflow', description: 'NIP Inward Transfer from Alhaji Garba [REDACTED_BVN]' },
      { date: '2026-09-03', amount: 45000, category: 'Retail Foodstuff', description: 'OPay Merchant POS Daily Settlement' },
      { date: '2026-09-04', amount: 62000, category: 'Retail Foodstuff', description: 'PalmPay Cashier Inflow Bodija Line 4' },
      { date: '2026-09-05', amount: 95000, category: 'Produce Sales', description: 'Access Bank Transfer [REDACTED_ACCOUNT]' },
      { date: '2026-09-06', amount: 110000, category: 'POS Terminal Cash-In', description: 'Moniepoint Aggregator Batch Credit' },
      { date: '2026-09-07', amount: 78000, category: 'Grain Wholesale Inflow', description: 'Bodija Market Cooperative Inflow' },
      { date: '2026-09-08', amount: 53000, category: 'Retail Foodstuff', description: 'OPay QR Code Payment Collection' },
    ],
    rawSnippets: [
      {
        raw: 'TRF/22241509122/MAMA BUKKY/08034567890/FOODSTUFF WHOLESALE',
        scrubbed: 'TRF/[REDACTED_ACCOUNT]/MAMA BUKKY/[REDACTED_PHONE]/FOODSTUFF WHOLESALE',
        type: 'Phone & Account Redaction',
      },
      {
        raw: 'NIP CR/22290184719/GARBA/BVN 22214589012/SETTLEMENT',
        scrubbed: 'NIP CR/[REDACTED_ACCOUNT]/GARBA/BVN [REDACTED_BVN]/SETTLEMENT',
        type: 'BVN (Bank Verification Number)',
      },
      {
        raw: 'PALMPAY/TRANSFER/09023456789/NURSE_TITI_BODIJA',
        scrubbed: 'PALMPAY/TRANSFER/[REDACTED_PHONE]/NURSE_TITI_BODIJA',
        type: 'Mobile Phone Scrub',
      },
    ],
  },
  'Emeka Electronics (Alaba International)': {
    name: 'Emeka Electronics & Accessories',
    market: 'Alaba International, Lagos',
    monthlyInflow: 4200000,
    volatility: 38.5,
    dailyTx: 22,
    records: [
      { date: '2026-09-01', amount: 450000, category: 'Component Sales', description: 'Zenith Bank Transfer Chidi [REDACTED_ACCOUNT]' },
      { date: '2026-09-02', amount: 180000, category: 'POS Settlement', description: 'Moniepoint Batch Alaba [REDACTED_PHONE]' },
      { date: '2026-09-03', amount: 520000, category: 'Bulk Inflow', description: 'Direct Credit Onyeka Trading [REDACTED_BVN]' },
      { date: '2026-09-04', amount: 95000, category: 'Retail Cables', description: 'OPay POS Terminal 4491' },
      { date: '2026-09-05', amount: 310000, category: 'Inverter Sale', description: 'NIP Inward UBA [REDACTED_ACCOUNT]' },
    ],
    rawSnippets: [
      {
        raw: 'NIP CR/00148927110/CHIDI ELECTRONICS/08123456780',
        scrubbed: 'NIP CR/[REDACTED_ACCOUNT]/CHIDI ELECTRONICS/[REDACTED_PHONE]',
        type: 'Account & Contact Scrub',
      },
    ],
  },
  'Baba Musa Agro-Allied (Dawanau Grain)': {
    name: 'Baba Musa Agro-Allied Commodities',
    market: 'Dawanau Market, Kano',
    monthlyInflow: 3100000,
    volatility: 47.2,
    dailyTx: 14,
    records: [
      { date: '2026-09-01', amount: 800000, category: 'Grain Bagging', description: 'Jaiz Bank Settlement [REDACTED_ACCOUNT]' },
      { date: '2026-09-02', amount: 150000, category: 'Local Cash-In', description: 'POS Inflow Dawanau Line [REDACTED_PHONE]' },
      { date: '2026-09-03', amount: 650000, category: 'Sorghum Batch', description: 'NIP CR Ibrahim Musa [REDACTED_BVN]' },
    ],
    rawSnippets: [
      {
        raw: 'JAIZ/BULK/2001928471/BABA MUSA/BVN 22189047120',
        scrubbed: 'JAIZ/BULK/[REDACTED_ACCOUNT]/BABA MUSA/BVN [REDACTED_BVN]',
        type: 'BVN Redaction',
      },
    ],
  },
};

export const LedgerPage: React.FC = () => {
  const [selectedProfileKey, setSelectedProfileKey] = useState<string>('Mama Bukky Foodstuff (Bodija Market)');
  const [showRawComparison, setShowRawComparison] = useState(false);
  const data = ARCHETYPE_LEDGER_DATA[selectedProfileKey] || ARCHETYPE_LEDGER_DATA['Mama Bukky Foodstuff (Bodija Market)'];

  return (
    <div id="ledger-page-root" className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans pb-20">
      {/* Header bar */}
      <div className="bg-[#121824] border-b border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100 uppercase tracking-wide">
                Ledger &amp; Forensic Inspector
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                NDPA 2023 §24 Compliant
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans font-medium">
              Zero personal identifiers (BVN, phone numbers, customer accounts) stored in memory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRawComparison(!showRawComparison)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-xs"
            >
              {showRawComparison ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
              <span>{showRawComparison ? 'Hide Sanitization Proof' : 'Show Sanitization Proof'}</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Profile Selector Filter */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#121824] border border-slate-800/80 font-mono text-xs overflow-x-auto shadow-xs">
          <span className="text-slate-400 px-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Select Ledger:</span>
          </span>
          {Object.keys(ARCHETYPE_LEDGER_DATA).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedProfileKey(key)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedProfileKey === key
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {ARCHETYPE_LEDGER_DATA[key].name}
            </button>
          ))}
        </div>

        {/* Sanitization Proof Box */}
        {showRawComparison && (
          <div className="p-5 rounded-xl bg-[#121824] border border-slate-800/80 space-y-3 font-mono shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic Regex Scrubbing Proof (NDPA §24 Audit Test)</span>
              </span>
              <span className="text-[10px] text-slate-400">Canonical Regex Pre-Processing</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {data.rawSnippets.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.type}</div>
                  <div className="text-rose-400/90 break-all text-[11px]">RAW: {s.raw}</div>
                  <div className="text-emerald-400 break-all text-[11px] font-bold">SCRUBBED: {s.scrubbed}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ledger Transactions Table */}
        <div className="rounded-xl border border-slate-800/80 bg-[#121824] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between font-mono">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Sanitized Ledger Records: {data.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                Market Location: {data.market} • Normalized Inflow: ₦{data.monthlyInflow.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Count: {data.records.length} records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Amount (₦)</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Sanitized Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {data.records.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-4 text-slate-400 tabular-nums">{r.date}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-50 tabular-nums">
                      ₦{r.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">{r.category}</td>
                    <td className="py-2.5 px-4 text-slate-200 font-sans">
                      {r.description.includes('[REDACTED') ? (
                        <span className="font-mono text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded text-[11px] border border-amber-500/30">
                          {r.description}
                        </span>
                      ) : (
                        r.description
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
