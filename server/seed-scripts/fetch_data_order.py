#!/usr/bin/env python3
import csv
import itertools
from typing import List, Dict, Tuple

import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
import psycopg2

from config.shared import (
    CREDENTIALS_PATH,
    SPREADSHEET_ID,
    DATABASE_URL,
    TEMP_DIR
)

from config.schemas.order import (
    ORDER_TARGET_COLUMNS,
    ORDER_SHEET_TO_TARGET,
    ORDER_COL_MAP
)

from utils.validation_functions import (
    coerce_bigint_nullable, 
    coerce_timestamp_not_null,
    check_len_not_null,
    check_len_nullable,
    coerce_postal_code
)

# # ----------------- Config & Paths -----------------

SHEET_NAME = "Orders"
TABLE_NAME = "order"

RAW_PATH = TEMP_DIR / f"sheets_{TABLE_NAME}_raw.csv"
CLEAN_PATH = TEMP_DIR / f"sheets_{TABLE_NAME}_clean.csv"
ERRORS_PATH = TEMP_DIR / f"sheets_{TABLE_NAME}_errors.csv"

# ----------------- Step 1: Fetch sheet → RAW CSV -----------------

def fetch_sheet_to_raw_csv() -> None:
    scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_PATH, scopes=scopes
    )
    service = build("sheets", "v4", credentials=creds)

    # Fetch only the columns specified in col_map using batchGet (single API call)
    ranges = [f"{SHEET_NAME}!{col}:{col}" for col in ORDER_COL_MAP.values()]

    resp = service.spreadsheets().values().batchGet(
        spreadsheetId=SPREADSHEET_ID,
        ranges=ranges,
        majorDimension="ROWS",
    ).execute()

    value_ranges = resp.get("valueRanges", [])

    # Each valueRange corresponds to one column
    cols_data = [vr.get("values", [[]]) for vr in value_ranges]

    # Pad columns to same length
    max_len = max(len(c) for c in cols_data)
    cols_data = [c + [[]] * (max_len - len(c)) for c in cols_data]

    # Transpose back to rows
    rows = [list(itertools.chain.from_iterable(row)) for row in zip(*cols_data)]

    print(f"Fetched {len(rows)} rows x {len(ORDER_COL_MAP)} cols from Google Sheets")

    headers = list(ORDER_COL_MAP.keys())

    # Skip the first sheet row (assumed header) when writing RAW
    with RAW_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows[1:])

    print(f"Saved {len(rows) - 1} data rows × {len(headers)} cols to {RAW_PATH}")


# ----------------- Step 2: Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error() -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(RAW_PATH, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(ORDER_SHEET_TO_TARGET)].rename(columns=ORDER_SHEET_TO_TARGET)

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []
    seen_keys = set()

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        val, err = coerce_bigint_nullable(row["shopify_order_id"])
        out["shopify_order_id"] = val
        if err: errs.append(err)

        val, err = coerce_timestamp_not_null(row["order_date"])
        out["order_date"] = val
        if err: errs.append(err)

        val, err = check_len_not_null(row["status"], "status", 32)
        out["status"] = val if err is None else row["status"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["name"], "name", 64)
        out["name"] = val if err is None else row["name"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["contact"], "contact", 32)
        out["contact"] = val if err is None else row["contact"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["street"], "street", 254)
        out["street"] = val if err is None else row["street"]
        if err: errs.append(err)

        val, err = check_len_nullable(row["unit"], "unit", 32)
        out["unit"] = val if err is None else row["unit"]
        if err: errs.append(err)

        val, err = coerce_postal_code(row["postal_code"])
        out["postal_code"] = val if err is None else row["postal_code"]
        if err: errs.append(err)

        # Drop duplicates on (shopify_order_id, order_date) silently (not errors)
        if not errs and out["shopify_order_id"] is not None and out["order_date"] is not None:
            key = (out["shopify_order_id"], out["order_date"])
            if key in seen_keys:
                # duplicate -> skip this row entirely (no error, no clean record)
                continue
            else:
                seen_keys.add(key)

        if errs:
            errors_rows.append({**row.to_dict(), "errors": "; ".join(errs), "source_index": idx})
        else:
            clean_rows.append([out[c] for c in ORDER_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=ORDER_TARGET_COLUMNS)
    errors_df = pd.DataFrame(errors_rows)

    clean_df.to_csv(CLEAN_PATH, index=False)
    errors_df.to_csv(ERRORS_PATH, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {CLEAN_PATH}")
    print(f"Error rows: {len(errors_df)} -> {ERRORS_PATH}")

    return len(clean_df), len(errors_df)


# ----------------- Step 3: Load CLEAN CSV → Postgres -----------------

def load_clean_into_db() -> int:
    copy_sql = f"""
    COPY "{TABLE_NAME}" ({", ".join(ORDER_TARGET_COLUMNS)})
    FROM STDIN WITH (FORMAT CSV, HEADER TRUE, NULL '');
    """

    # Sanity check: CSV header matches ORDER_TARGET_COLUMNS
    with CLEAN_PATH.open("r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        if header != ORDER_TARGET_COLUMNS:
            raise ValueError(
                "CSV header mismatch.\n"
                f"Expected: {ORDER_TARGET_COLUMNS}\n"
                f"Found:    {header}\n"
                "Make sure you wrote sheets_clean.csv with exactly these columns in this order."
            )

    total_rows = sum(1 for _ in CLEAN_PATH.open("r", encoding="utf-8")) - 1

    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False

    try:
        with conn.cursor() as cur:
            with CLEAN_PATH.open("r", encoding="utf-8") as f:
                cur.copy_expert(copy_sql, f)
        conn.commit()
        print(f"Loaded {total_rows} rows from {CLEAN_PATH} into '{TABLE_NAME}'.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    return total_rows


def main():
    # 1. Fetch raw order data to csv
    fetch_sheet_to_raw_csv()
    
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error()
    
    
    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db()
    else:
        print("No clean rows to load into the database; skipping COPY.")


if __name__ == "__main__":
    main()
