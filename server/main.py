# main.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

# load_dotenv() is good practice for local development, even with Docker Compose
# as it allows you to test outside Docker without modifying the code.
load_dotenv()

# When using Docker Compose, the service name 'db' will resolve to the database container's IP.
# We'll set this in the docker-compose.yml, so os.getenv will pick it up.
DATABASE_URL = os.getenv("DATABASE_URL")

# Add a robust check for the DATABASE_URL
if DATABASE_URL is None:
    # Fallback for local development or raise an error if it's critical
    print("WARNING: DATABASE_URL environment variable not set. Using a default for local testing.")
    # IMPORTANT: This fallback should match the user/password/db in docker-compose.yml
    DATABASE_URL = "postgresql://postgres:password@db:5432/levelsliving"

    # If you want it to fail if not set, uncomment the next line:
    # raise ValueError("DATABASE_URL environment variable not set. Please check your .env file or docker-compose.yml.")


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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Corrected import path: If main.py is in the root, and api is a sibling folder,
# then the import should be 'from api.v1.router'.
# If you don't have this structure, remove this line and app.include_router(v1_router)
# and just have a simple route for testing.
from api.v1.router import router as v1_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router) # Keep this if you have the router structure

# Optional: Add a simple root endpoint to test if FastAPI is running
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI! (Running via Docker Compose)"}

# We no longer need the __name__ == "__main__" block
# because Docker's CMD will handle running Uvicorn.
