from pydantic import BaseModel, Field
from typing import Optional

class PurchaseOrderItemBase(BaseModel):
    purchase_order_id: int
    item_id: int
    qty: int
    supplier_item_id: Optional[int] = None

class PurchaseOrderItemCreate(PurchaseOrderItemBase):
    pass

# input for create-PO-with-items (no purchase_order_id)
class PurchaseOrderItemInput(BaseModel):
    item_id: int = Field(..., gt=0)
    qty: int = Field(..., gt=0)
    supplier_item_id: Optional[int] = None

class PurchaseOrderItemUpdate(BaseModel):
    qty: Optional[int] = None
    supplier_item_id: Optional[int] = None

class PurchaseOrderItemRead(PurchaseOrderItemBase):
    class ConfigDict:
        orm_mode = True

#custom schema for Purchase Order Details read, including supplier_item_id
class PurchaseOrderItemReadCustom(BaseModel):
    item_id: int
    sku: str
    item_name: str
    variant: Optional[str] = None
    ordered_qty: int 
    supplier_item_id: Optional[int] = None   
    class ConfigDict:
        orm_mode = True