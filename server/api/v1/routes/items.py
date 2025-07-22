from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Item  # adjust path based on your structure

router = APIRouter()

@router.get("/items")
def get_all_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    return items

@router.post("/items/seed")
def seed_items(db: Session = Depends(get_db)):
    dummy_items = [
        Item(name="Item 1", description="First item"),
        Item(name="Item 2", description="Second item"),
        Item(name="Item 3", description="Third item",),
    ]
    db.add_all(dummy_items)
    db.commit()
    return {"message": f"Seeded {len(dummy_items)} items."}
