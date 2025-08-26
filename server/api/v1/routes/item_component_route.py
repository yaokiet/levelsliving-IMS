from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.item_component import (
    ItemComponentCreate,
    ItemComponentUpdate,
    ItemComponentRead,
)
from database.services.item_component import (
    get_item_component,
    get_all_item_components,
    create_item_component,
    update_item_component,
    delete_item_component,
)

router = APIRouter(prefix="/item-component", tags=["item-component"])

@router.get("/", response_model=list[ItemComponentRead])
def read_item_components(db: Session = Depends(get_db)):
    return get_all_item_components(db)

@router.get("/{parent_id}/{child_id}", response_model=ItemComponentRead)
def read_item_component(parent_id: int, child_id: int, db: Session = Depends(get_db)):
    row = get_item_component(db, parent_id, child_id)
    if not row:
        raise HTTPException(status_code=404, detail="ItemComponent not found")
    return row

@router.post("/", response_model=ItemComponentRead)
def create_new_item_component(payload: ItemComponentCreate, db: Session = Depends(get_db)):
    return create_item_component(db, payload)

@router.put("/{parent_id}/{child_id}", response_model=ItemComponentRead)
def update_existing_item_component(
    parent_id: int,
    child_id: int,
    payload: ItemComponentUpdate,
    db: Session = Depends(get_db),
):
    updated = update_item_component(db, parent_id, child_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="ItemComponent not found")
    return updated

@router.delete("/{parent_id}/{child_id}", response_model=ItemComponentRead)
def delete_existing_item_component(parent_id: int, child_id: int, db: Session = Depends(get_db)):
    deleted = delete_item_component(db, parent_id, child_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="ItemComponent not found")
    return deleted 