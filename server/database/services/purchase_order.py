from __future__ import annotations

from typing import Any, Dict, List, Optional, Iterable
from datetime import date, datetime

from sqlalchemy import func, or_, String, Integer
from sqlalchemy.orm import Session, joinedload, selectinload, load_only

from database.models.purchase_order import PurchaseOrder
from database.models.purchase_order_item import PurchaseOrderItem
from database.models.item import Item
from database.models.supplier import Supplier

from database.schemas.purchase_order_item import PurchaseOrderItemCreate

from database.schemas.purchase_order import (
    PurchaseOrderCreate, 
    PurchaseOrderDetails, 
    PurchaseOrderUpdate, 
    PurchaseOrderItemReadCustom, 
    PurchaseOrderCreateWithItems
)

from database.services.pagination import (
    clamp_page_size,
    parse_sort,
    build_meta,
)

from database.services.purchase_order_item import create_purchase_order_item

def get_purchase_order(db: Session, po_id: int) -> Optional[PurchaseOrder]:
    """Return a single PurchaseOrder ORM object, or None."""
    return (
        db.query(PurchaseOrder)
          .filter(PurchaseOrder.id == po_id)
          .first()
    )

def get_all_purchase_orders(
    db: Session,
    page: int = 1,
    size: int = 50,
    *,
    q: Optional[str] = None,
    search_columns: Optional[List[str]] = None,
    sort: Optional[Iterable[str]] = None,  # e.g. ["order_date:desc","id:desc"]
    include_total: bool = False,
    max_page_size: int = 200,
) -> Dict[str, Any]:
    """
    Return a filtered page of purchase orders, with meta.
    """
    page, size = clamp_page_size(page, size, max_page_size=max_page_size)

    base = db.query(PurchaseOrder)

    # Search filter
    SEARCHABLE_COLUMNS = {"id", "status", "supplier_id", "user_id"}  # add "order_date" if you want date parsing
    if q and search_columns:
        like = f"%{q.strip()}%"
        filters = []
        for col in search_columns:
            if col in SEARCHABLE_COLUMNS and hasattr(PurchaseOrder, col):
                column = getattr(PurchaseOrder, col)
                if hasattr(column, "type"):
                    if isinstance(column.type, String):
                        filters.append(column.ilike(like))
                    elif isinstance(column.type, Integer) and q.isdigit():
                        filters.append(column == int(q))
        if filters:
            base = base.filter(or_(*filters))

    # Sort (whitelisted)
    allowed = {
        "id":          PurchaseOrder.id,
        "order_date":  PurchaseOrder.order_date,
        "status":      PurchaseOrder.status,
        "supplier_id": PurchaseOrder.supplier_id,
        "user_id":     PurchaseOrder.user_id,
    }
    # Remove None values (defensive—mirrors your user impl)
    allowed = {k: v for k, v in allowed.items() if v is not None}
    order_by = parse_sort(sort, allowed, [PurchaseOrder.order_date.desc(), PurchaseOrder.id.desc()])

    # Optional exact totals
    total = pages = None
    if include_total:
        total = db.query(func.count()).select_from(base.subquery()).scalar() or 0
        pages = max(1, (total + size - 1) // size)

    # Fetch page (size+1 → has_next)
    rows: List[PurchaseOrder] = (
        base.order_by(*order_by)
            .limit(size + 1)
            .offset((page - 1) * size)
            .all()
    )
    has_next = len(rows) > size
    pos = rows[:size]

    # Shape payload
    data: List[Dict[str, Any]] = []
    for po in pos:
        data.append({
            "id": po.id,
            "order_date": po.order_date,   # let FastAPI/Pydantic serialize date/datetime
            "status": po.status,
            "supplier_id": po.supplier_id,
            "user_id": po.user_id,
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

# Note: ask front end if there's a need to add supplier_name for the search column
def get_purchase_order_details(db: Session, po_id: int) -> Optional[PurchaseOrderDetails]:
    """
    Return a dict shaped for PurchaseOrderDetails
    """
    po = (
        db.query(PurchaseOrder)
          .options(
              joinedload(PurchaseOrder.supplier),
              selectinload(PurchaseOrder.po_items).joinedload(PurchaseOrderItem.item),
          )
          .filter(PurchaseOrder.id == po_id)
          .first()
    )
    if not po:
        return None

    supplier: Optional[Supplier] = po.supplier

    lines: List[Dict[str, Any]] = []
    for po_item in po.po_items or []:
        item: Optional[Item] = po_item.item 
        lines.append({
            "item_id": po_item.item_id,
            "sku": item.sku if item else "",
            "item_name": item.item_name if item else "",
            "variant": item.variant if item else None,
            "ordered_qty": po_item.qty,                      
            "supplier_item_id": po_item.supplier_item_id,
        })

    return {
        "id": po.id,
        "supplier_id": po.supplier_id,
        "user_id": po.user_id,
        "order_date": po.order_date,
        "status": po.status,
        "supplier_name": getattr(supplier, "name", None),
        "supplier_email": getattr(supplier, "email", None),
        "supplier_phone": getattr(supplier, "contact_number", None),
        "supplier_description": getattr(supplier, "description", None),
        "po_items": lines,
    }

def create_purchase_order(db: Session, payload: PurchaseOrderCreateWithItems):
    with db.begin():  
        po = PurchaseOrder(
            supplier_id=payload.supplier_id,
            user_id=payload.user_id,
            order_date=payload.order_date,
            status=payload.status,
        )
        db.add(po)
        db.flush()  

        for line in payload.po_items:
            create_purchase_order_item(
                db,
                PurchaseOrderItemCreate(
                    purchase_order_id=po.id,
                    item_id=line.item_id,
                    qty=line.qty,
                    supplier_item_id=line.supplier_item_id,
                ),
                autocommit=False,  # don't commit inside
                refresh=False,     # no per-line refresh needed
            )

    return get_purchase_order_details(db, po.id)


def update_purchase_order(db: Session, po_id: int, payload: PurchaseOrderUpdate) -> Optional[PurchaseOrder]:
    """Patch a PO; returns the updated row or None if not found."""
    po = get_purchase_order(db, po_id)
    if not po:
        return None

    data = payload.dict(exclude_unset=True)
    for k, v in data.items():
        setattr(po, k, v)

    db.commit()
    db.refresh(po)
    return po


def delete_purchase_order(db: Session, po_id: int) -> Optional[PurchaseOrder]:
    """Delete a PO; returns the deleted row (detached) or None."""
    po = get_purchase_order(db, po_id)
    if not po:
        return None

    db.delete(po)
    db.commit()
    return po



