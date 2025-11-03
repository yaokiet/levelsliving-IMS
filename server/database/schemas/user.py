from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class UserBase(BaseModel):
    name: str
    role: Literal['admin', 'user']
    email: EmailStr

class UserCreate(UserBase):
    password: str  # Plain password for creation

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[Literal['admin', 'user']] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None  # Optional for updates

class UserRead(UserBase):
    id: int

    class ConfigDict:
        orm_mode = True