from pydantic import BaseModel

class SupplierItemBase(BaseModel):
    item_id: int
    supplier_id: int

class SupplierItemCreate(SupplierItemBase):
    pass

class SupplierItemUpdate(SupplierItemBase):
    pass

class SupplierItemRead(SupplierItemBase):
    id: int

    class Config:
        orm_mode = True