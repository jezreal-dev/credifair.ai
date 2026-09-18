"""
CrediFair AI: Application Security & Input Validation Defense
Enforces CWE-400 resource constraints, CSV Formula Injection mitigations, and LLM input filtering.
"""
from typing import Tuple, Set
import re
import io
import pandas as pd


class CrediFairSecurityGuard:
    MAX_FILE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB ceiling (CWE-400)
    MAX_ROWS_ALLOWED: int = 1500
    REQUIRED_COLUMNS: Set[str] = {"date", "amount", "category", "description", "balance"}

    @classmethod
    def validate_csv_upload(cls, raw_bytes: bytes) -> Tuple[bool, str, pd.DataFrame]:
        """Validates payload size, structure, and neutralizes CSV Formula Injections (CWE-1236)."""
        if len(raw_bytes) > cls.MAX_FILE_SIZE_BYTES:
            return False, "Security Violation: File size exceeds 5MB limit (CWE-400).", pd.DataFrame()

        try:
            df = pd.read_csv(io.BytesIO(raw_bytes), nrows=cls.MAX_ROWS_ALLOWED)
        except Exception:
            return False, "Security Violation: Corrupt or unparseable CSV payload.", pd.DataFrame()

        if len(df) == 0:
            return False, "Security Violation: Empty CSV payload provided.", pd.DataFrame()

        incoming_cols = set(str(col).strip().lower() for col in df.columns)
        if not cls.REQUIRED_COLUMNS.issubset(incoming_cols):
            missing = cls.REQUIRED_COLUMNS - incoming_cols
            return False, f"Schema Error: Missing required columns: {missing}", pd.DataFrame()

        # Neutralize CSV formula execution tokens (=, +, -, @)
        for col in df.select_dtypes(include=["object", "string"]).columns:
            df[col] = df[col].astype(str).apply(
                lambda x: f"'{x}" if x.startswith(("=", "+", "-", "@")) else x
            )

        return True, "AppSec Validation Passed", df

    @staticmethod
    def sanitize_for_llm(untrusted_text: str) -> str:
        """Neutralizes control chars and prompt injection markers before LLM context insertion."""
        if not isinstance(untrusted_text, str):
            return ""

        # Normalize control whitespace
        cleaned = re.sub(r"[\r\n\t]+", " ", untrusted_text)

        # Neutralize system directive delimiters and injection keywords
        injection_pattern = r"(ignore|override|system|instruction|prompt|secret|api_key|assistant:|human:)"
        cleaned = re.sub(injection_pattern, "[FILTERED]", cleaned, flags=re.IGNORECASE)

        return cleaned[:160].strip()
