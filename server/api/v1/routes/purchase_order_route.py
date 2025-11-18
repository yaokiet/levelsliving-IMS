from fastapi import APIRouter, Depends, HTTPException, Query, status, Request, BackgroundTasks, UploadFile, File, Form
from typing import Optional, Iterable, List
from sqlalchemy.orm import Session

from database.database import get_db
import json
from database.schemas.purchase_order import (
    PurchaseOrderCreateWithItems, 
    PurchaseOrderDetails, 
    PurchaseOrderUpdate, 
    PurchaseOrderRead, 
    PurchaseOrderItemReadCustom,
    PurchaseOrderCreateFromCart,
    PurchaseOrderStatusUpdate,
)

from database.schemas.pagination import Paginated

from database.services.purchase_order import (
    get_all_purchase_orders,
    create_purchase_order_from_cart_service,
    update_purchase_order, 
    delete_purchase_order,
    get_purchase_order_details,
    update_purchase_order_status,
)

from database.services.email_service import send_purchase_order_email

router = APIRouter(prefix="/purchase-order", tags=["purchase-order"])

@router.get("", response_model=Paginated[PurchaseOrderRead])
def list_purchase_orders(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    size: int = Query(50, ge=1, le=200, description="Page size"),
    q: Optional[str] = Query(None, description="Free-text search value"),
    search_columns: Optional[List[str]] = Query(
        None,
        description='Columns to search (repeat param), e.g. ?search_columns=id&search_columns=status',
    ),
    sort: Optional[List[str]] = Query(
        None,
        description='Sort tokens (repeat param), e.g. ?sort=order_date:desc&sort=id:desc',
    ),
    include_total: bool = Query(
        False,
        description="If true, run COUNT(*) to include total/pages in meta",
    ),
    db: Session = Depends(get_db),
):
    """
    Paginated list of purchase orders with meta.
    Mirrors service signature and returns:
    {
      "meta": {...},
      "data": [PurchaseOrderRead, ...]
    }
    """
    return get_all_purchase_orders(
        db,
        page=page,
        size=size,
        q=q,
        search_columns=search_columns,
        sort=sort,  
        include_total=include_total,
    )

@router.get("/{po_id}", response_model=PurchaseOrderDetails)
def read_purchase_order_details(po_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a purchase order details by its ID.
    """
    po = get_purchase_order_details(db, po_id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return po

# @router.post("", response_model=PurchaseOrderDetails)
# def create_new_purchase_order(payload: PurchaseOrderCreateWithItems, db: Session = Depends(get_db)):
#     """
#     Create a new purchase order **and its items** in a single transaction.
#     Returns the full PO details payload.
#     """
#     return create_purchase_order(db, payload)

@router.post("", response_model=PurchaseOrderDetails)
async def create_purchase_order_from_cart( # Renamed for clarity
    payload: PurchaseOrderCreateFromCart, # <-- Use the new, simpler payload
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Create a new purchase order from the user's cart and clears the cart
    in a single transaction.

    Upon successful creation, it sends a confirmation email to the supplier
    in a background task.
    """
    user_payload = getattr(request.state, "user", None)
    if not user_payload or "user_id" not in user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = user_payload["user_id"]
    
    # Pass the user_id to the service function
    new_po = create_purchase_order_from_cart_service(db, payload, user_id)

    background_tasks.add_task(
        send_purchase_order_email,
        po_id=new_po['id']
    )

    return new_po

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

@router.patch("/{po_id}/status", response_model=PurchaseOrderDetails)
def set_purchase_order_status(
    po_id: int,
    payload: PurchaseOrderStatusUpdate,
    db: Session = Depends(get_db),
):
    """
    Update the status of a purchase order. If status becomes 'Confirmed',
    stock levels of items in the PO are incremented accordingly.
    """
    updated = update_purchase_order_status(db, po_id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return updated