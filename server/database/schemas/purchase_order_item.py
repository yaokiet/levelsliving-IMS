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

#custom schema for Purchase Order Details read, including supplier_item_id
class PurchaseOrderItemReadCustom(BaseModel):
    item_id: int
    sku: str
    item_name: str
    variant: Optional[str] = None
    ordered_qty: int 
    supplier_item_id: Optional[int] = None   
    class Config:
        orm_mode = True