from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from typing import List, Optional

from database.models.cart import CartItem
from database.models.item import Item
from database.models.item_component import ItemComponent # Assuming you have this model
from database.schemas.cart import CartItemRead

def _upsert_cart_item(db: Session, user_id: int, item_id: int, quantity: int):
    """
    Inserts a cart item or updates its quantity if it already exists for the user.
    Uses a PostgreSQL-specific ON CONFLICT clause.
    """
    insert_stmt = insert(CartItem).values(
        user_id=user_id, item_id=item_id, quantity=quantity
    )

    update_stmt = insert_stmt.on_conflict_do_update(
        index_elements=['user_id', 'item_id'],
        set_={'quantity': CartItem.quantity + quantity}
    )
    db.execute(update_stmt)


def add_item_to_cart(db: Session, user_id: int, item_id: int, quantity: int):
    """
    Adds an item to the user's cart. If the item has a Bill of Materials (BoM),
    it adds the individual components instead.
    """
    # Check if the item is a parent with components
    components = db.query(ItemComponent).filter(ItemComponent.parent_id == item_id).all()

    if components:
        # It's a parent item, add its components
        for component in components:
            total_quantity = quantity * component.qty_required
            _upsert_cart_item(db, user_id, component.child_id, total_quantity)
    else:
        # It's a simple item, add it directly
        _upsert_cart_item(db, user_id, item_id, quantity)

    db.commit()


def get_user_cart(db: Session, user_id: int) -> List[CartItemRead]:
    """Retrieves all items from the user's cart with detailed information."""
    cart_items = (
        db.query(
            Item.id.label("item_id"),
            CartItem.quantity,
            Item.sku,
            Item.item_name,
            Item.variant,
        )
        .join(Item, CartItem.item_id == Item.id)
        .filter(CartItem.user_id == user_id)
        .all()
    )
    return [CartItemRead.from_orm(item) for item in cart_items]


def update_cart_item_quantity(db: Session, user_id: int, item_id: int, quantity: int) -> bool:
    """Updates an item's quantity. If quantity is 0, removes the item. Returns True if found."""
    db_cart_item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.item_id == item_id
    ).first()

    if not db_cart_item:
        return False

    if quantity <= 0:
        db.delete(db_cart_item)
    else:
        db_cart_item.quantity = quantity

    db.commit()
    return True

def delete_cart_item(db: Session, *, user_id: int, item_id: int) -> Optional[CartItem]:
    """Delete one item from the user's cart by item_id."""
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.user_id == user_id, CartItem.item_id == item_id)
        .first()
    )

    if not cart_item:
        return None

    db.delete(cart_item)
    db.commit()
    return cart_item # Returns the detached instance


def clear_user_cart(db: Session, user_id: int):
    """Deletes all items from a user's cart."""
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
