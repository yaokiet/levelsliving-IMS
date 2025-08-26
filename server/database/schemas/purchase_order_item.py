from pydantic import BaseModel
from typing import Optional

class PurchaseOrderItemBase(BaseModel):
    purchase_order_id: int
    item_id: int
    qty: int
    supplier_item_id: Optional[int] = None

class PurchaseOrderItemCreate(PurchaseOrderItemBase):
    pass

class PurchaseOrderItemUpdate(BaseModel):
    qty: Optional[int] = None
    supplier_item_id: Optional[int] = None

class PurchaseOrderItemRead(PurchaseOrderItemBase):
    class Config:
        orm_mode = True