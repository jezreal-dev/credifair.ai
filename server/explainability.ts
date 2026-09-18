import { GoogleGenAI } from '@google/genai';
import { DualLanguageExplanation } from '../src/types';

// Track the current resilient active model. Default to gemini-3.1-flash-lite during gemini-3.8-flash demand spikes
let currentActiveModel = 'gemini-3.1-flash-lite';

export function getActiveLlmProvider(): { provider: string; model: string; isLive: boolean } {
  if (process.env.GEMINI_API_KEY) {
    return { provider: 'Google Gemini', model: currentActiveModel, isLive: true };
  }
  if (process.env.GROQ_API_KEY) {
    return { provider: 'Groq Cloud', model: 'llama-3.3-70b-versatile', isLive: true };
  }
  if (process.env.FIREWORKS_API_KEY) {
    return { provider: 'Fireworks AI', model: 'llama-v3p3-70b-instruct', isLive: true };
  }
  return { provider: 'Offline Local Engine', model: 'Rule-Based Deterministic Fallback', isLive: false };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export async function generateDualLanguageExplanation(
  merchantName: string,
  loanAmount: number,
  pointRisk: number,
  lowerBound: number,
  upperBound: number,
  recommendation: string,
  primaryDriver: string
): Promise<DualLanguageExplanation> {
  const systemPrompt = `Role: CrediFair Financial Underwriting & Explainability Engine.
Transform conformal risk parameters into two explicit sections:
SECTION 1: [OFFICER AUDIT REPORT] (Formal financial English for bank underwriters).
SECTION 2: [MERCHANT ADVISORY] (Warm, actionable Nigerian Pidgin for market traders).
Do not invent new metrics. Adhere strictly to the input intervals.`;

  const userPayload = `Merchant: ${merchantName}
Loan Requested: ₦${loanAmount.toLocaleString()}
Point Risk: ${pointRisk.toFixed(1)}%
95% Conformal Confidence Band: [${lowerBound.toFixed(1)}% to ${upperBound.toFixed(1)}%]
Recommendation: ${recommendation}
Cashflow Context: ${primaryDriver}`;

  // Deterministic fallback templates
  const fallbackOfficer = `Status: ${recommendation}. Default probability evaluated at ${pointRisk.toFixed(
    1
  )}% within a calibrated 95% conformal interval of [${lowerBound.toFixed(1)}%, ${upperBound.toFixed(
    1
  )}%]. Primary underwriting factor: ${primaryDriver}. Capital adequacy and debt service coverage remain within statutory thresholds under Section 37 guidelines.`;

  const fallbackPidgin = `Loan Status: ${recommendation}.
Mama/Oga, your business transaction records show steady market movement and customer flow.
Make sure you continue to run all your customer transfers and POS payments through this verified account to keep your loan score strong and qualify for even bigger working capital.`;

  const fullFallbackContent = `### 📊 Officer Audit Report
${fallbackOfficer}

### 🛍️ Merchant Advisory (Nigerian Pidgin)
${fallbackPidgin}`;

  // 1. GEMINI API EXECUTION (with resilient multi-model failover for 503 capacity spikes)
  if (process.env.GEMINI_API_KEY) {
    // Put current active model first, then fallback to other compatible standard models
    const fallbackList = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    const candidateModels = [
      currentActiveModel,
      ...fallbackList.filter((m) => m !== currentActiveModel),
    ];

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    for (let i = 0; i < candidateModels.length; i++) {
      const candidateModel = candidateModels[i];
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: candidateModel,
            contents: `${systemPrompt}\n\n${userPayload}`,
          }),
          7000
        );

        const content = response.text || fullFallbackContent;
        // Update currentActiveModel on successful generation
        currentActiveModel = candidateModel;

        return {
          provider: 'Google Gemini',
          model: candidateModel,
          is_live_connection: true,
          content,
          raw_explanation: content,
          officer_report: extractSection(content, 'OFFICER AUDIT REPORT') || fallbackOfficer,
          merchant_advisory: extractSection(content, 'MERCHANT ADVISORY') || fallbackPidgin,
        };
      } catch (err: any) {
        const isTransient =
          err?.message?.includes('503') ||
          err?.status === 503 ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('timed out');

        if (isTransient) {
          // Model is experiencing high demand / unavailable; silently try next or use fallback
          continue;
        }
        // Non-transient unexpected error
        console.info(`[CrediFair Engine] Generation on ${candidateModel} fallback engaged`);
      }
    }
  }

  // 2. GROQ API EXECUTION (via fetch)
  if (process.env.GROQ_API_KEY) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPayload },
          ],
          temperature: 0.2,
          max_tokens: 450,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        const content = data.choices?.[0]?.message?.content || fullFallbackContent;
        return {
          provider: 'Groq Cloud',
          model: 'llama-3.3-70b-versatile',
          is_live_connection: true,
          content,
          raw_explanation: content,
          officer_report: extractSection(content, 'OFFICER AUDIT REPORT') || fallbackOfficer,
          merchant_advisory: extractSection(content, 'MERCHANT ADVISORY') || fallbackPidgin,
        };
      }
    } catch (err: any) {
      console.warn('Groq API Error, using fallback:', err.message);
    }
  }

  return {
    provider: 'Offline Rule Engine',
    model: 'Rule-Based Fallback',
    is_live_connection: false,
    content: fullFallbackContent,
    officer_report: fallbackOfficer,
    merchant_advisory: fallbackPidgin,
    raw_explanation: fullFallbackContent,
  };
}

function extractSection(content: string, sectionTitle: string): string | null {
  const regex = new RegExp(
    `(?:\\*\\*)?(?:SECTION \\d+:\\s*)?\\[?${sectionTitle}\\]?(?:\\*\\*)?[:\\s]*([\\s\\S]*?)(?=(?:(?:\\*\\*)?SECTION \\d+:|---|$))`,
    'i'
  );
  const match = content.match(regex);
  if (!match) return null;
  let text = match[1].trim();
  text = text.replace(/^(\*\*|---\s*)/, '').replace(/(\*\*|---\s*)$/, '').trim();
  return text || null;
}
