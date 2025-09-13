import pytest
from sqlalchemy.orm import Session

from server.database.database import Base
from server.database import models  # <-- ensure models are registered
from server.database.models import User

# Try to use your real password hasher if you have one; otherwise fall back to passlib.
try:
    # adjust path to wherever your real hasher lives
    from server.auth.security import get_password_hash  # e.g. your app's function
except Exception:
    from passlib.context import CryptContext
    _pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def get_password_hash(p: str) -> str:
        return _pwd.hash(p)

@pytest.fixture()
def two_users(db_session: Session):
    """Create two users in the test DB and return them."""
    u1 = User(
        email="alice@example.com",
        hashed_password=get_password_hash("alicepw"),
        # adjust field names as needed:
        role="ADMIN",
        is_active=True,
    )
    u2 = User(
        email="bob@example.com",
        hashed_password=get_password_hash("bobpw"),
        role="USER",
        is_active=True,
    )
    db_session.add_all([u1, u2])
    db_session.commit()
    db_session.refresh(u1)
    db_session.refresh(u2)
    return u1, u2
