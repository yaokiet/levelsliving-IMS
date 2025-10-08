from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date

from database.schemas.purchase_order_item import PurchaseOrderItemReadCustom, PurchaseOrderItemInput

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

class PurchaseOrderCreateWithItems(BaseModel):
    supplier_id: int
    user_id: Optional[int] = None
    order_date: Optional[datetime] = None
    status: str = "pending"
    po_items: List[PurchaseOrderItemInput] = Field(default_factory=list)

class PurchaseOrderCreateFromCart(BaseModel):
    supplier_id: int = Field(..., gt=0)
    status: Optional[str] = "Pending"
    order_date: date = Field(default_factory=date.today)