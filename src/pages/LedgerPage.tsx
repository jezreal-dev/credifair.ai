import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Filter,
  ArrowRight,
  Lock,
  ShieldCheck,
  CheckCircle2,
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
      { date: '2026-09-03', amount: 45000, category: 'Retail Foodstuff', description: 'Merchant Terminal POS Daily Settlement' },
      { date: '2026-09-04', amount: 62000, category: 'Retail Foodstuff', description: 'PalmPay Cashier Inflow Bodija Line 4' },
      { date: '2026-09-05', amount: 95000, category: 'Produce Sales', description: 'Access Bank Transfer [REDACTED_ACCOUNT]' },
      { date: '2026-09-06', amount: 110000, category: 'POS Terminal Cash-In', description: 'Moniepoint Aggregator Batch Credit' },
      { date: '2026-09-07', amount: 78000, category: 'Grain Wholesale Inflow', description: 'Bodija Market Cooperative Inflow' },
      { date: '2026-09-08', amount: 53000, category: 'Retail Foodstuff', description: 'Smart Merchant QR Payment Collection' },
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
    volatility: 28.4,
    dailyTx: 22,
    records: [
      { date: '2026-09-01', amount: 350000, category: 'Audio Equipment Wholesale', description: 'GTBank Transfer [REDACTED_ACCOUNT] [REDACTED_PHONE]' },
      { date: '2026-09-02', amount: 80000, category: 'POS Inflow', description: 'Merchant Terminal POS Daily Settlement' },
      { date: '2026-09-03', amount: 490000, category: 'Solar Inverter Consignment', description: 'Direct Deposit by Chief Obi [REDACTED_BVN]' },
      { date: '2026-09-04', amount: 150000, category: 'TV Display Units', description: 'Zenith Direct Settlement [REDACTED_ACCOUNT]' },
      { date: '2026-09-05', amount: 95000, category: 'Accessories Retail', description: 'Kuda Bank Inflow from Retailer' },
      { date: '2026-09-06', amount: 280000, category: 'Audio Equipment Wholesale', description: 'FirstBank Transfer [REDACTED_PHONE]' },
    ],
    rawSnippets: [
      {
        raw: 'GTB/TRANSFER/0129481920/EMEKA ELEC/08123456789/INVERTER',
        scrubbed: 'GTB/TRANSFER/[REDACTED_ACCOUNT]/EMEKA ELEC/[REDACTED_PHONE]/INVERTER',
        type: 'Account & Phone Scrub',
      },
      {
        raw: 'ZENITH/NIP/2019284712/CHIEF OBI/BVN 22194829104',
        scrubbed: 'ZENITH/NIP/[REDACTED_ACCOUNT]/CHIEF OBI/BVN [REDACTED_BVN]',
        type: 'BVN Protection',
      },
    ],
  },
  'Alhaji Musa Grains (Dawanau Market)': {
    name: 'Alhaji Musa Grains Merchant',
    market: 'Dawanau Grain Market, Kano',
    monthlyInflow: 6800000,
    volatility: 42.1,
    dailyTx: 14,
    records: [
      { date: '2026-09-01', amount: 1200000, category: 'Millet Bulk Consignment', description: 'Jaiz Bank NIP Settlement [REDACTED_ACCOUNT]' },
      { date: '2026-09-03', amount: 850000, category: 'Sorghum Trailer Supply', description: 'Sterling Bank Credit [REDACTED_BVN]' },
      { date: '2026-09-05', amount: 2100000, category: 'Maize Processing Depot', description: 'UBA Wholesale Transfer [REDACTED_ACCOUNT]' },
      { date: '2026-09-08', amount: 450000, category: 'Millet Bulk Consignment', description: 'Moniepoint Inflow [REDACTED_PHONE]' },
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
    <div id="ledger-page-root" className="min-h-screen bg-[#F8FBFF] text-[#210F60] font-sans pb-24">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 sticky top-20 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#210F60] tracking-tight">
                Sanitized Ledger &amp; Forensic Inspector
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E4FFF8] text-[#006C51] border border-[#1DCF9F]/30">
                NDPA 2023 §24 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Zero personal identifiers (BVN, telephone numbers, customer accounts) stored in memory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowRawComparison(!showRawComparison)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#210F60] transition-colors shadow-xs"
            >
              {showRawComparison ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-[#1DCF9F]" />}
              <span>{showRawComparison ? 'Hide Sanitization Proof' : 'Show Sanitization Proof'}</span>
            </button>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1DCF9F] hover:bg-[#1ac395] text-[#210F60] text-xs font-bold transition-all shadow-md"
            >
              <span>Back to Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Profile Selector Filter */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(33,15,96,0.05)] text-xs overflow-x-auto">
          <span className="text-slate-500 px-3 shrink-0 flex items-center gap-1 font-bold">
            <Filter className="w-3.5 h-3.5 text-[#1DCF9F]" />
            <span>Select Ledger:</span>
          </span>
          {Object.keys(ARCHETYPE_LEDGER_DATA).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedProfileKey(key)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                selectedProfileKey === key
                  ? 'bg-[#1DCF9F] text-[#210F60] shadow-sm'
                  : 'text-slate-600 hover:text-[#210F60] hover:bg-slate-50'
              }`}
            >
              {ARCHETYPE_LEDGER_DATA[key].name}
            </button>
          ))}
        </div>

        {/* Sanitization Proof Box */}
        {showRawComparison && (
          <div className="p-6 rounded-3xl bg-white border border-slate-100 space-y-4 shadow-[0_4px_24px_rgba(33,15,96,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-extrabold text-[#210F60] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1DCF9F]" />
                <span>Deterministic Regex Scrubbing Proof (NDPA §24 Audit Test)</span>
              </span>
              <span className="text-xs font-bold text-[#006C51] bg-[#E4FFF8] px-2.5 py-1 rounded-full">
                Privacy Enforced
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {data.rawSnippets.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8FBFF] border border-slate-100 space-y-1.5">
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{s.type}</div>
                  <div className="text-rose-600 break-all font-mono text-[11px]">RAW: {s.raw}</div>
                  <div className="text-[#006C51] break-all font-mono text-[11px] font-bold">SCRUBBED: {s.scrubbed}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ledger Transactions Table */}
        <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-[0_4px_24px_rgba(33,15,96,0.05)]">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#210F60]">
                Sanitized Ledger Records: {data.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Market Location: {data.market} • Normalized Inflow: ₦{data.monthlyInflow.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500 font-mono">
              Count: {data.records.length} records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FBFF] text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-right">Amount (₦)</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Sanitized Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.records.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FBFF] transition-colors">
                    <td className="py-3.5 px-6 text-slate-500 font-mono tabular-nums whitespace-nowrap">{r.date}</td>
                    <td className="py-3.5 px-6 font-bold text-[#210F60] font-mono tabular-nums text-right whitespace-nowrap">
                      ₦{r.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{r.category}</td>
                    <td className="py-3.5 px-6 text-[#210F60] font-medium">
                      {r.description.includes('[REDACTED') ? (
                        <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200">
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
