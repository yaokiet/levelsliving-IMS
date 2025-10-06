from typing import Optional, Iterable, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.database import get_db
from database.schemas.pagination import Paginated
from database.schemas.item import ItemCreate, ItemUpdate, ItemRead, ItemWithComponents, LowestChildDetail
from database.services.item import (
    get_item, get_all_items, get_all_items_pagniated, create_item, update_item, delete_item, get_item_with_components, get_lowest_children, get_item_by_order_id

)

router = APIRouter(prefix="/item", tags=["item"])

@router.get("/paginated", response_model=Paginated[ItemRead])
def read_items_paginated(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    q: Optional[str] = None,
    search_columns: Optional[List[str]] = Query(None, description="Repeat param, e.g. ?search_columns=sku&search_columns=item_name"),
    sort: Optional[List[str]] = Query(None, description='Repeat param, e.g. ?sort=item_name:asc&sort=id:desc'),
    include_total: bool = False,
    db: Session = Depends(get_db),
):
    """
    Paginated Items with optional free-text search and whitelisted sorting.
    """
    return get_all_items_pagniated(
        db,
        page=page,
        size=size,
        q=q,
        search_columns=search_columns,
        sort=sort,
        include_total=include_total,
    )

@router.get("/", response_model=list[ItemRead])
def read_items(db: Session = Depends(get_db)):
    """
    Retrieve all items.
    """
    return get_all_items(db)

@router.get("/by-order/{order_id}", response_model=list[ItemRead])
def get_item_by_order(order_id: int, db: Session = Depends(get_db)):
    """
    Retrieve an item by its associated order ID.
    """
    items = get_item_by_order_id(db, order_id)
    if not items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items

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

@router.get("/lowest-children/{item_id}", response_model=list[LowestChildDetail])
def read_lowest_children(item_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all lowest-level child items for a given item, calculating
    the total quantity required for each. If the item has no children,
    it returns itself with a quantity of 1.
    """
    lowest_children = get_lowest_children(db, item_id=item_id)

    if lowest_children is None:
        raise HTTPException(status_code=404, detail="Item not found")

    return lowest_children