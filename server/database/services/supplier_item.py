from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database.models.supplier_item import SupplierItem
from database.schemas.supplier_item import SupplierItemCreate, SupplierItemUpdate

def get_supplier_item(db: Session, supplier_item_id: int):
    return db.query(SupplierItem).filter(SupplierItem.id == supplier_item_id).first()

def get_all_supplier_items(db: Session):
    return db.query(SupplierItem).all()

def get_supplier_item_by_pair(db: Session, item_id: int, supplier_id: int):
    return (
        db.query(SupplierItem)
        .filter(SupplierItem.item_id == item_id, SupplierItem.supplier_id == supplier_id)
        .first()
    )

def create_supplier_item(db: Session, supplier_item: SupplierItemCreate):
    # Optional: enforce uniqueness at app level before DB constraint
    existing = get_supplier_item_by_pair(db, supplier_item.item_id, supplier_item.supplier_id)
    if existing:
        return existing
    db_supplier_item = SupplierItem(**supplier_item.dict())
    db.add(db_supplier_item)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Re-fetch in case of race; or raise depending on your preference
        return get_supplier_item_by_pair(db, supplier_item.item_id, supplier_item.supplier_id)
    db.refresh(db_supplier_item)
    return db_supplier_item

def update_supplier_item(db: Session, supplier_item_id: int, supplier_item: SupplierItemUpdate):
    db_supplier_item = get_supplier_item(db, supplier_item_id)
    if db_supplier_item:
        update_data = supplier_item.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_supplier_item, key, value)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            return None
        db.refresh(db_supplier_item)
    return db_supplier_item

def delete_supplier_item(db: Session, supplier_item_id: int):
    db_supplier_item = get_supplier_item(db, supplier_item_id)
    if db_supplier_item:
        db.delete(db_supplier_item)
        db.commit()
    return db_supplier_item