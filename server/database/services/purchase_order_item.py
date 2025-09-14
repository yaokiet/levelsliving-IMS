from sqlalchemy.orm import Session
from server.database.models.purchase_order_item import PurchaseOrderItem
from server.database.schemas.purchase_order_item import PurchaseOrderItemCreate, PurchaseOrderItemUpdate

def get_purchase_order_item(db: Session, po_id: int, item_id: int):
    return (
        db.query(PurchaseOrderItem)
        .filter(PurchaseOrderItem.purchase_order_id == po_id, PurchaseOrderItem.item_id == item_id)
        .first()
    )

def get_all_purchase_order_items(db: Session):
    return db.query(PurchaseOrderItem).all()

def create_purchase_order_item(db: Session, payload: PurchaseOrderItemCreate):
    existing = get_purchase_order_item(db, payload.purchase_order_id, payload.item_id)
    if existing:
        return existing
    db_po_item = PurchaseOrderItem(**payload.dict())
    db.add(db_po_item)
    db.commit()
    db.refresh(db_po_item)
    return db_po_item

def update_purchase_order_item(db: Session, po_id: int, item_id: int, payload: PurchaseOrderItemUpdate):
    db_po_item = get_purchase_order_item(db, po_id, item_id)
    if not db_po_item:
        return None
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_po_item, key, value)
    db.commit()
    db.refresh(db_po_item)
    return db_po_item

def delete_purchase_order_item(db: Session, po_id: int, item_id: int):
    db_po_item = get_purchase_order_item(db, po_id, item_id)
    if not db_po_item:
        return None
    db.delete(db_po_item)
    db.commit()
    return db_po_item