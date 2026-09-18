import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { defaultEngine } from './server/engine';
import { CrediFairComplianceGuard } from './server/compliance';
import { RealDocumentParser } from './server/parser';
import { getActiveLlmProvider, generateDualLanguageExplanation } from './server/explainability';
import { PRELOADED_PROFILES, generateMerchantTransactions } from './src/data/seedData';

const app = express();
const PORT = 3000;
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Health check endpoints (matching FastAPI /api.py)
const handleHealth = (_req: express.Request, res: express.Response) => {
  const { provider, model, isLive } = getActiveLlmProvider();
  res.json({
    status: 'healthy',
    engine_calibrated: defaultEngine.isCalibrated,
    empirical_test_coverage_95: defaultEngine.empiricalTestCoverage,
    llm_connection: {
      is_connected: isLive,
      provider,
      active_model: model,
      status_badge: isLive ? 'LIVE' : 'FALLBACK_OFFLINE',
    },
  });
};

app.get('/api/v1/health', handleHealth);
app.get('/health', handleHealth);

// 2. Preloaded profiles list
app.get('/api/v1/profiles', (_req, res) => {
  res.json({
    status: 'success',
    profiles: PRELOADED_PROFILES,
  });
});

// 3. Assess a specific preloaded profile
app.post('/api/v1/assess-profile', async (req, res) => {
  try {
    const { profile_key, loan_requested } = req.body;
    const profile = PRELOADED_PROFILES[profile_key] || Object.values(PRELOADED_PROFILES)[0];

    const records = generateMerchantTransactions(profile.csv_key, 150);
    const sanitized = CrediFairComplianceGuard.sanitizeRecords(records);

    const loanReq = loan_requested ? Number(loan_requested) : profile.loan_requested;
    const risk = defaultEngine.predictRiskBand(profile.monthly_inflow, profile.volatility, profile.daily_tx);

    const explanation = await generateDualLanguageExplanation(
      profile.name,
      loanReq,
      risk.point_risk_pct,
      risk.lower_bound_pct,
      risk.upper_bound_pct,
      risk.recommendation,
      profile.driver
    );

    res.json({
      status: 'success',
      merchant_vitals: {
        merchant_id: `MERCH-${profile.csv_key.toUpperCase().substring(0, 6)}`,
        merchant_name: profile.name,
        monthly_inflow: profile.monthly_inflow,
        monthly_inflow_formatted: `₦${profile.monthly_inflow.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        volatility: profile.volatility,
        daily_tx: profile.daily_tx,
        loan_requested: loanReq,
        total_records: records.length,
        active_days: 30,
        driver: profile.driver,
      },
      conformal_risk: risk,
      llm_explanation: explanation,
      sample_records: sanitized.slice(0, 10),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to assess profile' });
  }
});

// 4. Analyze uploaded document (CSV / text)
app.post('/api/v1/analyze', upload.single('file'), async (req, res) => {
  try {
    let content = '';

    if (req.file) {
      content = req.file.buffer.toString('utf-8');
    } else if (req.body.csv_content) {
      content = String(req.body.csv_content);
    } else {
      return res.status(400).json({ error: 'No file or CSV content provided.' });
    }

    if (!content.trim()) {
      return res.status(400).json({ error: 'Uploaded file is empty.' });
    }

    const rawRecords = RealDocumentParser.parseCsvContent(content);
    const sanitizedRecords = CrediFairComplianceGuard.sanitizeRecords(rawRecords);
    const vitals = RealDocumentParser.extractFeatures(sanitizedRecords, req.body.merchant_name || 'Applicant MSME');

    const risk = defaultEngine.predictRiskBand(vitals.monthly_inflow, vitals.volatility, vitals.daily_tx);

    const explanation = await generateDualLanguageExplanation(
      vitals.merchant_name || vitals.merchant_id,
      vitals.loan_requested,
      risk.point_risk_pct,
      risk.lower_bound_pct,
      risk.upper_bound_pct,
      risk.recommendation,
      vitals.driver
    );

    res.json({
      status: 'success',
      merchant_vitals: vitals,
      conformal_risk: risk,
      llm_explanation: explanation,
      sample_records: sanitizedRecords.slice(0, 10),
    });
  } catch (err: any) {
    res.status(422).json({ error: err.message || 'Parsing error' });
  }
});

// 5. Loan Officer Sign-Off (NDPA 2023 Section 37)
app.post('/api/v1/sign-off', (req, res) => {
  try {
    const { merchant_id, point_risk, lower_bound, upper_bound, recommendation, officer_id } = req.body;

    if (!merchant_id || point_risk === undefined || lower_bound === undefined || upper_bound === undefined) {
      return res.status(400).json({ error: 'Missing required sign-off parameters.' });
    }

    const manifest = CrediFairComplianceGuard.generateAuditManifest(
      merchant_id,
      Number(point_risk),
      Number(lower_bound),
      Number(upper_bound),
      recommendation || 'PENDING',
      officer_id || 'LO-DEFAULT'
    );

    res.json({
      status: 'SUCCESS',
      sealed_manifest: manifest,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to sign off' });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CrediFair AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
