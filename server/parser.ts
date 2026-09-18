import crypto from 'crypto';
import { MerchantVitals, TransactionRecord } from '../src/types';
import { CrediFairComplianceGuard } from './compliance';
import { ForensicRiskGuard } from './forensics';

export class RealDocumentParser {
  static cleanCurrency(val: any): number {
    if (val === undefined || val === null) return 0;
    const s = String(val).replace(/[^\d.-]/g, '');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : Math.round(n * 100) / 100;
  }

  static parseCsvContent(content: string): TransactionRecord[] {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      throw new Error('Empty CSV file provided.');
    }

    // Determine delimiter
    const firstLine = lines[0];
    let sep = ',';
    if (firstLine.includes('\t')) sep = '\t';
    else if (firstLine.includes(';')) sep = ';';
    else if (firstLine.includes('|')) sep = '|';

    const headers = lines[0].split(sep).map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));

    const dateIdx = headers.findIndex((h) => /date|time|timestamp/i.test(h));
    const creditIdx = headers.findIndex((h) => /credit|inflow|paid_in|deposit/i.test(h));
    const amtIdx = creditIdx !== -1 ? creditIdx : headers.findIndex((h) => /amount|txn_amt|val/i.test(h));
    const descIdx = headers.findIndex((h) => /desc|narrat|memo|details|particulars|remarks/i.test(h));
    const catIdx = headers.findIndex((h) => /cat|type/i.test(h));
    const balIdx = headers.findIndex((h) => /bal/i.test(h));

    if (amtIdx === -1) {
      throw new Error('Could not detect valid transaction amount column in CSV statement.');
    }

    const records: TransactionRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(sep).map((v) => v.trim().replace(/^["']|["']$/g, ''));
      if (row.length <= amtIdx) continue;

      const amt = this.cleanCurrency(row[amtIdx]);
      if (amt <= 0 && creditIdx !== -1) continue;

      const dateStr = dateIdx !== -1 && row[dateIdx] ? row[dateIdx] : '2026-09-01';
      const descStr = descIdx !== -1 && row[descIdx] ? row[descIdx] : 'POS Settlement Flow';
      const catStr = catIdx !== -1 && row[catIdx] ? row[catIdx] : 'General';
      const bal = balIdx !== -1 && row[balIdx] ? this.cleanCurrency(row[balIdx]) : undefined;

      records.push({
        date: dateStr,
        amount: amt,
        description: CrediFairComplianceGuard.scrubText(descStr),
        category: catStr,
        balance: bal,
      });
    }

    if (records.length === 0) {
      throw new Error('No valid transaction rows found in CSV.');
    }

    return records;
  }

  static extractFeatures(records: TransactionRecord[], merchantName?: string): MerchantVitals {
    if (records.length === 0) {
      throw new Error('Empty transaction records.');
    }

    let totalInflow = 0;
    const amounts: number[] = [];
    const uniqueDates = new Set<string>();

    for (const r of records) {
      totalInflow += r.amount;
      amounts.push(r.amount);
      if (r.date) uniqueDates.add(r.date.split('T')[0]);
    }

    const meanAmt = amounts.length > 0 ? totalInflow / amounts.length : 0;
    let variance = 0;
    for (const a of amounts) {
      variance += Math.pow(a - meanAmt, 2);
    }
    const stdAmt = amounts.length > 1 ? Math.sqrt(variance / (amounts.length - 1)) : 0;

    let volatility = meanAmt > 0 ? (stdAmt / meanAmt) * 100.0 : 50.0;

    // Forensic Transaction Analysis & Volatility Penalty Adjustment
    const forensics = ForensicRiskGuard.analyzeLedgerForensics(records);
    const adjustedVolatility = Math.max(5.0, Math.min(95.0, volatility + forensics.risk_penalty_points));

    const activeDays = Math.max(1, uniqueDates.size);
    const dailyTx = Math.max(1, Math.round(records.length / activeDays));

    const seed = `${records.length}_${totalInflow}_${activeDays}_${merchantName || ''}`;
    const hash = crypto.createHash('sha256').update(seed).digest('hex').substring(0, 6).toUpperCase();
    const merchantId = `MERCH-${hash}`;

    const loanRequested = Math.round(totalInflow * 0.35);

    return {
      merchant_id: merchantId,
      merchant_name: merchantName || 'Merchant Applicant',
      monthly_inflow: Math.round(totalInflow * 100) / 100,
      monthly_inflow_formatted: `₦${totalInflow.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      volatility: Math.round(adjustedVolatility * 10) / 10,
      daily_tx: dailyTx,
      loan_requested: loanRequested,
      total_records: records.length,
      active_days: activeDays,
      driver: `Extracted from ${records.length} authentic records across ${activeDays} business days.`,
      forensic_audit: forensics,
    };
  }
}
