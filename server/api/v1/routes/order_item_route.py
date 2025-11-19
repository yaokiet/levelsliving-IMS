from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.order_item import OrderItemCreate, OrderItemUpdate, OrderItemRead, MonthlyQuantity
from database.services.order_item import (
    get_order_item, get_all_order_items,
    create_order_item, update_order_item, delete_order_item,
    get_monthly_order_item_quantities,
    get_monthly_order_item_quantities_by_sku
)

router = APIRouter(prefix="/order-item", tags=["order-item"])

@router.get("", response_model=list[OrderItemRead])
def read_order_items(db: Session = Depends(get_db)):
    """
    Retrieve all order items.
    """
    return get_all_order_items(db)

@router.get("/monthly/quantity", response_model=list[MonthlyQuantity])
def read_monthly_order_item_quantities(db: Session = Depends(get_db)):
    """
    Return aggregated monthly quantities based on order item delivery_date.

    Shape:
    [
      { "date": "2022-04-30", "quantity": 91 },
      { "date": "2022-05-31", "quantity": 280 },
      ...
    ]
    """
    return get_monthly_order_item_quantities(db)

@router.get("/monthly/quantity/{item_id}", response_model=list[MonthlyQuantity])
def read_monthly_order_item_quantities_for_sku(item_id: int, db: Session = Depends(get_db)):
    """
    Return aggregated monthly quantities for a specific SKU (item_id).

    Shape:
    [
      { "date": "2023-01-31", "quantity": 12 },
      { "date": "2023-02-28", "quantity": 20 },
      ...
    ]
    """
    results = get_monthly_order_item_quantities_by_sku(db, item_id)
    if results is None:
        raise HTTPException(status_code=404, detail="SKU not found")
    return results


@router.get("/{order_id}/{item_id}", response_model=OrderItemRead)
def read_order_item(order_id: int, item_id: int, db: Session = Depends(get_db)):
    """
    Retrieve an order item by its composite key.
    """
    oi = get_order_item(db, order_id, item_id)
    if not oi:
        raise HTTPException(status_code=404, detail="Order item not found")
    return oi

@router.post("", response_model=OrderItemRead)
def create_new_order_item(payload: OrderItemCreate, db: Session = Depends(get_db)):
    """
    Create a new order item.
    """
    return create_order_item(db, payload)

@router.put("/{order_id}/{item_id}", response_model=OrderItemRead)
def update_existing_order_item(order_id: int, item_id: int, payload: OrderItemUpdate, db: Session = Depends(get_db)):
    """
    Update an existing order item by composite key.
    """
    updated = update_order_item(db, order_id, item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Order item not found")
    return updated

@router.delete("/{order_id}/{item_id}", response_model=OrderItemRead)
def delete_existing_order_item(order_id: int, item_id: int, db: Session = Depends(get_db)):
    """
    Delete an order item by composite key.
    """
    deleted = delete_order_item(db, order_id, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order item not found")
    return deleted

