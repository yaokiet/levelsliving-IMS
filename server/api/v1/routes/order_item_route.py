from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.order_item import OrderItemCreate, OrderItemUpdate, OrderItemRead
from database.services.order_item import (
    get_order_item, get_all_order_items, get_order_items_by_order_id,
    create_order_item, update_order_item, delete_order_item
)

router = APIRouter(prefix="/order-item", tags=["order-item"])

@router.get("/", response_model=list[OrderItemRead])
def read_order_items(db: Session = Depends(get_db)):
    return get_all_order_items(db)

@router.get("/order/{order_id}", response_model=list[OrderItemRead])
def read_order_items_by_order(order_id: int, db: Session = Depends(get_db)):
    return get_order_items_by_order_id(db, order_id)

@router.get("/{order_id}/{item_id}", response_model=OrderItemRead)
def read_order_item(order_id: int, item_id: int, db: Session = Depends(get_db)):
    oi = get_order_item(db, order_id, item_id)
    if not oi:
        raise HTTPException(status_code=404, detail="Order item not found")
    return oi

@router.post("/", response_model=OrderItemRead)
def create_new_order_item(payload: OrderItemCreate, db: Session = Depends(get_db)):
    return create_order_item(db, payload)

@router.put("/{order_id}/{item_id}", response_model=OrderItemRead)
def update_existing_order_item(order_id: int, item_id: int, payload: OrderItemUpdate, db: Session = Depends(get_db)):
    updated = update_order_item(db, order_id, item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Order item not found")
    return updated

@router.delete("/{order_id}/{item_id}", response_model=OrderItemRead)
def delete_existing_order_item(order_id: int, item_id: int, db: Session = Depends(get_db)):
    deleted = delete_order_item(db, order_id, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order item not found")
    return deleted