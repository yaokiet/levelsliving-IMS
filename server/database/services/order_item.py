from sqlalchemy.orm import Session
from database.models.order_item import OrderItem
from database.schemas.order_item import OrderItemCreate, OrderItemUpdate

from sqlalchemy import func         
from datetime import date           
import calendar                     

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
    db_order_item = OrderItem(**payload.model_dump())
    db.add(db_order_item)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item

def update_order_item(db: Session, order_id: int, item_id: int, payload: OrderItemUpdate):
    db_order_item = get_order_item(db, order_id, item_id)
    if not db_order_item:
        return None
    update_data = payload.model_dump(exclude_unset=True)
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

def get_monthly_order_item_quantities(db: Session):
    """
    Aggregate total qty_requested per month based on delivery_date.

    Returns a list of dicts: [{ "date": date, "quantity": int }, ...]
    where date is the LAST day of each month.
    """
    rows = (
        db.query(
            func.date_trunc("month", OrderItem.delivery_date).label("month"),
            func.sum(OrderItem.qty_requested).label("quantity"),
        )
        .group_by(func.date_trunc("month", OrderItem.delivery_date))
        .order_by(func.date_trunc("month", OrderItem.delivery_date))
        .all()
    )

    results = []
    for month_ts, qty in rows:
        if month_ts is None:
            continue

        # month_ts is a datetime at the first day of that month (e.g. 2024-04-01)
        year = month_ts.year
        month = month_ts.month
        last_day = calendar.monthrange(year, month)[1]
        month_end = date(year, month, last_day)

        results.append({
            "date": month_end,
            "quantity": int(qty or 0),
        })

    return results