from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time
from decimal import Decimal

class OrderItemBase(BaseModel):
    order_id: int
    item_id: int
    qty_requested: int
    tag: Optional[List[str]] = None
    delivery_date: date
    delivery_time: Optional[time] = None
    team_assigned: Optional[str] = None
    delivered: bool
    custom: Optional[str] = None
    remarks: Optional[str] = None
    value: Decimal

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemUpdate(BaseModel):
    qty_requested: Optional[int] = None
    tag: Optional[List[str]] = None
    delivery_date: Optional[date] = None
    delivery_time: Optional[time] = None
    team_assigned: Optional[str] = None
    delivered: Optional[bool] = None
    custom: Optional[str] = None
    remarks: Optional[str] = None
    value: Optional[Decimal] = None

class OrderItemRead(OrderItemBase):
    class Config:
        orm_mode = True