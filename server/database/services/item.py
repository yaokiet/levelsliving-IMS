from sqlalchemy.orm import Session
from database.models.item import Item
from database.models.item_component import ItemComponent
from database.schemas.item import ItemCreate, ItemUpdate, ItemComponentRead, ItemWithComponents
from collections import defaultdict

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
    Retrieves an item and attaches the full details of each of its components
    using an efficient JOIN query.
    """
    # 1. Retrieve the parent item, same as before.
    item = get_item(db, item_id)
    if not item:
        return None

    # 2. Perform a single JOIN query to get all child items and their quantities.
    component_results = (
        db.query(Item, ItemComponent.qty_required)
        .join(ItemComponent, Item.id == ItemComponent.child_id)
        .filter(ItemComponent.parent_id == item_id)
        .all()
    )

    # 3. The query returns a list of tuples, like: [(<Item_A>, 5), (<Item_B>, 2)]
    detailed_components = []
    for component_item, qty in component_results:
        component_item.qty_required = qty
        detailed_components.append(component_item)

    # 4. Attach the fully detailed list of components to the parent item.
    item.components = detailed_components
    return item

def get_lowest_children(db: Session, item_id: int):
    """
    Recursively finds all lowest-level components for a given parent item
    and calculates the total quantity required for each.
    """
    parent_item = get_item(db, item_id)
    if not parent_item:
        return None  # Indicates the parent item was not found

    # This dictionary will aggregate quantities for each unique lowest-level child
    lowest_children_map = defaultdict(int)

    def find_leaves(current_item_id: int, cumulative_qty: int):
        # Query for direct children of the current item
        components = db.query(ItemComponent).filter(ItemComponent.parent_id == current_item_id).all()

        # Base Case: If there are no children, this is a leaf node.
        if not components:
            lowest_children_map[current_item_id] += cumulative_qty
            return

        # Recursive Step: If there are children, traverse deeper.
        for component in components:
            find_leaves(component.child_id, cumulative_qty * component.qty_required)

    # Start the recursion
    find_leaves(item_id, 1)

    # If the map is empty, the initial item itself is the lowest level
    if not lowest_children_map:
        return [{
            "id" : parent_item.id,
            "sku": parent_item.sku,
            "item_name": parent_item.item_name,
            "total_qty_required": 1
        }]

    # Fetch details for all unique lowest-level items in a single query
    child_ids = lowest_children_map.keys()
    child_items = db.query(Item).filter(Item.id.in_(child_ids)).all()

    # Map item IDs to their details for easy lookup
    child_details_map = {item.id: item for item in child_items}

    # Format the final result
    result = []
    for child_id, total_qty in lowest_children_map.items():
        item_details = child_details_map.get(child_id)
        if item_details:
            result.append({
                "id" : item_details.id,
                "sku": item_details.sku,
                "item_name": item_details.item_name,
                "total_qty_required": total_qty
            })

    return result
