import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# Load configuration settings
Base = declarative_base()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Session maker for database session handling
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency function to get the database session
def get_db() -> Session:  
    try:
        db = SessionLocal()
    except Exception as e:
        raise e
    try:
        yield db
    finally:
        db.close()
