from pydantic import BaseModel
from typing import Literal, Optional, List
from datetime import datetime, date

class UserRead(BaseModel):
    id: int
    name: str
    role: Literal['admin', 'user']
    email: str

    class Config:
        orm_mode = True
