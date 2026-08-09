import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_playlist_crud_flow():
    # 1. Get initial playlists
    get_res = client.get("/api/playlists")
    assert get_res.status_code == 200
    initial_list = get_res.json()
    assert isinstance(initial_list, list)

    # 2. Create playlist
    create_payload = {
        "title": "Test Focus Playlist",
        "mood": "focused",
        "genre": "Lo-Fi",
        "description": "Integration test playlist",
        "videos": [
            {
                "video_id": "test_v1",
                "title": "Test Track 1",
                "thumbnail": "https://example.com/thumb.jpg",
                "channel_title": "Test Channel",
                "description": "Test description",
                "duration": "3:30",
                "bpm": 70,
                "audio_freq": 220
            }
        ]
    }
    create_res = client.post("/api/playlists", json=create_payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["title"] == "Test Focus Playlist"
    assert created_data["mood"] == "Focused"
    pl_id = created_data["id"]

    # 3. Retrieve single playlist
    single_res = client.get(f"/api/playlists/{pl_id}")
    assert single_res.status_code == 200
    single_data = single_res.json()
    assert single_data["id"] == pl_id

    # 4. Delete playlist
    del_res = client.delete(f"/api/playlists/{pl_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"

    # 5. Verify deletion
    verify_res = client.get(f"/api/playlists/{pl_id}")
    assert verify_res.status_code == 404
