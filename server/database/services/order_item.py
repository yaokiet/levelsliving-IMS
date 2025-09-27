from sqlalchemy.orm import Session
from database.models.order_item import OrderItem
from database.schemas.order_item import OrderItemCreate, OrderItemUpdate

def get_order_item(db: Session, order_id: int, item_id: int):
    return (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order_id, OrderItem.item_id == item_id)
        .first()
    )

def get_all_order_items(db: Session):
    return db.query(OrderItem).all()

def get_order_items_by_order_id(db: Session, order_id: int):
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

def create_order_item(db: Session, payload: OrderItemCreate):
    existing = get_order_item(db, payload.order_id, payload.item_id)
    if existing:
        return existing
    db_order_item = OrderItem(**payload.dict())
    db.add(db_order_item)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item

def update_order_item(db: Session, order_id: int, item_id: int, payload: OrderItemUpdate):
    db_order_item = get_order_item(db, order_id, item_id)
    if not db_order_item:
        return None
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order_item, key, value)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item

def delete_order_item(db: Session, order_id: int, item_id: int):
    db_order_item = get_order_item(db, order_id, item_id)
    if not db_order_item:
        return None
    db.delete(db_order_item)
    db.commit()
    return db_order_item