import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from psycopg2.extras import RealDictCursor

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
        
def execute_sql_query(query: str):
    conn = get_db()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            results = cur.fetchall()
            return [dict(row) for row in results]
    finally:
        conn.close()
