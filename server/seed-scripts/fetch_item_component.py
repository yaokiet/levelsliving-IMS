#!/usr/bin/env python3
from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL,
)

# 🔁 use item_component schema instead of item
from seeder_config.schemas.item_component import (
    ITEM_COMPONENT_TARGET_COLUMNS,
    ITEM_COMPONENT_SHEET_TO_TARGET,
    ITEM_COMPONENT_COL_MAP,
)

from utils.google_sheets_load import fetch_sheet_to_raw_csv
from utils.db_data_insert import load_clean_into_db

# ----------------- Config & Paths -----------------

SHEET_NAME = "Component Mapping"      # <-- your tab name
TABLE_NAME = "item_component"         # <-- DB table name

# ----------------- Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error(raw_path, clean_path, errors_path) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(raw_path, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(ITEM_COMPONENT_SHEET_TO_TARGET)].rename(
        columns=ITEM_COMPONENT_SHEET_TO_TARGET
    )

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        # parent_id must be an int
        try:
            out["parent_id"] = int(row["parent_id"])
        except (ValueError, TypeError):
            errs.append(f"Invalid parent_id: {row['parent_id']}")

        # child_id must be an int
        try:
            out["child_id"] = int(row["child_id"])
        except (ValueError, TypeError):
            errs.append(f"Invalid child_id: {row['child_id']}")

        # qty_required must be an int
        try:
            out["qty_required"] = int(row["qty_required"])
        except (ValueError, TypeError):
            errs.append(f"Invalid qty_required: {row['qty_required']}")

        if errs:
            errors_rows.append({**row.to_dict(), "errors": "; ".join(errs), "source_index": idx})
        else:
            clean_rows.append([out[c] for c in ITEM_COMPONENT_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=ITEM_COMPONENT_TARGET_COLUMNS)
    errors_df = pd.DataFrame(errors_rows)

    clean_df.to_csv(clean_path, index=False)
    errors_df.to_csv(errors_path, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {clean_path}")
    print(f"Error rows: {len(errors_df)} -> {errors_path}")

    return len(clean_df), len(errors_df)

def main():
    # 1. Fetch raw component mapping data to csv at temporary dir
    RAW_PATH, CLEAN_PATH, ERRORS_PATH = fetch_sheet_to_raw_csv(
        settings,
        SHEET_NAME,
        ITEM_COMPONENT_COL_MAP,
        TEMP_DIR,
    )
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH)

    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db(TABLE_NAME, CLEAN_PATH, ITEM_COMPONENT_TARGET_COLUMNS, DATABASE_URL)
    else:
        print("No clean rows to load into the database; skipping COPY.")

if __name__ == "__main__":
    main()
