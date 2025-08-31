from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrderRead
from database.services.purchase_order import (
    get_purchase_order, get_all_purchase_orders, create_purchase_order, update_purchase_order, delete_purchase_order
)

router = APIRouter(prefix="/purchase-order", tags=["purchase-order"])

@router.get("/", response_model=list[PurchaseOrderRead])
def read_purchase_orders(db: Session = Depends(get_db)):
    """
    Retrieve all purchase orders.
    """
    return get_all_purchase_orders(db)

@router.get("/{po_id}", response_model=PurchaseOrderRead)
def read_purchase_order(po_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a purchase order by its ID.
    """
    po = get_purchase_order(db, po_id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return po

@router.post("/", response_model=PurchaseOrderRead)
def create_new_purchase_order(payload: PurchaseOrderCreate, db: Session = Depends(get_db)):
    """
    Create a new purchase order.
    """
    return create_purchase_order(db, payload)

@router.put("/{po_id}", response_model=PurchaseOrderRead)
def update_existing_purchase_order(po_id: int, payload: PurchaseOrderUpdate, db: Session = Depends(get_db)):
    """
    Update an existing purchase order by ID.
    """
    updated = update_purchase_order(db, po_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return updated

@router.delete("/{po_id}", response_model=PurchaseOrderRead)
def delete_existing_purchase_order(po_id: int, db: Session = Depends(get_db)):
    """
    Delete a purchase order by ID.
    """
    deleted = delete_purchase_order(db, po_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return deleted