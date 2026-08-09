from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

def create_playlist_doc(
    name: str,
    mood: str,
    videos: List[Dict[str, Any]],
    user_id: Optional[str] = None,
    description: Optional[str] = None,
    genre: str = "Lo-Fi",
    accent: str = "focus",
    cover_color: Optional[str] = None,
    tags: Optional[List[str]] = None
) -> Dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "user_id": user_id or "demo_user",
        "name": name,
        "mood": mood.lower(),
        "genre": genre,
        "description": description or f"A curated {mood} coding playlist.",
        "tracks_count": len(videos),
        "duration": f"{len(videos) * 4}m",
        "accent": accent,
        "cover_color": cover_color or "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        "tags": tags or [mood.capitalize(), genre],
        "videos": videos,
        "created_at": now,
        "updated_at": now
    }
