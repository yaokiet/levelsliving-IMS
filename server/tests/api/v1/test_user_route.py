# tests/api/v1/test_user_route.py
from fastapi import FastAPI, APIRouter, Depends
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import declarative_base

Base = declarative_base()
engine = create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def get_test_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/levelsliving/app/api/v1")

@router.get("/users")
def list_users(db: Session = Depends(get_test_db)):
    # dummy response for now
    return []

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_list_users():
    r = client.get("/levelsliving/app/api/v1/users")
    assert r.status_code == 200
    assert r.json() == []
