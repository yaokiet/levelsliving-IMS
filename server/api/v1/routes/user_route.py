from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Optional, List
from app.database.schemas import UserOut
from app.database.services import user_service


router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    return user_service.get_all_users(db)

