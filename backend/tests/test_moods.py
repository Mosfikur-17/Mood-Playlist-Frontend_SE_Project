from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_mood_session_history_and_latest():
    create = client.post("/api/moods", json={
        "mood": "focused",
        "intensity": 8,
        "playlist": "Deep Focus",
        "duration": "45 min"
    })
    assert create.status_code == 201
    assert create.json()["mood"] == "Focused"

    history = client.get("/api/moods/history")
    assert history.status_code == 200
    assert history.json()[0]["playlist"] == "Deep Focus"

    latest = client.get("/api/moods/latest")
    assert latest.status_code == 200
    assert latest.json()["intensity"] == 8


def test_invalid_mood_session_is_rejected():
    response = client.post("/api/moods", json={"mood": "unknown"})
    assert response.status_code == 422