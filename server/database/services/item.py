from sqlalchemy.orm import Session
from database.models.item import Item
from database.models.item_component import ItemComponent
from database.schemas.item import ItemCreate, ItemUpdate, ItemComponentRead, ItemWithComponents

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def get_all_items(db: Session):
    return db.query(Item).all()

def create_item(db: Session, item: ItemCreate):
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item: ItemUpdate):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        for key, value in item.dict().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

# item detail APIs

def get_all_item_components(db: Session, item_id: int):
    return db.query(ItemComponent).filter(ItemComponent.parent_id == item_id).all()

def get_item_with_components(db: Session, item_id: int):
    """
    Retrieves an item and attaches the full details of each of its components.
    """
    item = get_item(db, item_id)
    if not item:
        return None

    component_relations = get_all_item_components(db, item_id)

    detailed_components = []
    for relation in component_relations:

        component_item = get_item(db, relation.child_id)
        if component_item:
            component_item.qty_required = relation.qty_required
            detailed_components.append(component_item)

    item.components = detailed_components
    return item
    