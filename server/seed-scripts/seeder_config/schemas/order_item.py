from typing import Dict, List

# Target columns (order in COPY)
ORDER_ITEM_TARGET_COLUMNS: List[str] = [
    "order_id",
    "item_id",
    "qty_requested",
    "tag",
    "delivery_date",
    "delivery_time",
    "team_assigned",
    "delivered",
    "custom",
    "remarks",
    "value",
]

# Map sheet headers → DB columns
ORDER_ITEM_SHEET_TO_TARGET: Dict[str, str] = {
    "Order ID": "order_id",
    "Item ID": "item_id",
    "Qty Requested": "qty_requested",
    "Tag": "tag",
    "Delivery Date": "delivery_date",
    "Delivery Time": "delivery_time",
    "Team Assigned": "team_assigned",
    "Delivered": "delivered",
    "Custom": "custom",
    "Remarks": "remarks",
    "Value": "value",
}

# Column letters in your "Order Item" sheet
ORDER_ITEM_COL_MAP: Dict[str, str] = {
    "Order ID": "A",
    "Item ID": "B",
    "Qty Requested": "C",
    "Tag": "D",
    "Delivery Date": "E",
    "Delivery Time": "F",
    "Team Assigned": "G",
    "Delivered": "H",
    "Custom": "I",
    "Remarks": "J",
    "Value": "K",
}
