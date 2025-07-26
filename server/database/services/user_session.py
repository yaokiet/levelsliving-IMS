from database.schemas.user_session import UserSessionCreate
from database.models.user_session import UserSession
from app.core.config import REFRESH_TOKEN_EXPIRE_SECONDS
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

def create_user_session(db: Session, user_session: UserSessionCreate):
    # Store refresh token in DB
    user_session_db = UserSession(
        user_id=user_session.user_id,
        refresh_token=user_session.refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(seconds=REFRESH_TOKEN_EXPIRE_SECONDS)
    )
    db.add(user_session_db)
    db.commit()
    db.refresh(user_session_db)
    return user_session_db

def get_user_session(db: Session, refresh_token: str):
    user_session_db = db.query(UserSession).filter(UserSession.refresh_token == refresh_token).first()
    if not user_session_db:
        return None
    return user_session_db
    
def delete_user_session(db: Session, refresh_token: str):
    user_session_db = db.query(UserSession).filter(UserSession.refresh_token == refresh_token).first()
    if user_session_db:
        db.delete(user_session_db)
        db.commit()
    return user_session_db
