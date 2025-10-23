from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database.models.supplier_item import SupplierItem
from database.models.item import Item
from database.models.supplier import Supplier
from database.schemas.supplier_item import SupplierItemCreate, SupplierItemUpdate
from fastapi import HTTPException

from typing import Optional, Dict, Any, List, Iterable
from sqlalchemy import func, or_, Integer, String

from database.services.pagination import (
    clamp_page_size,
    parse_sort,
    build_meta,
)

def get_supplier_item(db: Session, supplier_item_id: int):
    return db.query(SupplierItem).filter(SupplierItem.id == supplier_item_id).first()

def get_supplier_items(
    db: Session,
    page: int = 1,
    size: int = 50,
    *,
    include_total: bool = False,
    max_page_size: int = 200,
) -> Dict[str, Any]:
    """
    Paginated list of SupplierItem rows.

    - Fixed stable order: id ASC, item_id ASC
    - No free-text search / client-driven sort (kept intentionally simple)
    - Uses size+1 trick to compute has_next without COUNT(*)
    - Optional COUNT when include_total=True
    """
    page, size = clamp_page_size(page, size, max_page_size=max_page_size)

    base = db.query(SupplierItem)

    # Optional exact totals
    total = pages = None
    if include_total:
        total = db.query(func.count(SupplierItem.id)).select_from(base.subquery()).scalar() or 0
        pages = max(1, (total + size - 1) // size)

    # Page fetch (size+1 → has_next)
    rows: List[SupplierItem] = (
        base.order_by(SupplierItem.id.asc(), SupplierItem.item_id.asc())
            .limit(size + 1)
            .offset((page - 1) * size)
            .all()
    )
    has_next = len(rows) > size
    data = rows[:size]

    meta = build_meta(
        page=page,
        size=size,
        has_prev=page > 1,
        has_next=has_next,
        sort_tokens=None,     # none for this endpoint
        filters={},           # none for this endpoint
        total=total,
        pages=pages,
    )
    return {"meta": meta, "data": data}

def get_item_by_id(db: Session, item_id: int):
    """Helper to find an Item by its ID."""
    return db.query(Item).filter(Item.id == item_id).first()

def get_supplier_by_id(db: Session, supplier_id: int):
    """Helper to find a Supplier by its ID."""
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

def get_supplier_item_by_pair(db: Session, item_id: int, supplier_id: int):
    """Finds a supplier-item pair. Returns the object if found, otherwise None."""
    return (
        db.query(SupplierItem)
        .filter(SupplierItem.item_id == item_id, SupplierItem.supplier_id == supplier_id)
        .first()
    )

# --- Core Business Logic (Modified) ---
def create_supplier_item(db: Session, supplier_item: SupplierItemCreate):
    existing = get_supplier_item_by_pair(db, supplier_item.item_id, supplier_item.supplier_id)
    if existing:
        return existing

    item = get_item_by_id(db, supplier_item.item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Item with id {supplier_item.item_id} not found")

    supplier = get_supplier_by_id(db, supplier_item.supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail=f"Supplier with id {supplier_item.supplier_id} not found")

    # 3. If parents exist, create the new relationship
    db_supplier_item = SupplierItem(**supplier_item.dict())
    db.add(db_supplier_item)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Re-fetch in case of a race condition
        return get_supplier_item_by_pair(db, supplier_item.item_id, supplier_item.supplier_id)
    
    db.refresh(db_supplier_item)
    return db_supplier_item


def update_supplier_item(db: Session, supplier_item_id: int, supplier_item: SupplierItemUpdate):
    db_supplier_item = get_supplier_item(db, supplier_item_id)
    if db_supplier_item:
        update_data = supplier_item.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_supplier_item, key, value)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            return None
        db.refresh(db_supplier_item)
    return db_supplier_item

def delete_supplier_item(db: Session, supplier_item_id: int):
    db_supplier_item = get_supplier_item(db, supplier_item_id)
    if db_supplier_item:
        db.delete(db_supplier_item)
        db.commit()
    return db_supplier_item