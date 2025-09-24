from server.database.schemas.user import UserCreate, UserUpdate
from server.database.schemas.auth import LoginRequest
from server.database.models.user import User
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from typing import Optional, List
from sqlalchemy import Integer, String, or_, func
from typing import Optional, Dict, Any, List, Iterable

from server.database.services.pagination import build_meta
from server.database.services.pagination import (
    clamp_page_size,
    parse_sort,
    build_meta,
)

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_all_users(
    db: Session,
    page: int = 1,
    size: int = 50,
    *,
    q: Optional[str] = None, 
    search_columns: Optional[List[str]] = None, 
    sort: Optional[Iterable[str]] = None,  # e.g. ["name:asc","email:desc"]
    include_total: bool = False,
    max_page_size: int = 200,
) -> Dict[str, Any]:
    """
    Return a filtered page of users, with meta, matching the style of list_orders_with_items.
    """
    page, size = clamp_page_size(page, size, max_page_size=max_page_size)

    base = db.query(User)

    # Search filter
    SEARCHABLE_COLUMNS = {"id", "name", "email", "role"}

    if q and search_columns:
        like = f"%{q.strip()}%"
        filters = []
        for col in search_columns:
            if col in SEARCHABLE_COLUMNS and hasattr(User, col):
                column = getattr(User, col)
                if hasattr(column, "type"):
                    if isinstance(column.type, String):
                        filters.append(column.ilike(like))
                    elif isinstance(column.type, Integer) and q.isdigit():
                        filters.append(column == int(q))
        if filters:
            base = base.filter(or_(*filters))

    # Sort (whitelisted)
    allowed = {
        "id": User.id,
        "name": User.name,
        "email": User.email,
        "role": User.role,
    }
    # Remove None values from allowed
    allowed = {k: v for k, v in allowed.items() if v is not None}
    order_by = parse_sort(sort, allowed, [User.name.asc(), User.id.asc()])

    # Optional exact totals
    total = pages = None
    if include_total:
        total = db.query(func.count()).select_from(base.subquery()).scalar() or 0
        pages = max(1, (total + size - 1) // size)

    # Fetch page (size+1 → has_next)
    rows: List[User] = (
        base.order_by(*order_by)
            .limit(size + 1)
            .offset((page - 1) * size)
            .all()
    )
    has_next = len(rows) > size
    users = rows[:size]

    # Shape payload
    data: List[Dict[str, Any]] = []
    for user in users:
        data.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        })

    meta = build_meta(
        page=page,
        size=size,
        has_prev=page > 1,
        has_next=has_next,
        sort_tokens=sort,
        filters={"q": q, "search_columns": search_columns},
        total=total,
        pages=pages,
    )
    return {"meta": meta, "data": data}

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