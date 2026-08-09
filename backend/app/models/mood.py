from datetime import datetime, timezone
from typing import Dict, Any, Optional

def create_mood_session_doc(mood: str, intensity: int = 5, user_id: Optional[str] = None, playlist_title: Optional[str] = None, duration: str = "45 min") -> Dict[str, Any]:
    return {
        "user_id": user_id or "anonymous",
        "mood": mood.lower(),
        "intensity": intensity,
        "playlist": playlist_title or f"{mood.capitalize()} Coding Session",
        "duration": duration,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
