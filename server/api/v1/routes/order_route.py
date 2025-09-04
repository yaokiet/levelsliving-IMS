# api/v1/orders/routes.py
from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.database import get_db
from database.schemas.pagination import Paginated
from database.schemas.order import (
    OrderCreate,
    OrderUpdate,
    OrderRead,
    OrderWithItems,
    OrderWithOrderItems,
)
from database.services.order import (
    get_order,
    get_order_with_items_by_id,
    get_order_with_order_items_by_id,
    create_order,
    update_order,
    delete_order,
    # alias to avoid shadowing by route handler names
    list_orders_with_items as svc_list_orders_with_items,
    list_orders_with_order_items as svc_list_orders_with_order_items,
)

router = APIRouter(prefix="/order", tags=["order"])


# ---------------------------------------------------------------------------
# Paginated lists (meta + data)
# ---------------------------------------------------------------------------

@router.get("/with-items", response_model=Paginated[OrderWithItems])
def list_orders_with_items(
    page: int = Query(1, ge=1, description="1-based page number"),
    size: int = Query(50, ge=1, le=200, description="Page size (max 200)"),
    status: Optional[str] = Query(None, description="Filter by order status"),
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD or ISO)"),
    date_to: Optional[str] = Query(None, description="End date (exclusive)"),
    sort: Optional[List[str]] = Query(
        None,
        alias="sort",
        description="sort by order_date | order_id -> e.g. sort=order_date:desc&sort=order_id:desc",
    ),
    include_total: bool = Query(
        False, description="If true, also compute COUNT(*) for total/pages"
    ),
    db: Session = Depends(get_db),
):
    """List orders with nested **Items** (offset pagination)."""
    return svc_list_orders_with_items(
        db,
        page=page,
        size=size,
        status=status,
        date_from=date_from,
        date_to=date_to,
        sort=sort,
        include_total=include_total,
    )


@router.get("/with-order-items", response_model=Paginated[OrderWithOrderItems])
def list_orders_with_order_items(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    sort: Optional[List[str]] = Query(None, alias="sort"),
    include_total: bool = False,
    db: Session = Depends(get_db),
):
    """List orders with nested **OrderItems** (offset pagination)."""
    return svc_list_orders_with_order_items(
        db,
        page=page,
        size=size,
        status=status,
        date_from=date_from,
        date_to=date_to,
        sort=sort,
        include_total=include_total,
    )


# ---------------------------------------------------------------------------
# Single-order (detail) endpoints
# ---------------------------------------------------------------------------

@router.get("/{order_id}", response_model=OrderRead)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """Get one order by id."""
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/{order_id}/with-items", response_model=OrderWithItems)
def read_order_with_items(order_id: int, db: Session = Depends(get_db)):
    """Get one order with its **Items**."""
    order_with_items = get_order_with_items_by_id(db, order_id)
    if not order_with_items:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_with_items


@router.get("/{order_id}/with-order-items", response_model=OrderWithOrderItems)
def read_order_with_order_items(order_id: int, db: Session = Depends(get_db)):
    """Get one order with its **OrderItems**."""
    order_with_oi = get_order_with_order_items_by_id(db, order_id)
    if not order_with_oi:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_with_oi


# ---------------------------------------------------------------------------
# Mutations
# ---------------------------------------------------------------------------

@router.post("", response_model=OrderRead)
def create_new_order(payload: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order."""
    return create_order(db, payload)


@router.put("/{order_id}", response_model=OrderRead)
def update_existing_order(order_id: int, payload: OrderUpdate, db: Session = Depends(get_db)):
    """Update an order by id."""
    updated = update_order(db, order_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated


@router.delete("/{order_id}", response_model=OrderRead)
def delete_existing_order(order_id: int, db: Session = Depends(get_db)):
    """Delete an order by id."""
    deleted = delete_order(db, order_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order not found")
    return deleted
