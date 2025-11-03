from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

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

    class ConfigDict:
        orm_mode = True
        
class SupplierSearchByItems(BaseModel):
    item_ids: List[int] = Field(..., min_length=1, description="A list of item IDs to search for.")

