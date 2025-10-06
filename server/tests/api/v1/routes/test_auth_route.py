import pytest
import os
import importlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta, timezone


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
def test_refresh_token_ok(client, create_user, get_test_db):
    # 1) Create user
    u = create_user(email="refreshuser@example.com")

    # 2) Login to create the session row
    login_path = client.app.url_path_for("login")          # function name 'login'
    r1 = client.post(login_path, json={"email": u.email, "password": "password"})
    assert r1.status_code == 200, r1.text

    # 3) Read the session row to get the EXACT stored refresh token
    #    Adjust import/model/filters to your project (table/model name may differ)
    from database.models import UserSession  # <- change if your path/name differs

    sess = (
        get_test_db.query(UserSession)
        .filter(UserSession.user_id == u.id)
        .order_by(UserSession.created_at.desc())
        .first()
    )
    assert sess is not None, "Expected a user session row after login"
    stored_refresh = sess.refresh_token
    assert stored_refresh, "Session row has no refresh token stored"

    # 4) Call /refresh with that exact cookie
    refresh_path = client.app.url_path_for("refresh_token")  # function name 'refresh_token'
    r2 = client.post(refresh_path, headers={"Cookie": f"refresh_token={stored_refresh}"})

    # 5) Assert success and new access cookie
    assert r2.status_code == 200, r2.text
    assert r2.json() == {"success": True}
    assert "access_token" in r2.cookies or any(
        h.lower() == "set-cookie" for h in r2.headers.keys()
    )

def test_refresh_failure_no_session(client):
    # Arrange: pick the refresh endpoint
    refresh_path = client.app.url_path_for("refresh_token")

    # Act: call with a bogus refresh_token cookie (no session in DB)
    resp = client.post(refresh_path, headers={"Cookie": "refresh_token=nonexistenttoken"})

    # Assert: we hit the 'if not session:' branch
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid refresh token"

def test_refresh_failure_expired_session(client, create_user, get_test_db):

    # 1. Create user and login to generate session
    user = create_user(email="expiredcase@example.com")
    login_path = client.app.url_path_for("login")
    r1 = client.post(login_path, json={"email": user.email, "password": "password"})
    assert r1.status_code == 200, r1.text

    # 2. Get the session row and force it to be expired
    from database.models import UserSession  # adjust to your model path
    sess = (
        get_test_db.query(UserSession)
        .filter(UserSession.user_id == user.id)
        .order_by(UserSession.id.desc())
        .first()
    )
    assert sess is not None
    sess.expires_at = datetime.now(timezone.utc) - timedelta(minutes=5)
    get_test_db.add(sess)
    get_test_db.commit()

    # 3. Call /refresh with the same refresh token
    refresh_path = client.app.url_path_for("refresh_token")
    resp = client.post(
        refresh_path,
        headers={"Cookie": f"refresh_token={sess.refresh_token}"}
    )

    # 4. Assert: expired branch hit
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid refresh token"
    
def test_refresh_failure_invalid_jwt(client, create_user, get_test_db):
    # 1. Create user and login to create a valid session
    user = create_user(email="invalidjwt@example.com")
    login_path = client.app.url_path_for("login")
    r1 = client.post(login_path, json={"email": user.email, "password": "password"})
    assert r1.status_code == 200, r1.text

    # 2. Fetch the session row from DB
    from database.models import UserSession  # adjust path
    sess = (
        get_test_db.query(UserSession)
        .filter(UserSession.user_id == user.id)
        .order_by(UserSession.id.desc())
        .first()
    )
    assert sess is not None

    # 3. Replace the refresh_token in DB with a non-JWT string
    sess.refresh_token = "not-a-valid-jwt"
    get_test_db.add(sess)
    get_test_db.commit()

    # 4. Call /refresh with that invalid token
    refresh_path = client.app.url_path_for("refresh_token")
    resp = client.post(refresh_path, headers={"Cookie": f"refresh_token={sess.refresh_token}"})

    # 5. Assert: JWT decode fails, so 401 with "Invalid refresh token"
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid refresh token"

# POST /logout
def test_logout_ok(client, create_user, get_test_db):
    # 1. Create user and log them in -> creates a user_session row + cookies
    user = create_user(email="logoutcase@example.com")
    login_path = client.app.url_path_for("login")
    r1 = client.post(login_path, json={"email": user.email, "password": "password"})
    assert r1.status_code == 200, r1.text

    refresh_token = r1.cookies.get("refresh_token")
    assert refresh_token, "Expected refresh_token cookie from login"

    # Ensure session exists in DB
    from database.models import UserSession
    sess = get_test_db.query(UserSession).filter_by(refresh_token=refresh_token).first()
    assert sess is not None

    # 2. Call /logout with the refresh_token cookie
    logout_path = client.app.url_path_for("logout")  # function name is 'logout'
    r2 = client.post(logout_path, headers={"Cookie": f"refresh_token={refresh_token}"})

    # 3. Assert: route succeeded
    assert r2.status_code == 200
    assert r2.json() == {"success": True}

    # 4. Verify session was deleted
    sess_after = get_test_db.query(UserSession).filter_by(refresh_token=refresh_token).first()
    assert sess_after is None
