from pydantic import BaseModel
from typing import Literal

class UserOut(BaseModel):
    id: int
    name: str
    role: Literal['admin', 'user']
    email: str

    class Config:
        orm_mode = True
