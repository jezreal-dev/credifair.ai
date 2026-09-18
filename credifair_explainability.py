"""
CrediFair AI: Multi-Provider LLM Explainability Gateway
Auto-detects active LLM provider keys (Groq -> Gemini -> Fireworks -> Offline Fallback)
and delivers structured dual-language credit explanations with live connectivity status.
"""
import os
import re
from typing import Dict, Any, Tuple


def get_active_llm_provider() -> Tuple[str, str, bool]:
    """
    Detects which API key is present and returns (provider_name, model_name, is_connected).
    Priority: Groq -> Gemini -> Fireworks -> Offline Fallback.
    """
    if os.environ.get("GROQ_API_KEY"):
        return "Groq Cloud", "llama-3.3-70b-versatile", True
    elif os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"):
        return "Google Gemini", "gemini-2.5-flash", True
    elif os.environ.get("FIREWORKS_API_KEY"):
        return "Fireworks AI", "accounts/fireworks/models/llama-v3p3-70b-instruct", True
    return "Offline Local Engine", "Rule-Based Deterministic Fallback", False


def generate_dual_language_explanation(
    merchant_name: str,
    loan_amount: int,
    point_risk: float,
    lower_bound: float,
    upper_bound: float,
    recommendation: str,
    primary_driver: str
) -> Dict[str, Any]:
    """
    Dispatches generation to the active LLM provider with graceful fallbacks.
    Returns provider metadata, connectivity status, and formatted content.
    """
    provider, model, is_live = get_active_llm_provider()

    system_prompt = (
        "Role: CrediFair Financial Underwriting & Explainability Engine.\n"
        "Transform conformal risk parameters into two explicit sections:\n"
        "SECTION 1: [OFFICER AUDIT REPORT] (Formal financial English for bank underwriters).\n"
        "SECTION 2: [MERCHANT ADVISORY] (Warm, actionable Nigerian Pidgin for market traders).\n"
        "Do not invent new metrics. Adhere strictly to the input intervals."
    )
    user_payload = (
        f"Merchant: {merchant_name}\n"
        f"Loan Requested: ₦{loan_amount:,}\n"
        f"Point Risk: {point_risk:.1f}%\n"
        f"95% Conformal Confidence Band: [{lower_bound:.1f}% to {upper_bound:.1f}%]\n"
        f"Recommendation: {recommendation}\n"
        f"Cashflow Context: {primary_driver}"
    )

    # 1. GROQ CLOUD EXECUTION
    if provider == "Groq Cloud":
        try:
            from groq import Groq
            client = Groq(api_key=os.environ.get("GROQ_API_KEY"), timeout=8.0)
            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_payload}
                ],
                temperature=0.2,
                max_tokens=450
            )
            content_str = resp.choices[0].message.content or ""
            return {
                "provider": provider,
                "model": model,
                "is_live_connection": True,
                "content": content_str,
                "raw_explanation": content_str
            }
        except Exception as e:
            provider = f"Groq Error ({str(e)[:30]}) -> Fallback"

    # 2. GOOGLE GEMINI EXECUTION
    if provider == "Google Gemini":
        try:
            from google import genai
            api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
            client = genai.Client(api_key=api_key)
            full_prompt = f"{system_prompt}\n\n{user_payload}"
            resp = client.models.generate_content(
                model=model,
                contents=full_prompt
            )
            content_str = resp.text or ""
            return {
                "provider": provider,
                "model": model,
                "is_live_connection": True,
                "content": content_str,
                "raw_explanation": content_str
            }
        except Exception as e:
            provider = f"Gemini Error ({str(e)[:30]}) -> Fallback"

    # 3. FIREWORKS AI (OpenAI-Compatible Client)
    if provider == "Fireworks AI":
        try:
            from openai import OpenAI
            client = OpenAI(
                base_url="https://api.fireworks.ai/inference/v1",
                api_key=os.environ.get("FIREWORKS_API_KEY"),
                timeout=8.0
            )
            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_payload}
                ],
                temperature=0.2,
                max_tokens=450
            )
            content_str = resp.choices[0].message.content or ""
            return {
                "provider": provider,
                "model": model,
                "is_live_connection": True,
                "content": content_str,
                "raw_explanation": content_str
            }
        except Exception as e:
            provider = f"Fireworks Error ({str(e)[:30]}) -> Fallback"

    # 4. DETERMINISTIC OFFLINE FALLBACK
    fallback_officer = (
        f"Status: {recommendation}. Default probability evaluated at {point_risk:.1f}% "
        f"within a calibrated 95% conformal interval of [{lower_bound:.1f}%, {upper_bound:.1f}%]. "
        f"Primary underwriting factor: {primary_driver}."
    )
    fallback_pidgin = (
        f"Loan Status: {recommendation}.\n"
        f"Mama/Oga, your transaction records show steady market movement. "
        f"Make sure you continue to run all your customer payments through this account to keep your loan profile strong."
    )
    full_fallback_content = (
        f"### 📊 Officer Audit Report\n{fallback_officer}\n\n"
        f"### 🛍️ Merchant Advisory (Nigerian Pidgin)\n{fallback_pidgin}"
    )

    return {
        "provider": "Offline Rule Engine",
        "model": "Fallback",
        "is_live_connection": False,
        "content": full_fallback_content,
        "officer_report": fallback_officer,
        "merchant_advisory": fallback_pidgin,
        "raw_explanation": full_fallback_content
    }
