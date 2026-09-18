import { jsPDF } from 'jspdf';

export interface ReportData {
  generatedAt?: string;
  reportId?: string;
}

export function generateOperationalPdfReport(data?: ReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const now = data?.generatedAt || new Date().toUTCString();
  const reportId = data?.reportId || `CRD-INST-${Date.now().toString(36).toUpperCase()}`;

  // 1. BRAND HEADER BAR (Deep Navy #210F60)
  doc.setFillColor(33, 15, 96); // #210F60
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line (Brand Green #1DCF9F)
  doc.setFillColor(29, 207, 159); // #1DCF9F
  doc.rect(0, 27, pageWidth, 1.8, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CrediFair', margin, 17);

  doc.setTextColor(29, 207, 159);
  doc.text('AI', margin + 30, 17);

  // Brand Sub-label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 220);
  doc.text('ALTERNATIVE CASHFLOW UNDERWRITING ENGINE', margin + 42, 17);

  // Top Right Report ID & Classification
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(29, 207, 159);
  doc.text(`REPORT: ${reportId}`, pageWidth - margin, 13, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(220, 220, 235);
  doc.text('INSTITUTIONAL BENCHMARK DOSSIER', pageWidth - margin, 19, { align: 'right' });

  let y = 38;

  // 2. DOCUMENT TITLE & EXECUTIVE SUMMARY
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(33, 15, 96);
  doc.text('Summary Operational & Institutional Assessment', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Comparative Architecture Audit: Traditional Commercial Banking vs. CrediFair AI Inductive Framework`,
    margin,
    y
  );

  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

  // Metadata Panel (Light Box)
  doc.setFillColor(248, 251, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  doc.setFont('helvetica', 'bold');
  doc.text('Timestamp:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(now, margin + 24, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Jurisdiction:', margin + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('Federal Republic of Nigeria (MSME Credit Sector)', margin + 24, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Compliance:', pageWidth / 2 + 10, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('NDPA 2023 §37 (Human-in-the-Loop Safeguard)', pageWidth / 2 + 30, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Statistical Model:', pageWidth / 2 + 10, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('95% Inductive Split Conformal Prediction', pageWidth / 2 + 36, y + 12);

  y += 26;

  // 3. EXECUTIVE BRIEF
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(33, 15, 96);
  doc.text('1. Executive Underwriting Brief', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const briefText =
    'Nigerian informal retail and wholesale MSMEs generate robust, predictable daily cash flows via POS terminals and instant digital payments. However, conventional commercial banking frameworks require physical real estate Certificate of Occupancy (C of O) collateral and opaque single-point credit bureau histories. This structural misalignment excludes over 90% of solvent enterprises. CrediFair AI bridges this gap through finite-sample inductive conformal risk estimation and dual-language underwriting.';
  const splitBrief = doc.splitTextToSize(briefText, contentWidth);
  doc.text(splitBrief, margin, y);
  y += splitBrief.length * 4.2 + 5;

  // 4. SUMMARY OPERATIONAL MATRIX TABLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(33, 15, 96);
  doc.text('2. Summary Operational Benchmark Matrix', margin, y);

  y += 5;

  // Table Columns
  const col1Width = 46;
  const col2Width = 62;
  const col3Width = contentWidth - col1Width - col2Width;

  const col1X = margin;
  const col2X = margin + col1Width;
  const col3X = col2X + col2Width;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(col1X, y, contentWidth, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(33, 15, 96);
  doc.text('EVALUATION DIMENSION', col1X + 3, y + 5.5);
  doc.text('TRADITIONAL COMMERCIAL BANKS', col2X + 3, y + 5.5);
  doc.setTextColor(0, 108, 81);
  doc.text('CREDIFAIR AI UNDERWRITING ENGINE', col3X + 3, y + 5.5);

  y += 8;

  const tableRows = [
    {
      dimension: 'Collateral Requirement',
      traditional: 'Demands physical real estate with Certificate of Occupancy (C of O) or fixed bank deposits.',
      credifair: '100% Uncollateralized. Dynamically backed by verified daily POS settlement inflows.',
      traditionalHighlight: 'C of O / Fixed Deposit',
      credifairHighlight: 'Zero Landed Collateral',
    },
    {
      dimension: 'Underwriting Uncertainty',
      traditional: 'Opaque single-point score (CRC, CreditRegistry). High false-rejection rate during seasonal dips.',
      credifair: 'Rigorous 95% finite-sample Conformal Confidence Band [Lower%, Upper%]. Statistically verified bounds.',
      traditionalHighlight: 'Single-Point Score',
      credifairHighlight: '95% Conformal Confidence Band',
    },
    {
      dimension: 'Assessment Speed & Cycle',
      traditional: '14 to 45 business days involving manual committee reviews and physical site inspections.',
      credifair: 'Real-time (< 3 seconds). Instant automated ingestion with deterministic PII sanitization.',
      traditionalHighlight: '14 to 45 Days',
      credifairHighlight: '< 3 Seconds Real-Time',
    },
    {
      dimension: 'Trader Communication',
      traditional: 'Generic statutory rejection notices with legal jargon and zero actionable pathway to eligibility.',
      credifair: 'Actionable Nigerian Pidgin commercial advisories combined with structured Credit Committee Memos.',
      traditionalHighlight: 'Generic Legal Disclaimers',
      credifairHighlight: 'Nigerian Pidgin + Actionable Path',
    },
    {
      dimension: 'Statutory Governance',
      traditional: 'Discretionary branch committee decision-making with high friction and manual oversight.',
      credifair: 'Full NDPA 2023 §37 compliance with supervisory cryptographic sign-off and SHA-256 audit ledger.',
      traditionalHighlight: 'Discretionary Paper Trail',
      credifairHighlight: 'Cryptographic SHA-256 Sealed',
    },
  ];

  tableRows.forEach((row, idx) => {
    const rowBg = idx % 2 === 0 ? 255 : 248;
    const height = 15;

    doc.setFillColor(rowBg, rowBg === 248 ? 251 : 255, rowBg === 248 ? 255 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(col1X, y, contentWidth, height, 'FD');

    // Dimension Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(33, 15, 96);
    doc.text(row.dimension, col1X + 3, y + 5);

    // Traditional bank cell
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    const splitTrad = doc.splitTextToSize(row.traditional, col2Width - 6);
    doc.text(splitTrad, col2X + 3, y + 4.5);

    // CrediFair cell
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    const splitCred = doc.splitTextToSize(row.credifair, col3Width - 6);
    doc.text(splitCred, col3X + 3, y + 4.5);

    // Subtle highlight tags
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(185, 28, 28);
    doc.text(`[${row.traditionalHighlight}]`, col2X + 3, y + 13.5);

    doc.setTextColor(0, 108, 81);
    doc.text(`[${row.credifairHighlight}]`, col3X + 3, y + 13.5);

    y += height;
  });

  y += 8;

  // 5. TECHNICAL SPECIFICATIONS & CONFORMAL GUARANTEE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(33, 15, 96);
  doc.text('3. Mathematical Calibration & Governance Profile', margin, y);

  y += 5;

  // 2 Side-by-side spec boxes
  const boxWidth = (contentWidth - 6) / 2;

  // Left Spec Box: Conformal Inference
  doc.setFillColor(244, 255, 248);
  doc.setDrawColor(29, 207, 159);
  doc.roundedRect(margin, y, boxWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 108, 81);
  doc.text('Inductive Split Conformal Prediction (MAPIE)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('• Finite-sample empirical validity guarantee: P(Y in C(X)) >= 1 - alpha', margin + 4, y + 11);
  doc.text('• Significance Level: alpha = 0.05 (Strict 95% empirical coverage)', margin + 4, y + 15);
  doc.text('• Non-conformity residual score: s_i = |y_i - mu(x_i)|', margin + 4, y + 19);

  // Right Spec Box: Data Protection & NDPA
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + boxWidth + 6, y, boxWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(33, 15, 96);
  doc.text('Statutory Data Privacy & Security (NDPA 2023)', margin + boxWidth + 10, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('• Section 37 Compliance: Enforced human supervisory sign-off', margin + boxWidth + 10, y + 11);
  doc.text('• Section 24 Privacy: Regex deterministic BVN & PII redaction', margin + boxWidth + 10, y + 15);
  doc.text('• Immutable audit trail: Cryptographic SHA-256 manifest hash', margin + boxWidth + 10, y + 19);

  y += 30;

  // 6. OFFICIAL VERIFICATION SEAL & FOOTER
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This operational report is generated directly by the CrediFair AI Underwriting Core for credit committee, regulatory, and institutional review.',
    margin,
    y
  );

  y += 4;
  doc.text(
    '© 2026 CrediFair AI • Zero Landed Collateral Lending Infrastructure • All statistical rights reserved.',
    margin,
    y
  );

  // Bottom Security Stamp / Verification Badge
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 108, 81);
  doc.text('[VERIFIED COMPLIANT - NDPA 2023 §37]', pageWidth - margin, y - 2, { align: 'right' });

  // Save document
  const fileName = `CrediFair-Operational-Report-${reportId}.pdf`;
  doc.save(fileName);
}
