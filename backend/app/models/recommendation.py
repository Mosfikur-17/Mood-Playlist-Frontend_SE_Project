from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

def create_recommendation_doc(
    mood: str,
    query: str,
    video_ids: List[str],
    user_id: Optional[str] = None,
    intensity: int = 5
) -> Dict[str, Any]:
    return {
        "user_id": user_id or "anonymous",
        "mood": mood.lower(),
        "intensity": intensity,
        "query": query,
        "video_ids": video_ids,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
