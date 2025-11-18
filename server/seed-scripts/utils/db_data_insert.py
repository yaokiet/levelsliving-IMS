import csv
import psycopg2

def load_clean_into_db(table_name, clean_path, target_columns, database_url) -> int:
    copy_sql = f"""
    COPY "{table_name}" ({", ".join(target_columns)})
    FROM STDIN WITH (FORMAT CSV, HEADER TRUE, NULL '');
    """

    # Sanity check: CSV header matches target_columns
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

    total_rows = sum(1 for _ in clean_path.open("r", encoding="utf-8")) - 1

    conn = psycopg2.connect(database_url)
    conn.autocommit = False

    try:
        with conn.cursor() as cur:
            with clean_path.open("r", encoding="utf-8") as f:
                cur.copy_expert(copy_sql, f)
        conn.commit()
        print(f"Loaded {total_rows} rows from {clean_path} into '{table_name}'.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    return total_rows