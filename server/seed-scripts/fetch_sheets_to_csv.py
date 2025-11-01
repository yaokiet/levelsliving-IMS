import os
import csv
import re
from datetime import datetime

from google.oauth2 import service_account
from googleapiclient.discovery import build

CREDENTIALS_PATH = os.getenv(
    "GOOGLE_SHEETS_CREDENTIALS_PATH",
    "/Users/joelsng/Documents/GitHub/levelsliving-IMS/server/google_credentials.json",
)
SPREADSHEET_ID = os.getenv(
    "GOOGLE_SHEETS_SPREADSHEET_ID",
    "1ny7RVODq6twymuqxWZDzAV8w0jHJWjQT6TrnJl5VpII",
)
SHEET_NAME = "Orders"

# --- DB SCHEMA TARGET (minus order_id SERIAL) ---
TARGET_COLUMNS = [
    "shopify_order_id",  # BIGINT (nullable in DB)
    "order_date",        # TIMESTAMP NOT NULL
    "status",            # VARCHAR(32) NOT NULL
    "name",              # VARCHAR(64) NOT NULL
    "contact",           # VARCHAR(32) NOT NULL
    "street",            # VARCHAR(254) NOT NULL
    "unit",              # VARCHAR(32) NULL
    "postal_code",       # CHAR(6) NOT NULL
]

# --- SHEET -> RAW COLUMN MAP (kept as you had it) ---
col_map = {
    "Shopify Order Id": "AB",
    "Order Date": "B",
    "Delivered": "R",
    "Customer Name": "C",
    "Customer Contact": "D",
    "Customer Street": "E",
    "Customer Unit": "F",
    "Customer Postal Code": "G",
    "SKU": "H",
    "Item": "I",
    "Variant": "J",
    "Quantity": "K",
    "Tag": "L",
    "Delivery Date": "N",
    "Delivery Time": "O",
    "Team": "Q",
    "Delivered": "R",
    "Custom": "W",
    "Remarks": "T",
    "Value": "Y",
}

# ------------- helpers: cleaning/validation -------------

_DIGITS_PLUS = re.compile(r"[^0-9+]")

def _norm_contact(s: str) -> str:
    """Keep digits and '+', collapse whitespace, cap to 32."""
    s = (s or "").strip()
    s = _DIGITS_PLUS.sub("", s)
    if not s:
        s = "NA"
    return s[:32]

def _truncate(s: str | None, n: int) -> str | None:
    if s is None:
        return None
    return s[:n]

def _status_from_delivered(s: str) -> str:
    val = (s or "").strip().lower()
    if val in {"yes", "y", "true", "1", "delivered"}:
        return "DELIVERED"
    return "PENDING"

_DATE_FORMATS = [
    "%Y-%m-%d",
    "%Y-%m-%d %H:%M",
    "%Y-%m-%d %H:%M:%S",
    "%d/%m/%Y",
    "%d/%m/%Y %H:%M",
    "%d/%m/%Y %H:%M:%S",
    "%m/%d/%Y",               # just in case
    "%m/%d/%Y %H:%M",
    "%m/%d/%Y %H:%M:%S",
]

def _parse_order_ts(s: str) -> str | None:
    """
    Return 'YYYY-MM-DD HH:MM:SS' or None if not parseable.
    If the sheet gives a date-only, normalize to midnight.
    """
    s = (s or "").strip()
    if not s:
        return None
    for fmt in _DATE_FORMATS:
        try:
            dt = datetime.strptime(s, fmt)
            return dt.strftime("%Y-%m-%d %H:%M:%S")
        except ValueError:
            continue
    # Last-ditch: if it's already ISO-like and includes 'T' (Google sometimes does)
    try:
        # handle things like '2025-10-01T09:00:00Z' or '...+08:00'
        # We avoid external deps; strip timezone if present
        if "T" in s:
            s2 = s.replace("T", " ").replace("Z", "")
            # remove timezone offset if any
            if "+" in s2:
                s2 = s2.split("+", 1)[0]
            elif "-" in s2[10:]:  # timezone like -08:00 after date part
                s2 = s2[:19]
            dt = datetime.strptime(s2[:19], "%Y-%m-%d %H:%M:%S")
            return dt.strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        pass
    return None

def _to_bigint_or_none(s: str):
    s = (s or "").strip()
    if not s:
        return None
    # Some Sheets export floats like "1234567890.0"
    if s.endswith(".0"):
        s = s[:-2]
    try:
        # Allow large ints safely by returning as string; we will write CSV as string
        int(s)
        return s
    except ValueError:
        return None

def _norm_postal(s: str) -> str:
    """Take first 6 characters; fallback '000000'. (You can switch to first 6 digits if you prefer.)"""
    s = (s or "").strip()
    if not s:
        return "000000"
    return s[:6].ljust(6, "0")  # ensure 6 chars

def _row_is_effectively_empty(row: list[str]) -> bool:
    # Treat a row with all empty cells as empty
    return all((c is None or str(c).strip() == "") for c in row)

# -------------------- fetch --------------------

creds = service_account.Credentials.from_service_account_file(
    CREDENTIALS_PATH, scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
)
service = build("sheets", "v4", credentials=creds)

ranges = [f"{SHEET_NAME}!{col}1:{col}" for col in col_map.values()]
resp = service.spreadsheets().values().batchGet(
    spreadsheetId=SPREADSHEET_ID,
    ranges=ranges,
    valueRenderOption="UNFORMATTED_VALUE",
    dateTimeRenderOption="FORMATTED_STRING",
).execute()

value_ranges = resp.get("valueRanges", [])
columns = list(col_map.keys())
cols_data = [vr.get("values", []) for vr in value_ranges]
max_len = max((len(c) for c in cols_data), default=0)

# Normalize columns to equal length
for i, c in enumerate(cols_data):
    if len(c) < max_len:
        cols_data[i] = c + [[]] * (max_len - len(c))

# Build raw rows, skipping the sheet's top header row
raw_rows: list[list[str]] = []
for row_idx in range(1, max_len):
    row = []
    for col in cols_data:
        cell = col[row_idx][0] if (row_idx < len(col) and col[row_idx]) else ""
        row.append(cell)
    if not _row_is_effectively_empty(row):
        raw_rows.append(row)

# -------------------- outputs --------------------

out_dir = os.path.join(os.path.dirname(__file__), "tmp")
os.makedirs(out_dir, exist_ok=True)

raw_path = os.path.join(out_dir, "sheets_orders.csv")
clean_path = os.path.join(out_dir, "sheets_orders_clean.csv")
rejects_path = os.path.join(out_dir, "sheets_orders_rejects.csv")

# 1) Write raw (unchanged) for debugging
with open(raw_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(columns)
    w.writerows(raw_rows)

# 2) Build cleaned rows that match your DB schema
clean_rows: list[list[str | None]] = []
rejects: list[list[str]] = []  # cols: reason + subset of source fields for quick triage

# Build a dict accessor for each row using original headers
for row in raw_rows:
    src = dict(zip(columns, row))

    shopify_id = _to_bigint_or_none(src.get("Shopify Order Id", ""))
    order_date = _parse_order_ts(str(src.get("Order Date", "")))
    status = _status_from_delivered(str(src.get("Delivered", "")))
    name = _truncate((src.get("Customer Name") or "Unknown").strip(), 64)
    contact = _norm_contact(str(src.get("Customer Contact", "")))
    street = _truncate((src.get("Customer Street") or "NA").strip(), 254)
    unit_raw = src.get("Customer Unit")
    unit = _truncate((unit_raw.strip() if unit_raw else None), 32)
    postal_code = _norm_postal(str(src.get("Customer Postal Code", "")))

    # required fields per DB NOT NULL constraints
    if not order_date:
        rejects.append([
            "Missing/invalid order_date",
            str(src.get("Shopify Order Id", "")),
            str(src.get("Order Date", "")),
            str(src.get("Customer Name", "")),
        ])
        continue

    if not status:
        rejects.append(["Missing status", str(src.get("Shopify Order Id", ""))])
        continue

    if not name:
        rejects.append(["Missing name", str(src.get("Shopify Order Id", ""))])
        continue

    if not contact:
        rejects.append(["Missing contact", str(src.get("Shopify Order Id", ""))])
        continue

    if not street:
        rejects.append(["Missing street", str(src.get("Shopify Order Id", ""))])
        continue

    if not postal_code or len(postal_code) != 6:
        rejects.append(["Invalid postal_code", str(src.get("Shopify Order Id", "")), postal_code])
        continue

    clean_rows.append([
        shopify_id,         # BIGINT (nullable)
        order_date,         # TIMESTAMP
        status,             # VARCHAR(32)
        name,               # VARCHAR(64)
        contact,            # VARCHAR(32)
        street,             # VARCHAR(254)
        unit,               # VARCHAR(32) nullable
        postal_code,        # CHAR(6)
    ])

# 3) Write clean CSV
with open(clean_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(TARGET_COLUMNS)
    for r in clean_rows:
        w.writerow(r)

# 4) Write rejects (optional but very useful)
with open(rejects_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["reason", "shopify_order_id", "order_date_raw", "customer_name"])
    for r in rejects:
        w.writerow(r)

print(f"Wrote RAW CSV:    {raw_path}  (rows: {len(raw_rows)})")
print(f"Wrote CLEAN CSV:  {clean_path} (rows: {len(clean_rows)})")
print(f"Wrote REJECTS:    {rejects_path} (rows: {len(rejects)})")
