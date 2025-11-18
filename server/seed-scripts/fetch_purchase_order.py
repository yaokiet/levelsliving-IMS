#!/usr/bin/env python3
from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL,
)

from seeder_config.schemas.purchase_order import (
    PURCHASE_ORDER_TARGET_COLUMNS,
    PURCHASE_ORDER_SHEET_TO_TARGET,
    PURCHASE_ORDER_COL_MAP,
)

from utils.google_sheets_load import fetch_sheet_to_raw_csv
from utils.db_data_insert import load_clean_into_db
from utils.validation_functions import (
    coerce_timestamp_not_null,
    check_len_not_null,
)

# ----------------- Config & Paths -----------------

SHEET_NAME = "Purchase Order"   # <-- PO sheet/tab name
TABLE_NAME = "purchase_order"    # <-- DB table name

# ----------------- Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error(raw_path, clean_path, errors_path) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(raw_path, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(PURCHASE_ORDER_SHEET_TO_TARGET)].rename(
        columns=PURCHASE_ORDER_SHEET_TO_TARGET
    )

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        # supplier_id: nullable INT
        raw_supplier = row["supplier_id"]
        if raw_supplier == "":
            out["supplier_id"] = None
        else:
            try:
                out["supplier_id"] = int(raw_supplier)
            except (ValueError, TypeError):
                errs.append(f"Invalid supplier_id: {raw_supplier}")

        # user_id: nullable INT
        raw_user = row["user_id"]
        if raw_user == "":
            out["user_id"] = None
        else:
            try:
                out["user_id"] = int(raw_user)
            except (ValueError, TypeError):
                errs.append(f"Invalid user_id: {raw_user}")

        # order_date: TIMESTAMP NOT NULL
        val, err = coerce_timestamp_not_null(row["order_date"])
        out["order_date"] = val
        if err:
            errs.append(err)

        # status: VARCHAR(20) NOT NULL
        val, err = check_len_not_null(row["status"], "status", 20)
        out["status"] = val if err is None else row["status"]
        if err:
            errs.append(err)

        if errs:
            errors_rows.append({
                **row.to_dict(),
                "errors": "; ".join(errs),
                "source_index": idx,
            })
        else:
            clean_rows.append([out[c] for c in PURCHASE_ORDER_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=PURCHASE_ORDER_TARGET_COLUMNS)
    errors_df = pd.DataFrame(errors_rows)

    clean_df.to_csv(clean_path, index=False)
    errors_df.to_csv(errors_path, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {clean_path}")
    print(f"Error rows: {len(errors_df)} -> {errors_path}")

    return len(clean_df), len(errors_df)

def main():
    # 1. Fetch raw purchase order data to csv at temporary dir
    RAW_PATH, CLEAN_PATH, ERRORS_PATH = fetch_sheet_to_raw_csv(
        settings,
        SHEET_NAME,
        PURCHASE_ORDER_COL_MAP,
        TEMP_DIR,
    )
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH)

    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db(
            TABLE_NAME,
            CLEAN_PATH,
            PURCHASE_ORDER_TARGET_COLUMNS,
            DATABASE_URL,
        )
    else:
        print("No clean rows to load into the database; skipping COPY.")

if __name__ == "__main__":
    main()
