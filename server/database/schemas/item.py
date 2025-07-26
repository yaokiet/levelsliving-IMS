from pydantic import BaseModel
from typing import Optional

class ItemBase(BaseModel):
    sku: str
    type: str
    item_name: str
    variant: Optional[str] = None
    qty: int
    threshold_qty: int

class ItemCreate(ItemBase):
    pass  # Inherits all fields from ItemBase

class ItemUpdate(BaseModel):
    sku: Optional[str] = None
    type: Optional[str] = None
    item_name: Optional[str] = None
    variant: Optional[str] = None
    qty: Optional[int] = None
    threshold_qty: Optional[int] = None

class ItemRead(ItemBase):
    id: int

    class Config:
        orm_mode = True