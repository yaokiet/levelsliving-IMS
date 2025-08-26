from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PurchaseOrderBase(BaseModel):
    supplier_id: Optional[int] = None
    user_id: Optional[int] = None
    order_date: Optional[datetime] = None  # default can be set in DB

class PurchaseOrderCreate(PurchaseOrderBase):
    pass

class PurchaseOrderUpdate(BaseModel):
    supplier_id: Optional[int] = None
    user_id: Optional[int] = None
    order_date: Optional[datetime] = None

class PurchaseOrderRead(PurchaseOrderBase):
    id: int

    class Config:
        orm_mode = True