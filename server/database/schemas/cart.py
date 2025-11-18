from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional, List

# ===================================================================
# Pydantic Schemas for Data Validation & Serialization
# ===================================================================

class CartItemBase(BaseModel):
    """Base schema for a cart item."""
    item_id: int = Field(..., gt=0, description="The ID of the item.")
    quantity: int = Field(..., gt=0, description="The quantity of the item.")


class CartItemCreate(CartItemBase):
    """Schema for adding an item to the cart."""
    item_id: int
    quantity: int

# --- Add this new schema for the bulk endpoint ---
class CartBulkCreate(BaseModel):
    items: List[CartItemCreate]

class CartItemUpdate(BaseModel):
    """Schema for updating an item's quantity in the cart."""
    quantity: int = Field(..., ge=0, description="New quantity. 0 will remove the item.")


class CartItemRead(BaseModel):
    """Schema for reading a cart item with details from the Item model."""
    item_id: int
    quantity: int
    sku: str
    item_name: str
    variant: Optional[str] = None

    class ConfigDict:
        from_attributes = True # Changed from orm_mode = True

