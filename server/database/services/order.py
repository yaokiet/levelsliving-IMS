from sqlalchemy.orm import Session
from database.models.order import Order
from database.schemas.order import OrderCreate, OrderUpdate

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.order_id == order_id).first()

def get_all_orders(db: Session):
    return db.query(Order).all()

def create_order(db: Session, payload: OrderCreate):
    db_order = Order(**payload.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order(db: Session, order_id: int, payload: OrderUpdate):
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order, key, value)
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    db.delete(db_order)
    db.commit()
    return db_order