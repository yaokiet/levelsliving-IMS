from sqlalchemy.orm import Session
from database.models.item import Item
from database.models.item_component import ItemComponent
from database.models.order_item import OrderItem
from database.schemas.item import ItemCreate, ItemUpdate, ItemComponentRead, ItemWithComponents
from collections import defaultdict

from typing import Any, Dict, List, Optional, Iterable
from sqlalchemy import or_, func, String, Integer

from database.services.pagination import (
    clamp_page_size,
    parse_sort,
    build_meta,
)

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def get_item_by_order_id(db: Session, order_id: int):
    # Step 1: Get all item_ids for the given order_id
    item_ids = db.query(OrderItem.item_id).filter(OrderItem.order_id == order_id).all()
    item_ids = [row[0] for row in item_ids]  # flatten list of tuples

    if not item_ids:
        return []

    # Step 2: Get all items with those item_ids
    items = db.query(Item).filter(Item.id.in_(item_ids)).all()
    return items

def get_all_items(db: Session):
    return db.query(Item).all()

def get_all_items_pagniated(
    db: Session,
    page: int = 1,
    size: int = 50,
    *,
    q: Optional[str] = None,
    search_columns: Optional[List[str]] = None,
    sort: Optional[Iterable[str]] = None,  # e.g. ["item_name:asc","id:desc"]
    include_total: bool = False,
    max_page_size: int = 200,
) -> Dict[str, Any]:
    """
    Paginated list of Items with free-text search + whitelisted sort.
    Returns {"meta": {...}, "data": [ {item fields...} ]}.
    """
    page, size = clamp_page_size(page, size, max_page_size=max_page_size)

    base = db.query(Item)

    # Free-text search across chosen columns (OR semantics)
    SEARCHABLE_COLUMNS = {"id", "sku", "type", "item_name", "variant"}
    if q and search_columns:
        like = f"%{q.strip()}%"
        filters = []
        # accept comma-separated or repeated params
        if isinstance(search_columns, str):
            search_columns = [c.strip() for c in search_columns.split(",") if c.strip()]
        for col in search_columns:
            if col in SEARCHABLE_COLUMNS and hasattr(Item, col):
                column = getattr(Item, col)
                # string vs integer handling
                if hasattr(column, "type"):
                    if isinstance(column.type, String):
                        filters.append(column.ilike(like))
                    elif isinstance(column.type, Integer) and q.isdigit():
                        filters.append(column == int(q))
        if filters:
            base = base.filter(or_(*filters))

    # Sort (whitelisted only)
    allowed = {
        "id":            Item.id,
        "sku":           Item.sku,
        "type":          Item.type,
        "item_name":     Item.item_name,
        "variant":       Item.variant,
        "qty":           Item.qty,
        "threshold_qty": Item.threshold_qty,
    }
    order_by = parse_sort(sort, allowed, [Item.item_name.asc(), Item.id.asc()])

    # Optional exact totals
    total = pages = None
    if include_total:
        total = db.query(func.count()).select_from(base.subquery()).scalar() or 0
        pages = max(1, (total + size - 1) // size)

    # Fetch page (size+1 → has_next)
    rows: List[Item] = (
        base.order_by(*order_by)
            .limit(size + 1)
            .offset((page - 1) * size)
            .all()
    )
    has_next = len(rows) > size
    items = rows[:size]

    # Shape payload (flat—no relationships here)
    data: List[Dict[str, Any]] = []
    for it in items:
        data.append({
            "id": it.id,
            "sku": it.sku,
            "type": it.type,
            "item_name": it.item_name,
            "variant": it.variant,
            "qty": it.qty,
            "threshold_qty": it.threshold_qty,
        })

    meta = build_meta(
        page=page,
        size=size,
        has_prev=page > 1,
        has_next=has_next,
        sort_tokens=sort,
        filters={"q": q, "search_columns": search_columns},
        total=total,
        pages=pages,
    )
    return {"meta": meta, "data": data}

def create_item(db: Session, item: ItemCreate):
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item: ItemUpdate):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        for key, value in item.dict().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

# item detail APIs

def get_all_item_components(db: Session, item_id: int):
    return db.query(ItemComponent).filter(ItemComponent.parent_id == item_id).all()

def get_item_with_components(db: Session, item_id: int):
    """
    Retrieves an item and attaches the full details of each of its components
    using an efficient JOIN query.
    """
    # 1. Retrieve the parent item, same as before.
    item = get_item(db, item_id)
    if not item:
        return None

    # 2. Perform a single JOIN query to get all child items and their quantities.
    component_results = (
        db.query(Item, ItemComponent.qty_required)
        .join(ItemComponent, Item.id == ItemComponent.child_id)
        .filter(ItemComponent.parent_id == item_id)
        .all()
    )

    # 3. The query returns a list of tuples, like: [(<Item_A>, 5), (<Item_B>, 2)]
    detailed_components = []
    for component_item, qty in component_results:
        component_item.qty_required = qty
        detailed_components.append(component_item)

    # 4. Attach the fully detailed list of components to the parent item.
    item.components = detailed_components
    return item

def get_lowest_children(db: Session, item_id: int):
    """
    Recursively finds all lowest-level components for a given parent item
    and calculates the total quantity required for each.
    """
    parent_item = get_item(db, item_id)
    if not parent_item:
        return None  # Indicates the parent item was not found

    # This dictionary will aggregate quantities for each unique lowest-level child
    lowest_children_map = defaultdict(int)

    def find_leaves(current_item_id: int, cumulative_qty: int):
        # Query for direct children of the current item
        components = db.query(ItemComponent).filter(ItemComponent.parent_id == current_item_id).all()

        # Base Case: If there are no children, this is a leaf node.
        if not components:
            lowest_children_map[current_item_id] += cumulative_qty
            return

        # Recursive Step: If there are children, traverse deeper.
        for component in components:
            find_leaves(component.child_id, cumulative_qty * component.qty_required)

    # Start the recursion
    find_leaves(item_id, 1)

    # If the map is empty, the initial item itself is the lowest level
    if not lowest_children_map:
        return [{
            "id" : parent_item.id,
            "sku": parent_item.sku,
            "item_name": parent_item.item_name,
            "total_qty_required": 1
        }]

    # Fetch details for all unique lowest-level items in a single query
    child_ids = lowest_children_map.keys()
    child_items = db.query(Item).filter(Item.id.in_(child_ids)).all()

    # Map item IDs to their details for easy lookup
    child_details_map = {item.id: item for item in child_items}

    # Format the final result
    result = []
    for child_id, total_qty in lowest_children_map.items():
        item_details = child_details_map.get(child_id)
        if item_details:
            result.append({
                "id" : item_details.id,
                "sku": item_details.sku,
                "item_name": item_details.item_name,
                "total_qty_required": total_qty
            })

    return result
