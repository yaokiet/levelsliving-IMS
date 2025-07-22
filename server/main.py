from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    print("WARNING: DATABASE_URL environment variable not set. Using a default for local testing.")
    DATABASE_URL = "postgresql://postgres:password@db:5432/levelsliving"

    # If you want it to fail if not set, uncomment the next line:
    # raise ValueError("DATABASE_URL environment variable not set. Please check your .env file or docker-compose.yml.")

from app.database.database import Base, engine
from app.models.models import Item  # or all models

# Create tables on startup
Base.metadata.create_all(bind=engine)

print(f"Connecting to database at: {DATABASE_URL}") # Helps for debugging

engine = create_engine(DATABASE_URL)
Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI setup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import router as v1_router  # ✅ Correct import

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, be specific about origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router) 

@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI! (Running via Docker Compose)"}
