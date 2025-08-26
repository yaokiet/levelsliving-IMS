from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.order import OrderCreate, OrderUpdate, OrderRead
from database.schemas.order_item import OrderItemRead 
from database.services.order import (
    get_order, get_all_orders, create_order, update_order, delete_order
)

router = APIRouter(prefix="/order", tags=["order"])

@router.get("/", response_model=list[OrderRead])
def read_orders(db: Session = Depends(get_db)):
    return get_all_orders(db)

@router.get("/{order_id}", response_model=OrderRead)
def read_order(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/{order_id}/items", response_model=list[OrderItemRead])
def read_order_items(order_id: int, db: Session = Depends(get_db)):
    # First check if order exists
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Get all items for this order
    return get_order_items_by_order_id(db, order_id)

@router.post("/", response_model=OrderRead)
def create_new_order(payload: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, payload)

@router.put("/{order_id}", response_model=OrderRead)
def update_existing_order(order_id: int, payload: OrderUpdate, db: Session = Depends(get_db)):
    updated = update_order(db, order_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated

@router.delete("/{order_id}", response_model=OrderRead)
def delete_existing_order(order_id: int, db: Session = Depends(get_db)):
    deleted = delete_order(db, order_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order not found")
    return deleted