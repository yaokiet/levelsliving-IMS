from fastapi import APIRouter, Depends, HTTPException, HTTPException, Request
from app.auth.jwt_utils import require_role
from sqlalchemy.orm import Session
from database.database import get_db
from database.schemas.user import UserCreate, UserUpdate, UserRead
from database.services.user import get_user, get_all_users, create_user, update_user, delete_user

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/", response_model=list[UserRead], dependencies=[require_role("admin")])
def read_users(db: Session = Depends(get_db)):
    return get_all_users(db)

@router.get("/me", response_model=UserRead)
def get_current_user(request: Request, db: Session = Depends(get_db)):
    user_payload = getattr(request.state, "user", None)
    if not user_payload:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user(db, user_payload["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserRead)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user)
    if new_user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return new_user

@router.put("/{user_id}", response_model=UserRead)
def update_existing_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    updated = update_user(db, user_id, user)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@router.delete("/{user_id}", response_model=UserRead)
def delete_existing_user(user_id: int, db: Session = Depends(get_db)):
    deleted = delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted
