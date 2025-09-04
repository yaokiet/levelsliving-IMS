# services/orders.py
from typing import Optional, Dict, Any, List, Iterable
from datetime import date, datetime

from sqlalchemy import or_, func
from sqlalchemy.orm import Session, joinedload, selectinload

from database.models.order import Order
from database.models.order_item import OrderItem

from database.services.pagination import (
    clamp_page_size,
    to_datetime,
    parse_sort,
    build_meta,
)

# -----------------------------------------------------------------------------
# Single-order helpers
# -----------------------------------------------------------------------------

def get_order(db: Session, order_id: int) -> Optional[Order]:
    """Return one Order by id, or None."""
    return (
        db.query(Order)
          .filter(Order.order_id == order_id)
          .first()
    )


def get_order_with_items_by_id(db: Session, order_id: int) -> Optional[Dict[str, Any]]:
    """Return one order with its Items (eager-loaded) as a dict, or None."""
    order = (
        db.query(Order)
          .options(joinedload(Order.order_items).joinedload(OrderItem.item))  # 1 query
          .filter(Order.order_id == order_id)
          .first()
    )
    if not order:
        return None

    orderItems = order.order_items
    itemList = [orderItem.item for orderItem in orderItems if orderItem.item is not None]
    totalQty = sum(orderItem.qty_requested for orderItem in orderItems)

    return {
        "id": order.order_id,
        "cust_name": order.name,
        "cust_contact": order.contact,
        "order_date": order.order_date.strftime("%Y-%m-%d"),
        "order_qty": totalQty,
        "status": order.status,
        "subRows": itemList,
    }


def get_order_with_order_items_by_id(db: Session, order_id: int) -> Optional[Dict[str, Any]]:
    """Return one order with its OrderItems (eager-loaded) as a dict, or None."""
    order = (
        db.query(Order)
          .options(joinedload(Order.order_items))  # 1 query
          .filter(Order.order_id == order_id)
          .first()
    )
    if not order:
        return None

    orderItems = order.order_items
    totalQty = sum(orderItem.qty_requested for orderItem in orderItems)

    return {
        "id": order.order_id,
        "cust_name": order.name,
        "cust_contact": order.contact,
        "order_date": order.order_date.strftime("%Y-%m-%d"),
        "order_qty": totalQty,
        "status": order.status,
        "subRows": orderItems,
    }

# -----------------------------------------------------------------------------
# Paginated lists with meta (filters + stable sort, avoids N+1)
# -----------------------------------------------------------------------------

def list_orders_with_items(
    db: Session,
    page: int = 1,
    size: int = 50,
    *,
    status: Optional[str] = None,
    date_from: Optional[str | date | datetime] = None,
    date_to: Optional[str | date | datetime] = None,   # exclusive end
    q: Optional[str] = None,                            # search name/contact
    sort: Optional[Iterable[str]] = None,               # e.g. ["order_date:desc","order_id:desc"]
    include_total: bool = False,                        # run COUNT(*) if True
    max_page_size: int = 200,
) -> Dict[str, Any]:
    """Return a filtered page of orders with their Items plus pagination meta.

    - Filters are applied before pagination.
    - Default sort is stable: order_date DESC, order_id DESC.
    - Uses size+1 fetch to compute has_next without COUNT(*).
    - If include_total=True, an exact count and pages are added to meta.
    """
    page, size = clamp_page_size(page, size, max_page_size=max_page_size)

    base = db.query(Order)

    # Filters
    if status:
        base = base.filter(Order.status == status)
    d_from, d_to = to_datetime(date_from), to_datetime(date_to)
    if d_from:
        base = base.filter(Order.order_date >= d_from)
    if d_to:
        base = base.filter(Order.order_date < d_to)  # exclusive end
    if q:
        like = f"%{q.strip()}%"
        base = base.filter(or_(Order.name.ilike(like), Order.contact.ilike(like)))

    # Sort (whitelisted)
    allowed = {
        "order_date": Order.order_date,
        "order_id":   Order.order_id,
        "status":     Order.status,
    }
    order_by = parse_sort(sort, allowed, [Order.order_date.desc(), Order.order_id.desc()])

    # Optional exact totals
    total = pages = None
    if include_total:
        total = db.query(func.count(Order.order_id)).select_from(base.subquery()).scalar()
        pages = (total + size - 1) // size if total else 0

    # Fetch page (size+1 → has_next)
    rows: List[Order] = (
        base.options(selectinload(Order.order_items).selectinload(OrderItem.item))  # batched children + items
            .order_by(*order_by)
            .limit(size + 1)
            .offset((page - 1) * size)
            .all()
    )
    has_next = len(rows) > size
    orders = rows[:size]

    # Shape payload
    data: List[Dict[str, Any]] = []
    for order in orders:
        orderItems = order.order_items
        itemList = [orderItem.item for orderItem in orderItems if orderItem.item is not None]
        totalQty = sum(orderItem.qty_requested for orderItem in orderItems)
        data.append({
            "id": order.order_id,
            "cust_name": order.name,
            "cust_contact": order.contact,
            "order_date": order.order_date.strftime("%Y-%m-%d"),
            "order_qty": totalQty,
            "status": order.status,
            "subRows": itemList,
        })

    meta = build_meta(
        page=page,
        size=size,
        has_prev=page > 1,
        has_next=has_next,
        sort_tokens=sort,
        filters={"status": status, "date_from": date_from, "date_to": date_to, "q": q},
        total=total,
        pages=pages,
    )
    return {"meta": meta, "data": data}


def list_orders_with_order_items(
    db: Session,
    page: int = 1,
    size: int = 50,
    *,
    status: Optional[str] = None,
    date_from: Optional[str | date | datetime] = None,
    date_to: Optional[str | date | datetime] = None,
    q: Optional[str] = None,
    sort: Optional[Iterable[str]] = None,
    include_total: bool = False,
    max_page_size: int = 200,
) -> Dict[str, Any]:
    """Return a filtered page of orders with their OrderItems plus pagination meta.

    Same behavior as the Items variant, but `subRows` contains OrderItem objects.
    """
    page, size = clamp_page_size(page, size, max_page_size=max_page_size)

    base = db.query(Order)

    # Filters
    if status:
        base = base.filter(Order.status == status)
    d_from, d_to = to_datetime(date_from), to_datetime(date_to)
    if d_from:
        base = base.filter(Order.order_date >= d_from)
    if d_to:
        base = base.filter(Order.order_date < d_to)
    if q:
        like = f"%{q.strip()}%"
        base = base.filter(or_(Order.name.ilike(like), Order.contact.ilike(like)))

    # Sort (whitelisted)
    allowed = {
        "order_date": Order.order_date,
        "order_id":   Order.order_id,
        "status":     Order.status,
    }
    order_by = parse_sort(sort, allowed, [Order.order_date.desc(), Order.order_id.desc()])

    # Optional exact totals
    total = pages = None
    if include_total:
        total = db.query(func.count(Order.order_id)).select_from(base.subquery()).scalar()
        pages = (total + size - 1) // size if total else 0

    # Fetch page (size+1 → has_next)
    rows: List[Order] = (
        base.options(selectinload(Order.order_items))  # batched children
            .order_by(*order_by)
            .limit(size + 1)
            .offset((page - 1) * size)
            .all()
    )
    has_next = len(rows) > size
    orders = rows[:size]

    # Shape payload
    data: List[Dict[str, Any]] = []
    for order in orders:
        orderItems = order.order_items
        totalQty = sum(orderItem.qty_requested for orderItem in orderItems)
        data.append({
            "id": order.order_id,
            "cust_name": order.name,
            "cust_contact": order.contact,
            "order_date": order.order_date.strftime("%Y-%m-%d"),
            "order_qty": totalQty,
            "status": order.status,
            "subRows": orderItems,
        })

    meta = build_meta(
        page=page,
        size=size,
        has_prev=page > 1,
        has_next=has_next,
        sort_tokens=sort,
        filters={"status": status, "date_from": date_from, "date_to": date_to, "q": q},
        total=total,
        pages=pages,
    )
    return {"meta": meta, "data": data}

# -----------------------------------------------------------------------------
# Mutations
# -----------------------------------------------------------------------------

def create_order(db: Session, payload) -> Order:
    """Create and return a new Order."""
    db_order = Order(**payload.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def update_order(db: Session, order_id: int, payload) -> Optional[Order]:
    """Update an Order by id; return the updated row or None."""
    db_order = (
        db.query(Order)
          .filter(Order.order_id == order_id)
          .first()
    )
    if not db_order:
        return None

    updateData = payload.dict(exclude_unset=True)
    for key, value in updateData.items():
        setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int) -> Optional[Order]:
    """Delete an Order by id; return the deleted row (detached) or None."""
    db_order = (
        db.query(Order)
          .filter(Order.order_id == order_id)
          .first()
    )
    if not db_order:
        return None

    db.delete(db_order)
    db.commit()
    return db_order
