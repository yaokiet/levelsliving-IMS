from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import router as v1_router
from app.auth.auth_middleware import AuthMiddleware 
import os
import logging
from dotenv import load_dotenv
from database.database import Base, engine

load_dotenv()
frontend_origin = os.getenv("FRONTEND_ORIGIN")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(AuthMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],  # In production, be specific about origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router) 

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Application starting up...")
    
    # Sync existing data to Google Sheets if enabled
    try:
        from config import settings
        if settings.GOOGLE_SHEETS_ENABLED:
            logger.info("Google Sheets sync is enabled. Starting initial data sync...")
            from sync_existing_data import main as sync_main
            sync_main()
        else:
            logger.info("Google Sheets sync is disabled. Skipping initial data sync.")
    except Exception as e:
        logger.warning(f"Could not run Google Sheets sync on startup: {e}")

@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI! (Running via Docker Compose)"}