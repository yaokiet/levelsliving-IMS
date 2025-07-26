from database.schemas.auth import AccessTokenData, RefreshTokenData
from datetime import datetime, timedelta, timezone
from app.core.config import SECRET_KEY, ALGORITHM
from jose import jwt

def create_access_token(data: AccessTokenData, expires_delta: int):
    to_encode = data.model_dump()
    expire = datetime.now(timezone.utc) + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: RefreshTokenData, expires_delta: int):
    to_encode = data.model_dump()
    expire = datetime.now(timezone.utc) + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)