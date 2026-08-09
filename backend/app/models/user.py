from datetime import datetime, timezone
from typing import Optional, Dict, Any

def create_user_doc(name: str, email: str, password_hash: str, favorite_mood: str = "Focused", favorite_genre: str = "Lo-Fi") -> Dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "name": name,
        "email": email.lower().strip(),
        "password_hash": password_hash,
        "favorite_mood": favorite_mood,
        "favorite_genre": favorite_genre,
        "bio": "Music-powered developer.",
        "created_at": now,
        "updated_at": now
    }
