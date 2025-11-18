import os
from pathlib import Path

# --- Base paths ---
# as this file is in seed-scripts/config, parent.parent = seed-scripts/
BASE_DIR = Path(__file__).resolve().parent.parent
TEMP_DIR = BASE_DIR / "tmp"
TEMP_DIR.mkdir(exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL")