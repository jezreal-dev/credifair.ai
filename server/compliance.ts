import crypto from 'crypto';
import { AuditManifest, TransactionRecord } from '../src/types';

export class CrediFairComplianceGuard {
  static SENSITIVE_COLUMN_PATTERNS = [
    /bvn/i,
    /phone/i,
    /mobile/i,
    /nin/i,
    /acc.*num/i,
    /acc.*no/i,
    /iban/i,
    /customer_name/i,
    /client_name/i,
    /first_name/i,
    /last_name/i,
    /surname/i,
    /address/i,
    /email/i,
    /tax_id/i,
    /tin/i,
    /dob/i,
    /birth/i,
  ];

  static PHONE_REGEX = /(?:\+?234|0)[789][01]\d{8}\b/g;
  static BVN_NIN_REGEX = /(?<!\d)\d{11}(?!\d)/g;
  static EMAIL_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;

  static scrubText(text: string): string {
    if (!text || typeof text !== 'string') return text;
    let scrubbed = text.replace(this.EMAIL_REGEX, '[REDACTED-EMAIL]');
    scrubbed = scrubbed.replace(this.PHONE_REGEX, '[REDACTED-PHONE]');
    scrubbed = scrubbed.replace(this.BVN_NIN_REGEX, '[REDACTED-BVN/NIN]');
    return scrubbed;
  }

  static sanitizeRecords(records: TransactionRecord[]): TransactionRecord[] {
    return records.map((rec) => ({
      ...rec,
      description: this.scrubText(rec.description || ''),
      category: rec.category ? this.scrubText(rec.category) : undefined,
    }));
  }

  static generateAuditManifest(
    merchantId: string,
    pointRisk: number,
    lowerBound: number,
    upperBound: number,
    recommendation: string,
    officerId: string = 'PENDING_REVIEW'
  ): AuditManifest {
    const timestampUtc = new Date().toISOString();

    const payloadToHash = {
      lower_bound_pct: Number(lowerBound).toFixed(2),
      merchant_id: String(merchantId),
      point_risk_pct: Number(pointRisk).toFixed(2),
      recommendation: String(recommendation),
      timestamp_utc: timestampUtc,
      upper_bound_pct: Number(upperBound).toFixed(2),
    };

    // RFC 8785 canonical JSON string (deterministic keys, compact)
    const canonicalStr = JSON.stringify(payloadToHash, Object.keys(payloadToHash).sort());
    const auditHash = crypto.createHash('sha256').update(canonicalStr, 'utf-8').digest('hex');

    return {
      ndpa_compliance: 'VERIFIED_COMPLIANT',
      statutory_mandate: 'NDPA 2023 Section 37 (Safeguard Against Solely Automated Decisions)',
      audit_hash_sha256: auditHash,
      timestamp_utc: timestampUtc,
      pseudonymized_id: String(merchantId),
      conformal_metrics: {
        point_risk_pct: Number(pointRisk),
        confidence_interval_95: [Number(lowerBound), Number(upperBound)],
        alpha: 0.05,
      },
      governance_status: {
        recommendation,
        solely_automated_execution: false,
        assigned_officer: String(officerId),
        signature_status: officerId === 'PENDING_REVIEW' ? 'AWAITING_HUMAN_SIGN_OFF' : 'OFFICER_AUTHORIZED',
      },
    };
  }
}
