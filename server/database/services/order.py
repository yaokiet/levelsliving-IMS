# services/orders.py
from typing import Optional, Dict, Any, List, Iterable, Union
from datetime import date, datetime
from decimal import Decimal


from sqlalchemy import Integer, String, or_, func
from sqlalchemy.orm import Session, joinedload, selectinload

from database.models.order import Order
from database.models.order_item import OrderItem

from database.services.pagination import (
    clamp_page_size,
    to_datetime,
    parse_sort,
    build_meta,
)

def get_order(db: Session, order_id: int) -> Optional[Order]:
    """Return one Order by id, or None."""
    return (
        db.query(Order)
          .filter(Order.order_id == order_id)
          .first()
    )

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


def get_order_with_items_by_id(db: Session, order_id: int) -> Optional[Dict[str, Any]]:
    """Return one order with merged fields from Item and OrderItem."""
    order = (
        db.query(Order)
          .options(selectinload(Order.order_items).joinedload(OrderItem.item))
          .filter(Order.order_id == order_id)
          .first()
    )
    if not order:
        return None

    sub_rows: List[Dict[str, Any]] = []
    total_qty = 0
    total_value = Decimal("0")

    for oi in order.order_items:
        item = oi.item
        if not item:
            continue

        qty = oi.qty_requested or 0
        unit_price = oi.value or Decimal("0")
        line_total = unit_price * qty

        total_qty += qty
        total_value += line_total

        sub_rows.append({
            # From Item
            "item_id": item.id,
            "sku": item.sku,
            "type": item.type,
            "item_name": item.item_name,
            "variant": item.variant,
            # From OrderItem
            "qty_requested": oi.qty_requested,
            "tag": oi.tag,
            "delivery_date": oi.delivery_date,
            "delivery_time": oi.delivery_time,
            "team_assigned": oi.team_assigned,
            "custom": oi.custom,
            "remarks": oi.remarks,
            "value": unit_price,
        })

    return {
        "id": order.order_id,
        "cust_name": order.name,
        "cust_contact": order.contact,
        "order_date": order.order_date.strftime("%Y-%m-%d"),
        "order_qty": total_qty,
        "status": order.status,
        "total_value": total_value,
        "subRows": sub_rows,
    }

def list_orders_with_items(
    db: Session,
    page: int = 1,
    size: int = 50,
    *,
    q: Optional[str] = None,
    search_columns: Optional[List[str]] = None,
    # status: Optional[str] = None,
    date_from: Optional[Union[str, date, datetime]] = None,
    date_to: Optional[Union[str, date, datetime]] = None,   # exclusive end
    sort: Optional[Iterable[str]] = None,               # e.g. ["order_date:desc","order_id:desc"]
    include_total: bool = False,                        # run COUNT(*) if True
    max_page_size: int = 200,
) -> Dict[str, Any]:
    """Return a filtered page of orders with merged Item and OrderItem fields."""
    page, size = clamp_page_size(page, size, max_page_size=max_page_size)

    base = db.query(Order)
    
    # Search filter
    SEARCHABLE_COLUMNS = {"name", "contact", "status"}
    
    if q and search_columns:
        like = f"%{q.strip()}%"
        filters = []
        for col in search_columns:
            if col in SEARCHABLE_COLUMNS and hasattr(Order, col):
                column = getattr(Order, col)
                if hasattr(column, "type"):
                    if isinstance(column.type, String):
                        filters.append(column.ilike(like))
                    elif isinstance(column.type, Integer) and q.isdigit():
                        filters.append(column == int(q))
        if filters:
            base = base.filter(or_(*filters))

    # Status Filters
    # if status:
    #     base = base.filter(Order.status == status)
    # d_from, d_to = to_datetime(date_from), to_datetime(date_to)
    # if d_from:
    #     base = base.filter(Order.order_date >= d_from)
    # if d_to:
    #     base = base.filter(Order.order_date < d_to)  # exclusive end
    # if q:
    #     like = f"%{q.strip()}%"
    #     base = base.filter(or_(Order.name.ilike(like), Order.contact.ilike(like)))

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
        total = db.query(func.count()).select_from(base.subquery()).scalar()
        pages = (total + size - 1) // size if total else 0

    # Fetch page (size+1 → has_next) with eager loading (no row explosion)
    rows: List[Order] = (
        base.options(selectinload(Order.order_items).joinedload(OrderItem.item))
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
        sub_rows: List[Dict[str, Any]] = []
        total_qty = 0
        total_value = Decimal("0")

        for oi in order.order_items:
            item = oi.item
            if not item:
                continue

            qty = oi.qty_requested or 0
            unit_price = oi.value or Decimal("0")

            total_qty += qty
            total_value += unit_price * qty

            sub_rows.append({
                "item_id": item.id,
                "sku": item.sku,
                "type": item.type,
                "item_name": item.item_name,
                "variant": item.variant,
                "qty_requested": oi.qty_requested,
                "tag": oi.tag,
                "delivery_date": oi.delivery_date,
                "delivery_time": oi.delivery_time,
                "team_assigned": oi.team_assigned,
                "custom": oi.custom,
                "remarks": oi.remarks,
                "value": oi.value,
            })

        data.append({
            "id": order.order_id,
            "cust_name": order.name,
            "cust_contact": order.contact,
            "order_date": order.order_date.strftime("%Y-%m-%d"),
            "order_qty": total_qty,
            "status": order.status,
            "total_value": total_value,
            "subRows": sub_rows,
        })

    meta = build_meta(
        page=page,
        size=size,
        has_prev=page > 1,
        has_next=has_next,
        sort_tokens=sort,
        filters={"date_from": date_from, "date_to": date_to, "q": q, "search_columns": search_columns},
        total=total,
        pages=pages,
    )
    return {"meta": meta, "data": data}



