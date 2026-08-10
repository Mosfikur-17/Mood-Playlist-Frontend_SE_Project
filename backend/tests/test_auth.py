from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register_login_and_me():
    email = "integration-user@moodplaylist.dev"
    register = client.post("/api/auth/register", json={
        "name": "Integration User",
        "email": email,
        "password": "password123"
    })
    assert register.status_code == 201
    token = register.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    login = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    assert login.status_code == 200
    assert login.json()["user"]["email"] == email

    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["email"] == email


def test_invalid_token_is_rejected():
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401