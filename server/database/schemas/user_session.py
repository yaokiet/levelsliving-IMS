from pydantic import BaseModel
from datetime import datetime

class UserSessionBase(BaseModel):
    user_id: int
    refresh_token: str

class UserSessionCreate(UserSessionBase):
    pass