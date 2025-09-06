from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from database.database import get_db
from database.schemas.cart import CartItemCreate, CartItemRead, CartItemUpdate
from database.services import cart_service

router = APIRouter(prefix="/cart", tags=["cart"])


@router.post("/")
def add_item_to_cart(
    item_data: CartItemCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Adds an item to the user's cart. If the item has a Bill of Materials (BoM),
    it adds the individual components instead.
    """
    user_payload = getattr(request.state, "user", None)
    if not user_payload or "user_id" not in user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = user_payload["user_id"]

    try:
        cart_service.add_item_to_cart(
            db, user_id=user_id, item_id=item_data.item_id, quantity=item_data.quantity
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
    return {"message": "Item added to cart successfully."}


@router.get("/", response_model=List[CartItemRead])
def read_user_cart(request: Request, db: Session = Depends(get_db)):
    """Retrieves all items from the current user's cart."""
    user_payload = getattr(request.state, "user", None)
    if not user_payload or "user_id" not in user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = user_payload["user_id"]
    return cart_service.get_user_cart(db, user_id=user_id)


@router.put("/{item_id}")
def update_item_quantity(
    item_id: int,
    item_update: CartItemUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    """Updates an item's quantity in the cart. If quantity is 0, the item is removed."""
    user_payload = getattr(request.state, "user", None)
    if not user_payload or "user_id" not in user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = user_payload["user_id"]

    updated = cart_service.update_cart_item_quantity(
        db, user_id=user_id, item_id=item_id, quantity=item_update.quantity
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found in cart.")
    return {"message": "Cart updated successfully."}


@router.delete(
    "/{item_id}",
    response_model=dict,
)
def delete_item_from_cart(
    item_id: int, request: Request, db: Session = Depends(get_db)
):
    """Delete a single item from the user's cart by its ID."""
    user_payload = getattr(request.state, "user", None)
    if not user_payload or "user_id" not in user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = user_payload["user_id"]

    deleted_item = cart_service.delete_cart_item(db, user_id=user_id, item_id=item_id)

    if not deleted_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id {item_id} not found in cart.",
        )
    return {"message": "Item deleted"}


@router.delete("/")
def clear_cart(request: Request, db: Session = Depends(get_db)):
    """Deletes all items from the current user's cart."""
    user_payload = getattr(request.state, "user", None)
    if not user_payload or "user_id" not in user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = user_payload["user_id"]
    cart_service.clear_user_cart(db, user_id=user_id)
    return {"message": "Cart cleared successfully."}

