from typing import Optional
from pydantic import BaseModel

class SupplierItemBase(BaseModel):
    item_id: int
    supplier_id: int
    si_sku: Optional[str] = None

class SupplierItemCreate(SupplierItemBase):
    pass

class SupplierItemUpdate(BaseModel):
    si_sku: Optional[str] = None
    

class SupplierItemRead(SupplierItemBase):
    id: int

    class Config:
        orm_mode = True