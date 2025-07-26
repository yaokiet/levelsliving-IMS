from pydantic import BaseModel, EmailStr
from typing import Optional

class SupplierBase(BaseModel):
    name: str
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    contact_number: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    contact_number: Optional[str] = None

class SupplierRead(SupplierBase):
    id: int

    class Config:
        orm_mode = True