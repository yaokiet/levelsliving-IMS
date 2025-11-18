#!/usr/bin/env python3
from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL
)
from seeder_config.schemas.supplier import (
    SUPPLIER_TARGET_COLUMNS,
    SUPPLIER_SHEET_TO_TARGET,
    SUPPLIER_COL_MAP
)

from utils.google_sheets_load import fetch_sheet_to_raw_csv
from utils.db_data_insert import load_clean_into_db
from utils.validation_functions import (
    check_len_not_null,
    check_len_nullable
)

# # ----------------- Config & Paths -----------------

SHEET_NAME = "Suppliers"
TABLE_NAME = "supplier"

# ----------------- Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(RAW_PATH, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(SUPPLIER_SHEET_TO_TARGET)].rename(columns=SUPPLIER_SHEET_TO_TARGET)

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        # name: VARCHAR(64) NOT NULL
        val, err = check_len_not_null(row["name"], "name", 64)
        out["name"] = val if err is None else row["name"]
        if err: errs.append(err)

        # description: VARCHAR(64) NULL
        val, err = check_len_nullable(row.get("description", ""), "description", 64)
        out["description"] = val if err is None else row.get("description", "")
        if err: errs.append(err)

        # email: VARCHAR(254) NULL
        val, err = check_len_nullable(row.get("email", ""), "email", 254)
        out["email"] = val if err is None else row.get("email", "")
        if err: errs.append(err)

        # contact_number: VARCHAR(20) NULL
        val, err = check_len_nullable(row.get("contact_number", ""), "contact_number", 20)
        out["contact_number"] = val if err is None else row.get("contact_number", "")
        if err: errs.append(err)

        if errs:
            errors_rows.append({**row.to_dict(), "errors": "; ".join(errs), "source_index": idx})
        else:
            clean_rows.append([out[c] for c in SUPPLIER_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=SUPPLIER_TARGET_COLUMNS)
    errors_df = pd.DataFrame(errors_rows)

    clean_df.to_csv(CLEAN_PATH, index=False)
    errors_df.to_csv(ERRORS_PATH, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {CLEAN_PATH}")
    print(f"Error rows: {len(errors_df)} -> {ERRORS_PATH}")

    return len(clean_df), len(errors_df)


def main():
    # 1. Fetch raw order data to csv at temporary dir
    RAW_PATH, CLEAN_PATH, ERRORS_PATH = fetch_sheet_to_raw_csv(
        settings, 
        SHEET_NAME, 
        SUPPLIER_COL_MAP, 
        TEMP_DIR
        )
    
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH)
    
    # 3. Load cleaned data into pgsql container
    if clean_count > 0:
        load_clean_into_db(TABLE_NAME, CLEAN_PATH, SUPPLIER_TARGET_COLUMNS, DATABASE_URL)
    else:
        print("No clean rows to load into the database; skipping COPY.")


if __name__ == "__main__":
    main()
