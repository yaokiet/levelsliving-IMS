from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.order import OrderCreate, OrderUpdate, OrderRead, OrderWithItems
from database.services.order import (
    get_order, get_all_orders, get_orders_with_items, get_order_with_items_by_id, create_order, update_order, delete_order
)

router = APIRouter(prefix="/order", tags=["order"])

@router.get("/", response_model=list[OrderRead])
def read_orders(db: Session = Depends(get_db)):
    """
    Retrieve all customer orders.
    """
    return get_all_orders(db)

@router.get("/with-items", response_model=list[OrderWithItems])
def read_orders_with_items(db: Session = Depends(get_db)):
    """
    Retrieve all customer orders with their nested items.
    Returns orders in a nested format with subRows containing items.
    Note: The items returned contain the infor of the items under the corresponding Order, but not the actual order_items.
    """
    return get_orders_with_items(db)

@router.get("/{order_id}/with-items", response_model=OrderWithItems)
def read_order_with_items(order_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific customer order with its nested order items by order ID.
    Returns the order in a nested format with subRows containing items.
    """
    order_with_items = get_order_with_items_by_id(db, order_id)
    if not order_with_items:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_with_items

@router.get("/{order_id}", response_model=OrderRead)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a customer order by its ID.
    """
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=OrderRead)
def create_new_order(payload: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new customer order.
    """
    return create_order(db, payload)

@router.put("/{order_id}", response_model=OrderRead)
def update_existing_order(order_id: int, payload: OrderUpdate, db: Session = Depends(get_db)):
    """
    Update an existing customer order by ID.
    """
    updated = update_order(db, order_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated

@router.delete("/{order_id}", response_model=OrderRead)
def delete_existing_order(order_id: int, db: Session = Depends(get_db)):
    """
    Delete a customer order by ID.
    """
    deleted = delete_order(db, order_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order not found")
    return deleted