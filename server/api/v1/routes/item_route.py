from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.item import ItemCreate, ItemUpdate, ItemRead, ItemWithComponents
from database.services.item import (
    get_item, get_all_items, create_item, update_item, delete_item, get_item_with_components
)


router = APIRouter(prefix="/item", tags=["Item"])

@router.get("/", response_model=list[ItemRead])
def read_items(db: Session = Depends(get_db)):
    return get_all_items(db)

@router.get("/{item_id}", response_model=ItemRead)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=ItemRead)
def create_new_item(item: ItemCreate, db: Session = Depends(get_db)):
    return create_item(db, item)

@router.put("/{item_id}", response_model=ItemRead)
def update_existing_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    updated = update_item(db, item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated

@router.delete("/{item_id}", response_model=ItemRead)
def delete_existing_item(item_id: int, db: Session = Depends(get_db)):
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