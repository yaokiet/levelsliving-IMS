import csv
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build


def fetch_sheet_to_raw_csv(settings, sheet_name, col_map, temp_dir):
    raw_path = temp_dir / f"sheets_{sheet_name}_raw.csv"
    clean_path = temp_dir / f"sheets_{sheet_name}_clean.csv"
    errors_path = temp_dir / f"sheets_{sheet_name}_errors.csv"

    scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    creds = service_account.Credentials.from_service_account_file(
        settings.GOOGLE_SHEETS_CREDENTIALS_PATH, scopes=scopes
    )
    service = build("sheets", "v4", credentials=creds)

    # Fetch only the columns specified in col_map using batchGet (single API call)
    ranges = [f"{sheet_name}!{col}:{col}" for col in col_map.values()]

    resp = service.spreadsheets().values().batchGet(
        spreadsheetId=settings.GOOGLE_SHEETS_SPREADSHEET_ID,
        ranges=ranges,
        majorDimension="ROWS",
    ).execute()

    value_ranges = resp.get("valueRanges", [])

    cols_data = []
    for vr in value_ranges:
        raw_col = vr.get("values", [])
        col_vals = []
        for cell in raw_col:
            # Google sends each cell as a one-element list like ["1"].
            # If it's empty or missing, treat as "".
            if cell and len(cell) > 0:
                col_vals.append(cell[0])
            else:
                col_vals.append("")
        cols_data.append(col_vals)

    # Pad columns to same length with empty strings, not empty lists
    max_len = max(len(c) for c in cols_data) if cols_data else 0
    cols_data = [c + [""] * (max_len - len(c)) for c in cols_data]

    # Transpose columns → rows (each row is now a plain list of strings)
    rows = list(zip(*cols_data))

    print(f"Fetched {len(rows)} rows x {len(col_map)} cols from Google Sheets")

    headers = list(col_map.keys())

    # Skip the first sheet row (assumed header) when writing RAW
    with raw_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows[1:])

    print(f"Saved {len(rows) - 1} data rows × {len(headers)} cols to {raw_path}")

    return raw_path, clean_path, errors_path
