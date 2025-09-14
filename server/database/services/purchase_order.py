from sqlalchemy.orm import Session
from server.database.models.purchase_order import PurchaseOrder
from server.database.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderUpdate

def get_purchase_order(db: Session, po_id: int):
    return db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()

def get_all_purchase_orders(db: Session):
    return db.query(PurchaseOrder).all()

def create_purchase_order(db: Session, payload: PurchaseOrderCreate):
    db_po = PurchaseOrder(
        supplier_id=payload.supplier_id,
        user_id=payload.user_id,
        order_date=payload.order_date,  # can be None; DB default may apply
    )
    db.add(db_po)
    db.commit()
    db.refresh(db_po)
    return db_po

def update_purchase_order(db: Session, po_id: int, payload: PurchaseOrderUpdate):
    db_po = get_purchase_order(db, po_id)
    if not db_po:
        return None
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_po, key, value)
    db.commit()
    db.refresh(db_po)
    return db_po

def delete_purchase_order(db: Session, po_id: int):
    db_po = get_purchase_order(db, po_id)
    if not db_po:
        return None
    db.delete(db_po)
    db.commit()
    return db_po