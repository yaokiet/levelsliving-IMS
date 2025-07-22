from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    email = Column(String(254), unique=True, index=True)
    password_hash = Column(String(255))
