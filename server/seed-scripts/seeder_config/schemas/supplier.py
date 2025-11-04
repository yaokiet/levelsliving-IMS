from typing import Dict, List

# Target schema
SUPPLIER_TARGET_COLUMNS: List[str] = [
    # "id",              # SERIAL PRIMARY KEY
    "name",            # VARCHAR(64) NOT NULL
    "description",     # VARCHAR(64)
    "email",           # VARCHAR(254)
    "contact_number",  # VARCHAR(20)
]

# Map from sheet headers (col_map keys) to DB target columns
SUPPLIER_SHEET_TO_TARGET: Dict[str, str] = {
    # "ID": "id",
    "Name": "name",
    "Description": "description",
    "Email": "email",
    "Contact Number": "contact_number",
}

# mapping of column indexes in google sheet
SUPPLIER_COL_MAP: Dict[str, str] = {
    # "ID": "A",
    "Name": "B",
    "Description": "C",
    "Email": "D",
    "Contact Number": "E"
}