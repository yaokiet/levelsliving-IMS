from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.database import get_db
from database.schemas.pagination import PageMeta, Paginated
from database.schemas.supplier_item import SupplierItemCreate, SupplierItemUpdate, SupplierItemRead
from database.services.supplier_item import (
    get_supplier_item, get_supplier_items, create_supplier_item, update_supplier_item, delete_supplier_item
)

router = APIRouter(prefix="/supplier-item", tags=["supplier-item"])

@router.get("", response_model=Paginated[SupplierItemRead])
def read_supplier_items(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    size: int = Query(50, ge=1, le=200, description="Page size"),
    include_total: bool = False,
    db: Session = Depends(get_db)):
    """
    Retrieve all supplier-item relationships.
    """
    return get_supplier_items(db)

@router.get("/{supplier_item_id}", response_model=SupplierItemRead)
def read_supplier_item(supplier_item_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a supplier-item relationship by its ID.
    """
    si = get_supplier_item(db, supplier_item_id)
    if not si:
        raise HTTPException(status_code=404, detail="SupplierItem not found")
    return si

@router.post("", response_model=SupplierItemRead)
def create_new_supplier_item(payload: SupplierItemCreate, db: Session = Depends(get_db)):
    """
    Create a new supplier-item relationship.
    """
    return create_supplier_item(db, payload)

@router.put("/{supplier_item_id}", response_model=SupplierItemRead)
def update_existing_supplier_item(supplier_item_id: int, payload: SupplierItemUpdate, db: Session = Depends(get_db)):
    """
    Update an existing supplier-item relationship by ID.
    """
    updated = update_supplier_item(db, supplier_item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="SupplierItem not found or duplicate pair")
    return updated

@router.delete("/{supplier_item_id}", response_model=SupplierItemRead)
def delete_existing_supplier_item(supplier_item_id: int, db: Session = Depends(get_db)):
    """
    Delete a supplier-item relationship by ID.
    """
    deleted = delete_supplier_item(db, supplier_item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="SupplierItem not found")
    return deleted