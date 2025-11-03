from pydantic import BaseModel
from typing import Optional

class ItemComponentBase(BaseModel):
    parent_id: int
    child_id: int
    qty_required: int

class ItemComponentCreate(ItemComponentBase):
    pass

class ItemComponentUpdate(BaseModel):
    qty_required: Optional[int] = None

class ItemComponentRead(ItemComponentBase):
    class ConfigDict:
        orm_mode = True 