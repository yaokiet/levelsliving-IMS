#!/usr/bin/env python3
from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL
)

from seeder_config.schemas.order import (
    ORDER_TARGET_COLUMNS,
    ORDER_SHEET_TO_TARGET,
    ORDER_COL_MAP
)

from utils.google_sheets_load import fetch_sheet_to_raw_csv
from utils.db_data_insert import load_clean_into_db
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

# ----------------- Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error(raw_path, clean_path, errors_path) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(raw_path, dtype=str).fillna("")
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

    clean_df.to_csv(clean_path, index=False)
    errors_df.to_csv(errors_path, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {clean_path}")
    print(f"Error rows: {len(errors_df)} -> {errors_path}")

    return len(clean_df), len(errors_df)

def main():
    # 1. Fetch raw order data to csv at temporary dir
    RAW_PATH, CLEAN_PATH, ERRORS_PATH = fetch_sheet_to_raw_csv(
        settings, 
        SHEET_NAME, 
        ORDER_COL_MAP, 
        TEMP_DIR
        )
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH)    
    
    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db(TABLE_NAME, CLEAN_PATH, ORDER_TARGET_COLUMNS, DATABASE_URL)
    else:
        print("No clean rows to load into the database; skipping COPY.")

if __name__ == "__main__":
    main()
