from typing import Dict, List

# Columns that will be COPY’d into supplier_item table
SUPPLIER_ITEM_TARGET_COLUMNS: List[str] = [
    "item_id",
    "supplier_id",
    "si_sku",
]

# Map Google Sheet header → DB column
SUPPLIER_ITEM_SHEET_TO_TARGET: Dict[str, str] = {
    "Item ID": "item_id",
    "Supplier ID": "supplier_id",
    "Supplier SKU": "si_sku",
}

# Column letters in your Supplier Item sheet
SUPPLIER_ITEM_COL_MAP: Dict[str, str] = {
    "Item ID": "A",
    "Supplier ID": "B",
    "Supplier SKU": "C",
}
