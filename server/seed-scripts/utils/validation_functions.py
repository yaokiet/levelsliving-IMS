from typing import Tuple
import re

import pandas as pd

INT64_MAX = 9223372036854775807


def coerce_bigint_nullable(s: str):
    """
    Coerces data field into being in valid big integer range.
    """
    if s == "" or s.lower() in {"na", "null", "none"}:
        return None, None
    if not re.fullmatch(r"[+-]?\d+", s):
        return s, "shopify_order_id: not a valid integer"
    val = int(s)
    if not (-INT64_MAX - 1 <= val <= INT64_MAX):
        return s, "shopify_order_id: out of 64-bit range"
    return val, None


def coerce_timestamp_not_null(s: str):
    """
    Coerces data field into being in valid timestamp format.
    """
    if s == "":
        return None, "order_date: required (NOT NULL)"
    ts = pd.to_datetime(s, errors="coerce")
    if pd.isna(ts):
        return None, f"order_date: invalid datetime '{s}'"
    ts = ts.to_pydatetime().replace(microsecond=0)
    return ts.isoformat(sep=" "), None


def check_len_not_null(s: str, col: str, maxlen: int):
    """
    Checks if a non-nullable data field is valid length.
    """
    if s == "":
        return None, f"{col}: required (NOT NULL)"
    if len(s) > maxlen:
        return s, f"{col}: exceeds max length {maxlen}"
    return s, None


def check_len_nullable(s: str, col: str, maxlen: int):
    """
    Checks if a nullable data field is valid length.
    """
    if s == "":
        return None, None
    if len(s) > maxlen:
        return s, f"{col}: exceeds max length {maxlen}"
    return s, None


def coerce_postal_code(s: str):
    """
    Coerces a data field into being a valid postal code.
    """
    if s == "":
        return None, "postal_code: required (NOT NULL)"
    digits = re.sub(r"\D", "", s)
    if len(digits) < 6 and s.isdigit():
        digits = digits.zfill(6)
    if not re.fullmatch(r"\d{6}", digits):
        return s, "postal_code: must be exactly 6 digits"
    return digits, None
