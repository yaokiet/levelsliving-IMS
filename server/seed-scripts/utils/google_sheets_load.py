import csv
import itertools
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build

def fetch_sheet_to_raw_csv(settings, sheet_name, col_map, temp_dir) -> None:
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

    # Each valueRange corresponds to one column
    cols_data = [vr.get("values", [[]]) for vr in value_ranges]

    # Pad columns to same length
    max_len = max(len(c) for c in cols_data)
    cols_data = [c + [[]] * (max_len - len(c)) for c in cols_data]

    # Transpose back to rows
    rows = [list(itertools.chain.from_iterable(row)) for row in zip(*cols_data)]

    print(f"Fetched {len(rows)} rows x {len(col_map)} cols from Google Sheets")

    headers = list(col_map.keys())

    # Skip the first sheet row (assumed header) when writing RAW
    with raw_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows[1:])

    print(f"Saved {len(rows) - 1} data rows × {len(headers)} cols to {raw_path}")
    
    return raw_path, clean_path, errors_path