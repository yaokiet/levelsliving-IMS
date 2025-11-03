from database.schemas.auth import AccessTokenData, RefreshTokenData
from fastapi import Depends, HTTPException, status, Request
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

def require_role(required_role: str):
    def role_checker(request: Request):
        user = getattr(request.state, "user", None)
        if not user or user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
    return Depends(role_checker)