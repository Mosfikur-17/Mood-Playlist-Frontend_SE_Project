import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_generate_recommendation():
    payload = {
        "mood": "focused",
        "intensity": 8
    }
    response = client.post("/api/recommendations/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mood"] == "Focused"
    assert "query" in data
    assert "videos" in data
    assert len(data["videos"]) > 0

def test_generate_recommendation_invalid_mood():
    # Service falls back gracefully to focused
    payload = {
        "mood": "unknown_mood_string",
        "intensity": 5
    }
    response = client.post("/api/recommendations/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["videos"]) > 0
