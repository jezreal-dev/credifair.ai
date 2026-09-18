import { PreloadedProfile, TransactionRecord } from '../types';

export const PRIMARY_ARCHETYPES: Record<string, PreloadedProfile> = {
  "Bodija Retail Archetype": {
    name: "Bodija Retail Archetype",
    monthly_inflow: 1850000,
    volatility: 11.8,
    daily_tx: 48,
    loan_requested: 750000,
    driver: "Consistent daily transaction frequency counteracts localized foodstuff price seasonality.",
    csv_key: "bodija_retail",
  },
  "Alaba Merchant Archetype": {
    name: "Alaba Merchant Archetype",
    monthly_inflow: 4200000,
    volatility: 38.4,
    daily_tx: 19,
    loan_requested: 2000000,
    driver: "High cash inflow volume is offset by sharp bi-weekly inventory restocking swings.",
    csv_key: "alaba_merchant",
  },
  "Kano Textile Archetype": {
    name: "Kano Textile Archetype",
    monthly_inflow: 650000,
    volatility: 54.2,
    daily_tx: 7,
    loan_requested: 400000,
    driver: "Declining daily terminal sales volume with increasing personal liquidity withdrawals.",
    csv_key: "kano_textile",
  },
};

export const ARCHETYPE_PROFILES = PRIMARY_ARCHETYPES;

export const PRELOADED_PROFILES: Record<string, PreloadedProfile> = {
  ...PRIMARY_ARCHETYPES,
  "Mama Bukky Foodstuff (Bodija Market)": {
    ...PRIMARY_ARCHETYPES["Bodija Retail Archetype"],
    csv_key: "mama_bukky",
  },
  "Emeka Electronics (Alaba Int'l)": {
    ...PRIMARY_ARCHETYPES["Alaba Merchant Archetype"],
    csv_key: "emeka_electronics",
  },
  "Baba Musa Textiles (Kano Market)": {
    ...PRIMARY_ARCHETYPES["Kano Textile Archetype"],
    csv_key: "baba_musa",
  },
};

export function generateMerchantTransactions(merchantProfileKey: string, rows: number = 150): TransactionRecord[] {
  const baseDate = new Date(2026, 8, 1); // Sept 1, 2026
  const records: TransactionRecord[] = [];

  let runningBalance = (merchantProfileKey === 'mama_bukky' || merchantProfileKey === 'bodija_retail')
    ? 150000
    : (merchantProfileKey === 'emeka_electronics' || merchantProfileKey === 'alaba_merchant')
      ? 800000
      : 300000;

  for (let i = 0; i < rows; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    let amount = 1000;
    let category = "Retail Flow";

    if (merchantProfileKey === 'mama_bukky' || merchantProfileKey === 'bodija_retail') {
      const p = (i * 17 + 7) % 100;
      if (p < 50) amount = 500;
      else if (p < 80) amount = 1200;
      else if (p < 95) amount = 2500;
      else amount = 4000;

      const cats = ["Foodstuff", "Raw Rice", "Vegetables", "Groceries"];
      category = cats[i % cats.length];
      runningBalance += amount * 0.05;
    } else if (merchantProfileKey === 'emeka_electronics' || merchantProfileKey === 'alaba_merchant') {
      const p = (i * 23 + 11) % 100;
      if (p < 40) amount = 5000;
      else if (p < 60) amount = 250000;
      else if (p < 90) amount = 12000;
      else amount = 600000;

      const cats = ["Phone Accessories", "Stock Purchase", "POS Terminal"];
      category = cats[i % cats.length];
      runningBalance += amount * 0.1;
    } else {
      // kano_textile or baba_musa
      const noise = ((i * 31 + 13) % 40) - 20;
      amount = Math.max(1000, Math.min(50000, 12000 + noise * 400));
      const cats = ["Textile Retail", "Cash Out", "Personal Withdrawal"];
      category = cats[i % cats.length];
      runningBalance -= amount * 0.05;
    }

    records.push({
      date: dateStr,
      amount: Math.round(amount * 100) / 100,
      category,
      description: "Standard merchant POS credit flow",
      balance: Math.round(runningBalance * 100) / 100,
    });
  }

  return records;
}
