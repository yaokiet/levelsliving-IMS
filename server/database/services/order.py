from sqlalchemy.orm import Session
from database.models.order import Order
from database.models.order_item import OrderItem
from database.schemas.order import OrderCreate, OrderUpdate

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.order_id == order_id).first()

def get_all_orders(db: Session):
    return db.query(Order).all()

def get_order_with_items_by_id(db: Session, order_id: int):
    """Get a single order with its nested order items by order_id"""
    order = get_order(db, order_id)
    if not order:
        return None
    
    # Get order items for this order
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order.order_id).all()
    
    # Calculate total order quantity
    order_qty = sum(item.qty_requested for item in order_items)
    
    # Determine status (you can customize this logic)
    status = "Pending"  # Default status
    
    order_with_items = {
        "id": order.order_id,
        "cust_name": order.name,
        "order_date": order.order_date.strftime("%Y-%m-%d"),
        "cust_contact": order.contact,
        "order_qty": order_qty,
        "status": status,
        "subRows": order_items
    }
    
    return order_with_items

def get_orders_with_items(db: Session):
    """Get all orders with their nested order items in the required format"""
    orders = db.query(Order).all()
    result = []
    
    for order in orders:
        order_with_items = get_order_with_items_by_id(db, order.order_id)
        if order_with_items:
            result.append(order_with_items)
    
    return result

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