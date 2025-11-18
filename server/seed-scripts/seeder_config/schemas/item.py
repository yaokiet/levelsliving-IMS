from typing import Dict, List

# Target schema
ITEM_TARGET_COLUMNS: List[str] = [
    "sku",
    "type",
    "item_name",
    "variant",
    "qty",
    "threshold_qty",
]

# Map from sheet headers (col_map keys) to DB target columns
ITEM_SHEET_TO_TARGET: Dict[str, str] = {
    "SKU": "sku",
    "Type": "type",
    "Item Name": "item_name",
    "Variant": "variant",
    "Quantity": "qty",
    "Threshold Qty": "threshold_qty",
}

# mapping of column indexes in google sheet
ITEM_COL_MAP: Dict[str, str] = {
    "SKU": "B",
    "Type": "C",
    "Item Name": "D",
    "Variant": "E",
    "Quantity": "F",
    "Threshold Qty": "G",
}