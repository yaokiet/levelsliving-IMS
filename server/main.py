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

@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI! (Running via Docker Compose)"}