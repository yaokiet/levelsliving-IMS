from typing import Dict, List

# Target schema for item_component
ITEM_COMPONENT_TARGET_COLUMNS: List[str] = [
    "parent_id",
    "child_id",
    "qty_required",
]

# Map from sheet headers (col_map keys) to DB target columns
ITEM_COMPONENT_SHEET_TO_TARGET: Dict[str, str] = {
    "Parent ID": "parent_id",
    "Child ID": "child_id",
    "Qty Required": "qty_required",
}

# mapping of column indexes in google sheet
# Adjust letters if your sheet is different
ITEM_COMPONENT_COL_MAP: Dict[str, str] = {
    "Parent ID": "A",
    "Child ID": "B",
    "Qty Required": "C",
}
