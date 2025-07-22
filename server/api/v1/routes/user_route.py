from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database.services import get_all_users

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return get_all_users(db)

