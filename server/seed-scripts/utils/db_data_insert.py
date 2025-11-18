import csv
import psycopg2
from pathlib import Path
from typing import List

def load_clean_into_db(
    table_name: str,
    clean_path: Path,
    target_columns: List[str],
    database_url: str,
    restart_identity: bool = True,
) -> int:
    """
    Fully replace the contents of `table_name` with the rows from `clean_path`.

    Steps:
    - Sanity check CSV header matches `target_columns`
    - TRUNCATE the target table (optionally RESTART IDENTITY)
    - COPY all rows from the CSV into the table

    Returns:
        total_rows (int): number of data rows in the CSV (excluding header)
    """

    # 1) Sanity check: CSV header matches target_columns
    with clean_path.open("r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        if header != target_columns:
            raise ValueError(
                "CSV header mismatch.\n"
                f"Expected: {target_columns}\n"
                f"Found:    {header}\n"
                "Make sure you wrote sheets_clean.csv with exactly these columns in this order."
            )

    # 2) Count rows (excluding header)
    total_rows = sum(1 for _ in clean_path.open("r", encoding="utf-8")) - 1

    conn = psycopg2.connect(database_url)
    conn.autocommit = False

    cols_sql = ", ".join(f'"{c}"' for c in target_columns)

    copy_sql = f"""
    COPY "{table_name}" ({cols_sql})
    FROM STDIN WITH (FORMAT CSV, HEADER TRUE, NULL '');
    """

    try:
        with conn.cursor() as cur:
            # 3) Truncate table first
            if restart_identity:
                cur.execute(f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE;')
            else:
                cur.execute(f'TRUNCATE TABLE "{table_name}";')

            # 4) Load new data
            with clean_path.open("r", encoding="utf-8") as f:
                cur.copy_expert(copy_sql, f)

        conn.commit()
        print(
            f"Fully replaced contents of '{table_name}' "
            f"with {total_rows} rows from {clean_path}."
        )
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    return total_rows
