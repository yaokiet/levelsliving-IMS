#!/usr/bin/env python3
from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL
)

from seeder_config.schemas.item import (
    ITEM_TARGET_COLUMNS,
    ITEM_SHEET_TO_TARGET,
    ITEM_COL_MAP
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

SHEET_NAME = "Inventory"
TABLE_NAME = "item"

# ----------------- Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error(raw_path, clean_path, errors_path) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(raw_path, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(ITEM_SHEET_TO_TARGET)].rename(columns=ITEM_SHEET_TO_TARGET)

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        # sku, type, item_name required
        val, err = check_len_not_null(row["sku"], "sku", 64)
        out["sku"] = val if err is None else row["sku"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["type"], "type", 64)
        out["type"] = val if err is None else row["type"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["item_name"], "item_name", 128)
        out["item_name"] = val if err is None else row["item_name"]
        if err: errs.append(err)

        # variant can be nullable / empty
        val, err = check_len_nullable(row["variant"], "variant", 128)
        out["variant"] = val if err is None else row["variant"]
        if err: errs.append(err)

        # qty and threshold_qty must be integers
        try:
            out["qty"] = int(row["qty"]) if row["qty"] != "" else 0
        except ValueError:
            errs.append(f"Invalid qty: {row['qty']}")

        try:
            out["threshold_qty"] = int(row["threshold_qty"]) if row["threshold_qty"] != "" else 0
        except ValueError:
            errs.append(f"Invalid threshold_qty: {row['threshold_qty']}")

        if errs:
            errors_rows.append({**row.to_dict(), "errors": "; ".join(errs), "source_index": idx})
        else:
            clean_rows.append([out[c] for c in ITEM_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=ITEM_TARGET_COLUMNS)
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
        ITEM_COL_MAP, 
        TEMP_DIR
        )
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH)    
    
    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db(TABLE_NAME, CLEAN_PATH, ITEM_TARGET_COLUMNS, DATABASE_URL)
    else:
        print("No clean rows to load into the database; skipping COPY.")

if __name__ == "__main__":
    main()
