from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from datetime import date, time
from decimal import Decimal

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

    class ConfigDict:
        orm_mode = True


# Modified fields schemas for front end rendering
class ItemMergedRead(BaseModel):
    """Order with Items' details merged from Item and OrderItem fields """

    # From Item
    item_id: int
    sku: str
    type: str
    item_name: str
    variant: Optional[str] = None

    # From OrderItem
    qty_requested: int
    tag: Optional[List[str]] = None
    delivery_date: date
    delivery_time: Optional[time] = None
    team_assigned: Optional[str] = None
    custom: Optional[str] = None
    remarks: Optional[str] = None
    value: Decimal  

    class ConfigDict:
        orm_mode = True


class OrderDetails(BaseModel):
    """Order header + total_value + list of ItemMergedRead."""
    id: int
    cust_name: str
    order_date: str
    cust_contact: str
    order_qty: int
    status: str
    total_value: Decimal
    subRows: List[ItemMergedRead]

    class ConfigDict:
        orm_mode = True