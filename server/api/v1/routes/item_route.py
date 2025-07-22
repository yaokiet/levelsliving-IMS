from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database.services import get_all_items

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
def get_items(db: Session = Depends(get_db)):
    return get_all_items(db)

