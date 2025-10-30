import os
from fastapi import APIRouter, HTTPException, Response, Depends, Cookie
from app.auth.jwt_utils import create_access_token, create_refresh_token
from app.core.config import ACCESS_TOKEN_EXPIRE_SECONDS, REFRESH_TOKEN_EXPIRE_SECONDS, SECRET_KEY, ALGORITHM
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database.services.user_session import create_user_session, delete_user_session, get_user_session
from database.services.user import get_user, verify_user
from database.schemas.user_session import UserSessionCreate
from database.schemas.auth import AccessTokenData, RefreshTokenData, LoginRequest
from database.schemas.user import UserRead
from database.database import get_db

import secrets

router = APIRouter()
backend_origin = os.getenv("NEXT_PUBLIC_API_DOMAIN")

@router.post("/login", response_model=UserRead)
async def login(login_request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = verify_user(db, login_request)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_data = AccessTokenData(user_id=user.id, role=user.role)
    refresh_token_data = RefreshTokenData(user_id=user.id, token_id=secrets.token_hex(16))

    access_token = create_access_token(access_token_data, ACCESS_TOKEN_EXPIRE_SECONDS)
    refresh_token = create_refresh_token(
        refresh_token_data,
        REFRESH_TOKEN_EXPIRE_SECONDS
    )

    # Create a user session
    user_session = UserSessionCreate(
        user_id=user.id,
        refresh_token=refresh_token
    )

    user_session = create_user_session(db, user_session)
    if not user_session:
        raise HTTPException(status_code=500, detail="Failed to create user session")

    # Set HTTP-only cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=ACCESS_TOKEN_EXPIRE_SECONDS,
        path="/",
        domain=backend_origin
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=REFRESH_TOKEN_EXPIRE_SECONDS,
        path="/",
        domain=backend_origin
    )
    return user

@router.post("/refresh")
def refresh_token(response: Response, refresh_token: str = Cookie(None), db: Session = Depends(get_db)):
    session = get_user_session(db, refresh_token)
    if not session:
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Ensure expires_at is timezone-aware
    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["user_id"]
    except JWTError:
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # Fetch user from DB to get the role
    user = get_user(db, user_id)
    if not user:
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
        raise HTTPException(status_code=401, detail="User not found")

    access_token_data = AccessTokenData(user_id=user_id, role=user.role)

    # Issue new access token
    access_token = create_access_token(access_token_data, ACCESS_TOKEN_EXPIRE_SECONDS)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=ACCESS_TOKEN_EXPIRE_SECONDS,
        path="/",
        domain=backend_origin
    )
    return {"success": True}

@router.post("/logout")
def logout(response: Response, refresh_token: str = Cookie(None), db: Session = Depends(get_db)):
    session = delete_user_session(db, refresh_token)
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"success": True}
