from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL,
)

# 🔁 use supplier_item schema instead of item_component
from seeder_config.schemas.supplier_item import (
    SUPPLIER_ITEM_TARGET_COLUMNS,
    SUPPLIER_ITEM_SHEET_TO_TARGET,
    SUPPLIER_ITEM_COL_MAP,
)

from utils.google_sheets_load import fetch_sheet_to_raw_csv
from utils.db_data_insert import load_clean_into_db
from utils.validation_functions import (
    check_len_nullable,
)

# ----------------- Config & Paths -----------------

SHEET_NAME = "Supplier Items"      # <-- your tab name in Google Sheets
TABLE_NAME = "supplier_item"       # <-- DB table name

# ----------------- Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error(raw_path, clean_path, errors_path) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(raw_path, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(SUPPLIER_ITEM_SHEET_TO_TARGET)].rename(
        columns=SUPPLIER_ITEM_SHEET_TO_TARGET
    )

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        # item_id must be an int (NOT NULL)
        try:
            out["item_id"] = int(row["item_id"])
        except (ValueError, TypeError):
            errs.append(f"Invalid item_id: {row['item_id']}")

        # supplier_id must be an int (NOT NULL)
        try:
            out["supplier_id"] = int(row["supplier_id"])
        except (ValueError, TypeError):
            errs.append(f"Invalid supplier_id: {row['supplier_id']}")

        # si_sku: VARCHAR(32), nullable
        val, err = check_len_nullable(row["si_sku"], "si_sku", 32)
        out["si_sku"] = val if err is None else row["si_sku"]
        if err:
            errs.append(err)

        if errs:
            errors_rows.append({
                **row.to_dict(),
                "errors": "; ".join(errs),
                "source_index": idx,
            })
        else:
            clean_rows.append([out[c] for c in SUPPLIER_ITEM_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=SUPPLIER_ITEM_TARGET_COLUMNS)
    errors_df = pd.DataFrame(errors_rows)

    clean_df.to_csv(clean_path, index=False)
    errors_df.to_csv(errors_path, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {clean_path}")
    print(f"Error rows: {len(errors_df)} -> {errors_path}")

    return len(clean_df), len(errors_df)

def main():
    # 1. Fetch raw supplier item data to csv at temporary dir
    RAW_PATH, CLEAN_PATH, ERRORS_PATH = fetch_sheet_to_raw_csv(
        settings,
        SHEET_NAME,
        SUPPLIER_ITEM_COL_MAP,
        TEMP_DIR,
    )
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH)

    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db(
            TABLE_NAME,
            CLEAN_PATH,
            SUPPLIER_ITEM_TARGET_COLUMNS,
            DATABASE_URL,
        )
    else:
        print("No clean rows to load into the database; skipping COPY.")

if __name__ == "__main__":
    main()
