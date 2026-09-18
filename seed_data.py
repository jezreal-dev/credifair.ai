import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

def generate_merchant_csv(merchant_profile: str, rows: int = 150) -> pd.DataFrame:
    np.random.seed(42)
    base_date = datetime(2026, 9, 1)
    dates = [base_date - timedelta(days=i) for i in range(rows)]
    
    if merchant_profile in ["mama_bukky", "bodija_retail"]:
        amounts = np.random.choice([500, 1200, 2500, 4000], size=rows, p=[0.5, 0.3, 0.15, 0.05])
        categories = ["Foodstuff", "Raw Rice", "Vegetables", "Groceries"]
        balances = np.cumsum(amounts * 0.05) + 150000
    elif merchant_profile in ["emeka_electronics", "alaba_merchant"]:
        amounts = np.random.choice([5000, 250000, 12000, 600000], size=rows, p=[0.4, 0.2, 0.3, 0.1])
        categories = ["Phone Accessories", "Stock Purchase", "POS Terminal"]
        balances = np.cumsum(amounts * 0.1) + 800000
    else:
        amounts = np.random.normal(12000, 8000, rows)
        amounts = np.clip(amounts, 1000, 50000)
        categories = ["Textile Retail", "Cash Out", "Personal Withdrawal"]
        balances = 300000 - np.cumsum(amounts * 0.05)
        
    df = pd.DataFrame({
        "date": [d.strftime("%Y-%m-%d") for d in dates],
        "amount": [round(float(a), 2) for a in amounts],
        "category": [np.random.choice(categories) for _ in range(rows)],
        "description": ["Standard merchant POS credit flow" for _ in range(rows)],
        "balance": [round(float(b), 2) for b in balances]
    })
    return df

PRIMARY_ARCHETYPES = {
    "Bodija Retail Archetype": {
        "monthly_inflow": 1850000,
        "volatility": 11.8,
        "daily_tx": 48,
        "loan_requested": 750000,
        "driver": "Consistent daily transaction frequency counteracts localized foodstuff price seasonality.",
        "csv_key": "bodija_retail"
    },
    "Alaba Merchant Archetype": {
        "monthly_inflow": 4200000,
        "volatility": 38.4,
        "daily_tx": 19,
        "loan_requested": 2000000,
        "driver": "High cash inflow volume is offset by sharp bi-weekly inventory restocking swings.",
        "csv_key": "alaba_merchant"
    },
    "Kano Textile Archetype": {
        "monthly_inflow": 650000,
        "volatility": 54.2,
        "daily_tx": 7,
        "loan_requested": 400000,
        "driver": "Declining daily terminal sales volume with increasing personal liquidity withdrawals.",
        "csv_key": "kano_textile"
    }
}

LEGACY_ALIASES = {
    "Mama Bukky Foodstuff (Bodija Market)": {
        **PRIMARY_ARCHETYPES["Bodija Retail Archetype"],
        "csv_key": "mama_bukky"
    },
    "Emeka Electronics (Alaba Int'l)": {
        **PRIMARY_ARCHETYPES["Alaba Merchant Archetype"],
        "csv_key": "emeka_electronics"
    },
    "Baba Musa Textiles (Kano Market)": {
        **PRIMARY_ARCHETYPES["Kano Textile Archetype"],
        "csv_key": "baba_musa"
    }
}

PRELOADED_PROFILES = {
    **PRIMARY_ARCHETYPES,
    **LEGACY_ALIASES
}
