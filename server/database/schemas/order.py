from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .order_item import OrderItemRead
from .item import ItemRead

class OrderBase(BaseModel):
    shopify_order_id: Optional[int] = None
    order_date: datetime
    name: str
    contact: str
    street: str
    unit: Optional[str] = None
    postal_code: str
    status: str

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
    status: Optional[str] = None

class OrderRead(OrderBase):
    order_id: int

    class Config:
        orm_mode = True

# Order with items
class OrderWithItems(BaseModel):
    id: int
    cust_name: str
    order_date: str
    cust_contact: str
    order_qty: int
    status: str
    subRows: List[ItemRead]

    class Config:
        orm_mode = True

# Order with order_items
class OrderWithOrderItems(BaseModel):
    id: int
    cust_name: str
    order_date: str
    cust_contact: str
    order_qty: int
    status: str
    subRows: List[OrderItemRead]

    class Config:
        orm_mode = True