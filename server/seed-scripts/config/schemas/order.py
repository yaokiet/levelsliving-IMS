from typing import Dict, List

# Target schema
ORDER_TARGET_COLUMNS: List[str] = [
    "shopify_order_id",  # BIGINT (nullable in DB)
    "order_date",        # TIMESTAMP NOT NULL
    "status",            # VARCHAR(32) NOT NULL
    "name",              # VARCHAR(64) NOT NULL
    "contact",           # VARCHAR(32) NOT NULL
    "street",            # VARCHAR(254) NOT NULL
    "unit",              # VARCHAR(32) NULL
    "postal_code",       # CHAR(6) NOT NULL
]

# Map from sheet headers (col_map keys) to DB target columns
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

# mapping of column indexes in google sheet
ORDER_COL_MAP: Dict[str, str] = {
    "Shopify Order Id": "AB",
    "Order Date": "B",
    "Delivered": "R",
    "Customer Name": "C",
    "Customer Contact": "D",
    "Customer Street": "E",
    "Customer Unit": "F",
    "Customer Postal Code": "G",
    "SKU": "H",
    "Item": "I",
    "Variant": "J",
    "Quantity": "K",
    "Tag": "L",
    "Delivery Date": "N",
    "Delivery Time": "O",
    "Team": "Q",
    "Custom": "W",
    "Remarks": "T",
    "Value": "Y",
}