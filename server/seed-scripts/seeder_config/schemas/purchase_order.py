from typing import Dict, List

# Columns being inserted into DB
PURCHASE_ORDER_TARGET_COLUMNS: List[str] = [
    "supplier_id",
    "user_id",
    "order_date",
    "status",
]

# Map from Google Sheet headers → DB column names
PURCHASE_ORDER_SHEET_TO_TARGET: Dict[str, str] = {
    "Supplier ID": "supplier_id",
    "User ID": "user_id",
    "Order Date": "order_date",
    "Status": "status",
}

# Column letters in your Google Sheet
PURCHASE_ORDER_COL_MAP: Dict[str, str] = {
    "Supplier ID": "A",
    "User ID": "B",
    "Order Date": "C",
    "Status": "D",
}
