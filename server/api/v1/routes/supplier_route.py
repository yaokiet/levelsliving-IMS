from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierRead, SupplierSearchByItems
from database.services.supplier import (
    get_supplier, get_all_suppliers, create_supplier, update_supplier, delete_supplier, get_suppliers_by_items
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

# New endpoint to get suppliers by item IDs
@router.post("/by-items", response_model=list[SupplierRead])
def find_suppliers_by_all_items(
    payload: SupplierSearchByItems, 
    db: Session = Depends(get_db)
):
    """
    Find suppliers that stock ALL items from the provided list of item IDs.
    
    If a supplier only stocks some but not all of the items, they will not be included.
    Returns an empty list if no supplier can fulfill the entire item list.
    """
    suppliers = get_suppliers_by_items(db, item_ids=payload.item_ids)
    return suppliers