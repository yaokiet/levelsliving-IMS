from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.purchase_order_item import PurchaseOrderItemCreate, PurchaseOrderItemUpdate, PurchaseOrderItemRead
from database.services.purchase_order_item import (
    get_purchase_order_item, get_all_purchase_order_items, create_purchase_order_item, update_purchase_order_item, delete_purchase_order_item
)

router = APIRouter(prefix="/purchase-order-item", tags=["purchase-order-item"])

@router.get("/", response_model=list[PurchaseOrderItemRead])
def read_purchase_order_items(db: Session = Depends(get_db)):
    return get_all_purchase_order_items(db)

@router.get("/{po_id}/{item_id}", response_model=PurchaseOrderItemRead)
def read_purchase_order_item(po_id: int, item_id: int, db: Session = Depends(get_db)):
    po_item = get_purchase_order_item(db, po_id, item_id)
    if not po_item:
        raise HTTPException(status_code=404, detail="Purchase order item not found")
    return po_item

@router.post("/", response_model=PurchaseOrderItemRead)
def create_new_purchase_order_item(payload: PurchaseOrderItemCreate, db: Session = Depends(get_db)):
    return create_purchase_order_item(db, payload)

@router.put("/{po_id}/{item_id}", response_model=PurchaseOrderItemRead)
def update_existing_purchase_order_item(po_id: int, item_id: int, payload: PurchaseOrderItemUpdate, db: Session = Depends(get_db)):
    updated = update_purchase_order_item(db, po_id, item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Purchase order item not found")
    return updated

@router.delete("/{po_id}/{item_id}", response_model=PurchaseOrderItemRead)
def delete_existing_purchase_order_item(po_id: int, item_id: int, db: Session = Depends(get_db)):
    deleted = delete_purchase_order_item(db, po_id, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Purchase order item not found")
    return deleted