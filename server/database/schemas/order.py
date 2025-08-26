from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderBase(BaseModel):
    shopify_order_id: Optional[int] = None
    order_date: datetime
    name: str
    contact: str
    street: str
    unit: Optional[str] = None
    postal_code: str

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    shopify_order_id: Optional[int] = None
    order_date: Optional[datetime] = None
    name: Optional[str] = None
    contact: Optional[str] = None
    street: Optional[str] = None
    unit: Optional[str] = None
    postal_code: Optional[str] = None

class OrderRead(OrderBase):
    order_id: int

    class Config:
        orm_mode = True