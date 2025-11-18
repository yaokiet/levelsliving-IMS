#!/usr/bin/env python3
from typing import List, Dict, Tuple

import pandas as pd
from config import settings

from seeder_config.shared import (
    TEMP_DIR,
    DATABASE_URL,
)

from seeder_config.schemas.order_item import (
    ORDER_ITEM_TARGET_COLUMNS,
    ORDER_ITEM_SHEET_TO_TARGET,
    ORDER_ITEM_COL_MAP,
)

from utils.google_sheets_load import fetch_sheet_to_raw_csv
from utils.db_data_insert import load_clean_into_db
from utils.validation_functions import (
    coerce_bigint_nullable,
    coerce_timestamp_not_null,
    check_len_not_null,
    check_len_nullable,
)

# ----------------- Config & Paths -----------------

SHEET_NAME = "Order Item"
TABLE_NAME = "order_item"

# ----------------- Validation → CLEAN / ERRORS CSV -----------------


def validate_raw_to_clean_and_error(raw_path, clean_path, errors_path) -> Tuple[int, int]:
    # Read RAW as strings
    df = pd.read_csv(raw_path, dtype=str).fillna("")
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # Extract only the columns we need and rename to target column names
    df_t = df[list(ORDER_ITEM_SHEET_TO_TARGET)].rename(columns=ORDER_ITEM_SHEET_TO_TARGET)

    clean_rows: List[List] = []
    errors_rows: List[Dict] = []
    seen_keys = set()

    for idx, row in df_t.iterrows():
        out: Dict[str, object] = {}
        errs: List[str] = []

        # order_id: assume bigint, nullable
        val, err = coerce_bigint_nullable(row["order_id"])
        out["order_id"] = val
        if err:
            errs.append(err)

        # item_id: assume bigint, nullable
        val, err = coerce_bigint_nullable(row["item_id"])
        out["item_id"] = val
        if err:
            errs.append(err)

        # qty_requested: keep as string, require non-empty + length limit; DB will cast
        val, err = check_len_not_null(row["qty_requested"], "qty_requested", 16)
        out["qty_requested"] = val if err is None else row["qty_requested"]
        if err:
            errs.append(err)

        # tag: optional short string
        val, err = check_len_nullable(row["tag"], "tag", 32)
        out["tag"] = val if err is None else row["tag"]
        if err:
            errs.append(err)

        # delivery_date: required, parse as timestamp
        val, err = coerce_timestamp_not_null(row["delivery_date"])
        out["delivery_date"] = val
        if err:
            errs.append(err)

        # delivery_time: optional short string (e.g. "AM slot", "2–4pm")
        val, err = check_len_nullable(row["delivery_time"], "delivery_time", 32)
        out["delivery_time"] = val if err is None else row["delivery_time"]
        if err:
            errs.append(err)

        # team_assigned: optional, moderate length
        val, err = check_len_nullable(row["team_assigned"], "team_assigned", 64)
        out["team_assigned"] = val if err is None else row["team_assigned"]
        if err:
            errs.append(err)

        # delivered: optional flag ("Yes"/"No"/"TRUE"/"FALSE")
        val, err = check_len_nullable(row["delivered"], "delivered", 16)
        out["delivered"] = val if err is None else row["delivered"]
        if err:
            errs.append(err)

        # custom: optional flag
        val, err = check_len_nullable(row["custom"], "custom", 16)
        out["custom"] = val if err is None else row["custom"]
        if err:
            errs.append(err)

        # remarks: optional text
        val, err = check_len_nullable(row["remarks"], "remarks", 254)
        out["remarks"] = val if err is None else row["remarks"]
        if err:
            errs.append(err)

        # value: optional numeric, keep as string and let DB cast
        val, err = check_len_nullable(row["value"], "value", 32)
        out["value"] = val if err is None else row["value"]
        if err:
            errs.append(err)

        # Drop duplicates on (order_id, item_id) silently (not errors)
        if (
            not errs
            and out["order_id"] is not None
            and out["item_id"] is not None
        ):
            key = (out["order_id"], out["item_id"])
            if key in seen_keys:
                # duplicate -> skip this row entirely (no error, no clean record)
                continue
            else:
                seen_keys.add(key)

        if errs:
            errors_rows.append(
                {**row.to_dict(), "errors": "; ".join(errs), "source_index": idx}
            )
        else:
            clean_rows.append([out[c] for c in ORDER_ITEM_TARGET_COLUMNS])

    clean_df = pd.DataFrame(clean_rows, columns=ORDER_ITEM_TARGET_COLUMNS)
    errors_df = pd.DataFrame(errors_rows)

    clean_df.to_csv(clean_path, index=False)
    errors_df.to_csv(errors_path, index=False)

    print(f"Clean rows:  {len(clean_df)} -> {clean_path}")
    print(f"Error rows: {len(errors_df)} -> {errors_path}")

    return len(clean_df), len(errors_df)


def main():
    # 1. Fetch raw "Order Item" data to csv at temporary dir
    RAW_PATH, CLEAN_PATH, ERRORS_PATH = fetch_sheet_to_raw_csv(
        settings,
        SHEET_NAME,
        ORDER_ITEM_COL_MAP,
        TEMP_DIR,
    )

    # 2. Validate and clean data
    clean_count, error_count = validate_raw_to_clean_and_error(
        RAW_PATH, CLEAN_PATH, ERRORS_PATH
    )

    if clean_count > 0:
        # 3. Load cleaned data into pgsql container
        load_clean_into_db(
            TABLE_NAME,
            CLEAN_PATH,
            ORDER_ITEM_TARGET_COLUMNS,
            DATABASE_URL,
        )
    else:
        print("No clean rows to load into the database; skipping COPY.")


if __name__ == "__main__":
    main()
