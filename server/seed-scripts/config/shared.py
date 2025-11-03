import os
from pathlib import Path

# --- Base paths ---
# as this file is in seed-scripts/config, parent.parent = seed-scripts/
BASE_DIR = Path(__file__).resolve().parent.parent
TEMP_DIR = BASE_DIR / "tmp"
TEMP_DIR.mkdir(exist_ok=True)

# --- Google Sheets config ---
CREDENTIALS_PATH = os.getenv(
    "GOOGLE_SHEETS_CREDENTIALS_PATH",
    str(BASE_DIR / "google_credentials.json"),
)

SPREADSHEET_ID = os.getenv(
    "GOOGLE_SHEETS_SPREADSHEET_ID",
    "1ny7RVODq6twymuqxWZDzAV8w0jHJWjQT6TrnJl5VpII",
)

# --- Database config ---
DATABASE_URL = (
    os.getenv("DATABASE_URL")
    or "postgresql://postgres:password@localhost:5432/levelsliving"
)