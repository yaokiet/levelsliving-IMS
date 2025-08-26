from sqlalchemy.orm import Session
from database.models.item_component import ItemComponent
from database.schemas.item_component import ItemComponentCreate, ItemComponentUpdate


def get_item_component(db: Session, parent_id: int, child_id: int):
    return (
        db.query(ItemComponent)
        .filter(ItemComponent.parent_id == parent_id, ItemComponent.child_id == child_id)
        .first()
    )


def get_all_item_components(db: Session):
    return db.query(ItemComponent).all()


def create_item_component(db: Session, payload: ItemComponentCreate):
    existing = get_item_component(db, payload.parent_id, payload.child_id)
    if existing:
        return existing
    db_row = ItemComponent(
        parent_id=payload.parent_id,
        child_id=payload.child_id,
        qty_required=payload.qty_required,
    )
    db.add(db_row)
    db.commit()
    db.refresh(db_row)
    return db_row


def update_item_component(db: Session, parent_id: int, child_id: int, payload: ItemComponentUpdate):
    db_row = get_item_component(db, parent_id, child_id)
    if not db_row:
        return None
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_row, key, value)
    db.commit()
    db.refresh(db_row)
    return db_row


def delete_item_component(db: Session, parent_id: int, child_id: int):
    db_row = get_item_component(db, parent_id, child_id)
    if not db_row:
        return None
    db.delete(db_row)
    db.commit()
    return db_row 