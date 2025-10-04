from sqlalchemy.orm import Session
from database.models.supplier import Supplier
from database.schemas.supplier import SupplierCreate, SupplierUpdate
from typing import List
from sqlalchemy import func
from database.models.supplier_item import SupplierItem

def get_supplier(db: Session, supplier_id: int):
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

def get_supplier_by_name(db: Session, name: str):
    return db.query(Supplier).filter(Supplier.name == name).first()

def get_all_suppliers(db: Session):
    return db.query(Supplier).all()

def create_supplier(db: Session, supplier: SupplierCreate):
    db_supplier = Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def update_supplier(db: Session, supplier_id: int, supplier: SupplierUpdate):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if db_supplier:
        update_data = supplier.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_supplier, key, value)
        db.commit()
        db.refresh(db_supplier)
    return db_supplier

def delete_supplier(db: Session, supplier_id: int):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if db_supplier:
        db.delete(db_supplier)
        db.commit()
    return db_supplier

# new endpoint to get suppliers by item IDs
def get_suppliers_by_items(db: Session, item_ids: List[int]) -> List[Supplier]:
    """
    Finds all suppliers who stock EVERY item from the provided list of item IDs.

    Returns an empty list if no suppliers match or if the item_ids list is empty.
    """
    # Ensure the list is not empty and contains unique IDs
    unique_item_ids = sorted(list(set(item_ids)))
    num_items = len(unique_item_ids)

    if not num_items:
        return []

    # This subquery finds the IDs of suppliers who have a count of matching items
    # equal to the total number of unique items required.
    matching_supplier_ids = (
        db.query(SupplierItem.supplier_id)
          .filter(SupplierItem.item_id.in_(unique_item_ids))
          .group_by(SupplierItem.supplier_id)
          .having(func.count(SupplierItem.item_id) == num_items)
    ).subquery()

    # Fetch the full Supplier objects for the matching IDs
    return (
        db.query(Supplier)
          .filter(Supplier.id.in_(matching_supplier_ids))
          .all()
    )
