import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from testcontainers.postgres import PostgresContainer
import uuid

@pytest.fixture(scope="session", autouse=True)
def _env_basics():
    os.environ.setdefault("FRONTEND_ORIGIN", "http://localhost:3000")
    os.environ.setdefault("LARK_APP_ID", "test")
    os.environ.setdefault("LARK_APP_SECRET", "test")
    os.environ.setdefault("LARK_SPREADSHEET_ID", "test")
    yield

@pytest.fixture(scope="session", autouse=True)
def _bypass_roles():
    """
    Globally override jwt_utils.require_role to always allow.
    Runs before any tests and before FastAPI app import.
    """
    from server.app.auth import jwt_utils

    def _always_allow(_role: str):
        # return a no-op dependency
        return Depends(lambda: None)

    jwt_utils.require_role = _always_allow
    yield
    
@pytest.fixture(scope="session")
def postgre_container_url(_env_basics):
    """
    This function will start a standalone Postgres container and expose a SQLAlchemy-ready URL. 
    """
    with PostgresContainer("postgres:16-alpine") as pg:
        raw = pg.get_connection_url()
        # use psycopg3 driver with SQLAlchemy
        sa_url = raw.replace("postgresql://", "postgresql+psycopg://", 1)
        os.environ["DATABASE_URL"] = sa_url
        yield sa_url
        
@pytest.fixture(scope="session")
def engine(postgre_container_url):
    engine = create_engine(
        postgre_container_url, 
        pool_pre_ping=True,
        future=True
    )
    return engine

@pytest.fixture(scope="session", autouse=True)
def create_schema(engine):
    # putting the import here so it uses the newly generated postgresql url
    from server.database.database import Base
    import server.database.models
    from server.database.models.user import User
    from server.database.models.item import Item

    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def get_test_db(engine):
    """
    Used on a per test basis, create new session for each test. 
    """
    TestSessionLocal = sessionmaker(
        bind=engine, 
        autocommit=False,
        autoflush=False,
        future=True
    )
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()
        
@pytest.fixture(scope="session")
def app_with_overrides(engine):
    from fastapi import FastAPI
    from sqlalchemy.orm import sessionmaker
    from server.database.database import get_db
    from server.api.v1.router import router as v1_router
    
    app = FastAPI()
    app.include_router(
        v1_router
    )
    
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)

    def _override_get_db():
        s = SessionLocal()
        try:
            yield s
        finally:
            s.close()

    app.dependency_overrides[get_db] = _override_get_db
    
    return app

@pytest.fixture
def client(app_with_overrides):
    from fastapi.testclient import TestClient
    return TestClient(app_with_overrides)

@pytest.fixture
def create_user(get_test_db):
    from server.database.models.user import User
    def _create_user(
        name="Test User",
        email=None,
        role="admin",
        password_hash="$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO",
    ):
        # unique email each call
        email = email or f"test+{uuid.uuid4().hex[:8]}@example.com"
        u = User(name=name, email=email, role=role, password_hash=password_hash)
        get_test_db.add(u)
        get_test_db.commit()
        get_test_db.refresh(u)
        return u
    return _create_user