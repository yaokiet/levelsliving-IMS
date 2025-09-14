
BASE_PATH = "/levelsliving/app/api/v1/user"

# GET /
def test_read_users_ok(client, create_user):
    u = create_user(name="TestUser", email="testuser@example.com")

    resp = client.get(f"{BASE_PATH}/")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert isinstance(body, dict)
    assert "data" in body and isinstance(body["data"], list)
    assert "meta" in body and isinstance(body["meta"], dict)
    assert body["meta"].get("page") == 1

    emails = {row.get("email") for row in body["data"]}
    assert u.email in emails

# GET /me

# GET /{user_id}
def test_read_user_ok(client, create_user):
    user = create_user(name="TestUser2")

    response = client.get(f"{BASE_PATH}/{user.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user.id
    assert data["name"] == "TestUser2"
   
#  POST /
def test_create_new_user_ok(client):
    payload = {
        "name": "TestUser3",
        "email": "testuser3@example.com",
        "role": "admin",
        "password": "password"
    }
    resp = client.post(f"{BASE_PATH}/", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "testuser3@example.com"
    assert data["name"] == "TestUser3"

def test_create_new_user_failure(client):
    # Duplicate email should return 400
    payload = {
        "name": "DupUser",
        "email": "dup@example.com",
        "role": "admin",
        "password": "password"
    }
    resp1 = client.post(f"{BASE_PATH}/", json=payload)
    assert resp1.status_code == 200

    resp2 = client.post(f"{BASE_PATH}/", json=payload)
    assert resp2.status_code == 400
    assert resp2.json()["detail"] == "Email already registered"


# PUT /{user_id}
def test_update_existing_user_ok(client, create_user):
    u = create_user(name="OldName", email="old@example.com")

    payload = {"name": "NewName", "email": "old@example.com", "role": u.role}
    resp = client.put(f"{BASE_PATH}/{u.id}", json=payload)

    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == u.id
    assert data["name"] == "NewName"
    assert data["email"] == "old@example.com"

def test_update_existing_user_failure(client):
    # update non existent user
    payload = {"name": "Nobody", "email": "nobody@example.com", "role": "admin"}
    resp = client.put(f"{BASE_PATH}/999999", json=payload)
    assert resp.status_code == 404
    assert resp.json()["detail"] == "User not found"

# DELETE /{user_id}
def test_delete_existing_user_success(client, create_user):
    u = create_user(name="DeleteMe", email="deleteme@example.com")

    resp = client.delete(f"{BASE_PATH}/{u.id}")

    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == u.id
    assert data["email"] == "deleteme@example.com"

    resp2 = client.get(f"{BASE_PATH}/{u.id}")
    assert resp2.status_code == 404

def test_delete_existing_user_failure(client):
    # Delete non-existent user
    resp = client.delete(f"{BASE_PATH}/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "User not found"