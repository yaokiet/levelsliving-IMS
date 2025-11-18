from typing import Dict, List

# Target schema for the "user" table
USER_TARGET_COLUMNS: List[str] = [
    "name",          # VARCHAR(...) NOT NULL
    "role",          # VARCHAR(...) NOT NULL
    "email",         # VARCHAR(...) NOT NULL / UNIQUE
    "password_hash", # VARCHAR(...) NOT NULL
]

# Map from sheet headers (col_map keys) to DB target columns
USER_SHEET_TO_TARGET: Dict[str, str] = {
    "Name": "name",
    "Role": "role",
    "Email": "email",
    "Password Hash": "password_hash",
}

# mapping of column indexes in Google Sheet (adjust letters if needed)
USER_COL_MAP: Dict[str, str] = {
    "Name": "A",
    "Role": "B",
    "Email": "C",
    "Password Hash": "D",
}
