from sqlalchemy.orm import Session
from database.models.purchase_order_item import PurchaseOrderItem
from database.schemas.purchase_order_item import PurchaseOrderItemCreate, PurchaseOrderItemUpdate

def get_purchase_order_item(db: Session, po_id: int, item_id: int):
    return (
        db.query(PurchaseOrderItem)
        .filter(PurchaseOrderItem.purchase_order_id == po_id, PurchaseOrderItem.item_id == item_id)
        .first()
    )

def get_all_purchase_order_items(db: Session):
    return db.query(PurchaseOrderItem).all()

def create_purchase_order_item(
    db: Session,
    payload: PurchaseOrderItemCreate,
    *,
    autocommit: bool = True,
    refresh: bool = True,
) -> PurchaseOrderItem:
    """
    Create a single PurchaseOrderItem. By default commits & refreshes.
    Set autocommit=False when composing into a larger transaction.
    """
    poi = PurchaseOrderItem(
        purchase_order_id=payload.purchase_order_id,
        item_id=payload.item_id,
        qty=payload.qty,
        supplier_item_id=payload.supplier_item_id,
    )
    db.add(poi)
    if autocommit:
        db.commit()
    if refresh:
        db.refresh(poi)
    return poi

def update_purchase_order_item(db: Session, po_id: int, item_id: int, payload: PurchaseOrderItemUpdate):
    db_po_item = get_purchase_order_item(db, po_id, item_id)
    if not db_po_item:
        return None
    update_data = payload.model_dump(exclude_unset=True)
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