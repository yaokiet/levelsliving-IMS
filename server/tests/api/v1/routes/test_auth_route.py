import pytest
import os
import importlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker

@pytest.fixture(autouse=True, scope="module")
def _restore_real_roles():
    """
    Undo the global role-bypass from the root conftest.py for this module only.
    We reload jwt_utils to get the original require_role back.
    """
    from server.app.auth import jwt_utils
    importlib.reload(jwt_utils)  # restores real require_role
    yield

@pytest.fixture(scope="module")
def app_with_overrides(engine):
    from server.database.database import get_db
    from server.api.v1.router import router as v1_router
    from server.app.auth.auth_middleware import AuthMiddleware

    app = FastAPI()

    # Attach the same middleware as main.py
    frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    app.add_middleware(AuthMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(v1_router)

    # Use the test DB
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
    def _override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = _override_get_db

    return app

@pytest.fixture(scope="module")
def client(app_with_overrides):
    return TestClient(app_with_overrides)
    
BASE_PATH = "/levelsliving/app/api/v1"

# # POST /login
def test_login_ok(client, create_user):
    print([ (r.name, getattr(r, 'path', None)) for r in client.app.routes ])
    user = create_user(email="loginuser@example.com")
    payload = {
        "email": user.email,
        "password": "password",
    }
    resp = client.post(f"{BASE_PATH}/login", json=payload)    
    
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == user.email
    assert "id" in data
    
    cookies = resp.cookies
    assert "access_token" in cookies
    assert "refresh_token" in cookies

def test_login_failure_no_user(client):
    payload = {
        "email": "idontexist@example.com",
        "password": "password",
    }
    resp = client.post(f"{BASE_PATH}/login", json=payload)

    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid credentials"

# POST /refresh
def test_refresh_token_ok(client, create_user):
    # Arrange
    u = create_user(email="refreshuser@example.com")

    # Step 1: login to seed DB session and set cookies
    login_path = client.app.url_path_for("login")            # def name 'login'
    r1 = client.post(login_path, json={"email": u.email, "password": "password"})
    assert r1.status_code == 200, r1.text

    # Persist cookies on the client (access_token + refresh_token)
    client.cookies.update(r1.cookies)

    # Step 2: call /refresh using the same client (cookies included)
    refresh_path = client.app.url_path_for("refresh_token")  # def name 'refresh_token'
    r2 = client.post(refresh_path)

    # Assert
    assert r2.status_code == 200, r2.text
    assert r2.json() == {"success": True}
    # new access token should be set
    assert "access_token" in r2.cookies or any(
        h.lower() == "set-cookie" for h in r2.headers.keys()
    )

def test_refresh_token_failure():
    pass

# # POST /logout
# def test_logout_ok():
#     pass