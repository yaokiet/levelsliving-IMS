from typing import Dict, List

ORDER_TARGET_COLUMNS: List[str] = [
    "shopify_order_id",
    "order_date",
    "status",
    "name",
    "contact",
    "street",
    "unit",
    "postal_code",
]

ORDER_SHEET_TO_TARGET: Dict[str, str] = {
    "Shopify Order Id": "shopify_order_id",
    "Order Date": "order_date",
    "Delivered": "status",
    "Customer Name": "name",
    "Customer Contact": "contact",
    "Customer Street": "street",
    "Customer Unit": "unit",
    "Customer Postal Code": "postal_code",
}

ORDER_COL_MAP: Dict[str, str] = {
    "Shopify Order Id": "A",
    "Order Date": "B",
    "Delivered": "C",
    "Customer Name": "D",
    "Customer Contact": "E",
    "Customer Street": "F",
    "Customer Unit": "G",
    "Customer Postal Code": "H",
}
