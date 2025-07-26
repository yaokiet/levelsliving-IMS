from database.schemas.user import UserCreate, UserUpdate
from database.schemas.auth import LoginRequest
from database.models.user import User
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_all_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user: UserCreate):
    if db.query(User).filter(User.email == user.email).first():
        return None

    db_user = User(
        name=user.name,
        role=user.role,
        email=user.email,
        password_hash=bcrypt.hash(user.password) 
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        update_data = user.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["password_hash"] = update_data.pop("password")  # TODO: Hash password before storing
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def verify_user(db: Session, login_request: LoginRequest):
    db_user = db.query(User).filter(User.email == login_request.email).first()
    if not db_user or not bcrypt.verify(login_request.password, db_user.password_hash):
        return None
    return db_user