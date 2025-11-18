from datetime import datetime, date
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from database.schemas.purchase_order_item import PurchaseOrderItemReadCustom, PurchaseOrderItemInput


class PurchaseOrderStatus(str, Enum):
    PENDING = "Pending"
    REJECTED = "Rejected"
    CONFIRMED = "Confirmed"

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

    class ConfigDict:
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

    class ConfigDict:
        orm_mode = True

class PurchaseOrderCreateWithItems(BaseModel):
    supplier_id: int
    user_id: Optional[int] = None
    order_date: Optional[datetime] = None
    status: PurchaseOrderStatus = PurchaseOrderStatus.PENDING
    po_items: List[PurchaseOrderItemInput] = Field(default_factory=list)

class PurchaseOrderCreateFromCart(BaseModel):
    supplier_id: int = Field(..., gt=0)
    status: Optional[PurchaseOrderStatus] = PurchaseOrderStatus.PENDING
    order_date: date = Field(default_factory=date.today)

class PurchaseOrderStatusUpdate(BaseModel):
    status: PurchaseOrderStatus