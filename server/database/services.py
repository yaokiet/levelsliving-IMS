from sqlalchemy.orm import Session
from database.models.users import User
from database.models.item import Item

def get_all_users(db: Session):
    users = db.query(User).all()
    return users

def get_all_items(db: Session):
    items = db.query(Item).all()
    return items
