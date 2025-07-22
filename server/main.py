
from starlette.middleware.sessions import SessionMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import router as v1_router  # ✅ Correct import

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="estabsecret", session_cookie="session_id", max_age=3600)

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
