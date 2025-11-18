#!/usr/bin/env python3
from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL,
)

from seeder_config.schemas.user import (
    USER_TARGET_COLUMNS,
    USER_SHEET_TO_TARGET,
    USER_COL_MAP,
)

from utils.google_sheets_load import fetch_sheet_to_raw_csv
from utils.db_data_insert import load_clean_into_db
from utils.validation_functions import (
    check_len_not_null,
)

# ----------------- Config & Paths -----------------

# Tab name in Google Sheets containing your users
SHEET_NAME = "Users"          
TABLE_NAME = "user"

# ----------------- Validation → CLEAN / ERRORS CSV -----------------

def validate_raw_to_clean_and_error(raw_path, clean_path, errors_path) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(raw_path, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(USER_SHEET_TO_TARGET)].rename(columns=USER_SHEET_TO_TARGET)

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        # name, role, email, password_hash all required
        val, err = check_len_not_null(row["name"], "name", 64)
        out["name"] = val if err is None else row["name"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["role"], "role", 32)
        out["role"] = val if err is None else row["role"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["email"], "email", 254)
        out["email"] = val if err is None else row["email"]
        if err: errs.append(err)

        val, err = check_len_not_null(row["password_hash"], "password_hash", 255)
        out["password_hash"] = val if err is None else row["password_hash"]
        if err: errs.append(err)

        if errs:
            errors_rows.append({**row.to_dict(), "errors": "; ".join(errs), "source_index": idx})
        else:
            clean_rows.append([out[c] for c in USER_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=USER_TARGET_COLUMNS)
    errors_df = pd.DataFrame(errors_rows)

    clean_df.to_csv(clean_path, index=False)
    errors_df.to_csv(errors_path, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {clean_path}")
    print(f"Error rows: {len(errors_df)} -> {errors_path}")

    return len(clean_df), len(errors_df)

def main():
    # 1. Fetch raw user data to csv at temporary dir
    RAW_PATH, CLEAN_PATH, ERRORS_PATH = fetch_sheet_to_raw_csv(
        settings,
        SHEET_NAME,
        USER_COL_MAP,
        TEMP_DIR,
    )
    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(RAW_PATH, CLEAN_PATH, ERRORS_PATH)

    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db(TABLE_NAME, CLEAN_PATH, USER_TARGET_COLUMNS, DATABASE_URL)
    else:
        print("No clean rows to load into the database; skipping COPY.")

if __name__ == "__main__":
    main()
