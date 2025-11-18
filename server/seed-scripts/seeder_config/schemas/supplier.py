from typing import Dict, List

# Target schema (columns to COPY into supplier table)
SUPPLIER_TARGET_COLUMNS: List[str] = [
    "name",            # VARCHAR(64) NOT NULL
    "description",     # VARCHAR(64) NULL
    "email",           # VARCHAR(254) NULL
    "contact_number",  # VARCHAR(20) NULL
]

# Map from sheet headers (col_map keys) to DB target columns
SUPPLIER_SHEET_TO_TARGET: Dict[str, str] = {
    "Name": "name",
    "Description": "description",
    "Email": "email",
    "Contact Number": "contact_number",
}

SUPPLIER_COL_MAP: Dict[str, str] = {
    "Name": "B",
    "Description": "C",
    "Email": "D",
    "Contact Number": "E",
}
