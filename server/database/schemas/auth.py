from pydantic import BaseModel, EmailStr
from typing import Literal

class AuthBase(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(AuthBase):
    pass

class TokenDataBase(BaseModel):
    user_id: int

class AccessTokenData(TokenDataBase):
    role: Literal['admin', 'user']

class RefreshTokenData(TokenDataBase):
    token_id: str