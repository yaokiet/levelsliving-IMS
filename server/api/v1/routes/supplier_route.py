from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database.database import get_db
from server.database.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierRead
from server.database.services.supplier import (
    get_supplier, get_all_suppliers, create_supplier, update_supplier, delete_supplier
)

router = APIRouter(prefix="/supplier", tags=["supplier"])

@router.get("/", response_model=list[SupplierRead])
def read_suppliers(db: Session = Depends(get_db)):
    """
    Retrieve all suppliers.
    """
    return get_all_suppliers(db)

@router.get("/{supplier_id}", response_model=SupplierRead)
def read_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a supplier by its ID.
    """
    supplier = get_supplier(db, supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.post("/", response_model=SupplierRead)
def create_new_supplier(payload: SupplierCreate, db: Session = Depends(get_db)):
    """
    Create a new supplier.
    """
    return create_supplier(db, payload)

@router.put("/{supplier_id}", response_model=SupplierRead)
def update_existing_supplier(supplier_id: int, payload: SupplierUpdate, db: Session = Depends(get_db)):
    """
    Update an existing supplier by ID.
    """
    updated = update_supplier(db, supplier_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return updated

@router.delete("/{supplier_id}", response_model=SupplierRead)
def delete_existing_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """
    Delete a supplier by ID.
    """
    deleted = delete_supplier(db, supplier_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return deleted