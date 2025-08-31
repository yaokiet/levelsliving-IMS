from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.item import ItemCreate, ItemUpdate, ItemRead, ItemWithComponents
from database.services.item import (
    get_item, get_all_items, create_item, update_item, delete_item, get_item_with_components
)

router = APIRouter(prefix="/item", tags=["item"])

@router.get("/", response_model=list[ItemRead])
def read_items(db: Session = Depends(get_db)):
    """
    Retrieve all items.
    """
    return get_all_items(db)

@router.get("/{item_id}", response_model=ItemRead)
def read_item(item_id: int, db: Session = Depends(get_db)):
    """
    Retrieve an item by its ID.
    """
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=ItemRead)
def create_new_item(payload: ItemCreate, db: Session = Depends(get_db)):
    """
    Create a new item.
    """
    return create_item(db, payload)

@router.put("/{item_id}", response_model=ItemRead)
def update_existing_item(item_id: int, payload: ItemUpdate, db: Session = Depends(get_db)):
    """
    Update an existing item by ID.
    """
    updated = update_item(db, item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated

@router.delete("/{item_id}", response_model=ItemRead)
def delete_existing_item(item_id: int, db: Session = Depends(get_db)):
    """
    Delete an item by ID.
    """
    deleted = delete_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
    return deleted

# APIs used
@router.get("/details/{item_id}", response_model=ItemWithComponents)
def get_item_details(item_id: int, db: Session = Depends(get_db)):
    """
    Retrieve complete details for a single item, including its components.
    """
    item = get_item_with_components(db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
