from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from database.schemas.purchase_order_item import PurchaseOrderItemReadCustom

class PurchaseOrderBase(BaseModel):
    supplier_id: Optional[int] = None
    user_id: Optional[int] = None
    order_date: Optional[datetime] = None
    status: Optional[str] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    pass

class PurchaseOrderUpdate(BaseModel):
    supplier_id: Optional[int] = None
    user_id: Optional[int] = None
    order_date: Optional[datetime] = None
    status: Optional[str] = None

class PurchaseOrderRead(PurchaseOrderBase):
    id: int

    class Config:
        orm_mode = True

class PurchaseOrderDetails(BaseModel):
    id: int
    supplier_id: Optional[int] = None
    user_id: Optional[int] = None
    order_date: datetime
    status: str
    supplier_name: Optional[str] = None
    supplier_email: Optional[str] = None
    supplier_phone: Optional[str] = None
    supplier_description: Optional[str] = None
    po_items: List[PurchaseOrderItemReadCustom] = Field(default_factory=list)

    class Config:
        orm_mode = True
