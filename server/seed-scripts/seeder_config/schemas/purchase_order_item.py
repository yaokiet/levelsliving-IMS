from typing import Dict, List

PURCHASE_ORDER_ITEM_TARGET_COLUMNS: List[str] = [
    "purchase_order_id",
    "item_id",
    "qty",
    "supplier_item_id",
]

PURCHASE_ORDER_ITEM_SHEET_TO_TARGET: Dict[str, str] = {
    "Purchase Order ID": "purchase_order_id",
    "Item ID": "item_id",
    "Qty": "qty",
    "Supplier Item ID": "supplier_item_id",
}

# Adjust column letters to match your "Purchase Order Items" sheet
PURCHASE_ORDER_ITEM_COL_MAP: Dict[str, str] = {
    "Purchase Order ID": "A",
    "Item ID": "B",
    "Qty": "C",
    "Supplier Item ID": "D",
}
