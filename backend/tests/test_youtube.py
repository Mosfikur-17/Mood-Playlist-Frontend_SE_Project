import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_youtube_search_default():
    response = client.get("/api/youtube/search?mood=focused")
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert "videos" in data
    assert len(data["videos"]) > 0
    first_video = data["videos"][0]
    assert "video_id" in first_video
    assert "title" in first_video
    assert "thumbnail" in first_video

def test_youtube_search_custom_mood():
    response = client.get("/api/youtube/search?mood=happy")
    assert response.status_code == 200
    data = response.json()
    assert data["mood"] == "happy"
    assert len(data["videos"]) > 0
