import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from bson import ObjectId

from app.database.mongodb import db_manager
from app.schemas.mood import MoodSessionCreate, MoodSessionResponse

logger = logging.getLogger("mood_playlist.moods")

SUPPORTED_MOODS = {"happy", "sad", "angry", "focused", "relaxed", "tired", "energetic", "stressed"}
IN_MEMORY_MOOD_SESSIONS: List[Dict[str, Any]] = []


def _format_session(doc: Dict[str, Any]) -> MoodSessionResponse:
    return MoodSessionResponse(
        id=str(doc.get("_id", "session-unknown")),
        mood=str(doc.get("mood", "focused")).capitalize(),
        intensity=int(doc.get("intensity", 5)),
        playlist=doc.get("playlist", ""),
        duration=doc.get("duration", "45 min"),
        date=str(doc.get("created_at", datetime.now(timezone.utc).isoformat()))
    )


class MoodService:
    @staticmethod
    async def create_session(payload: MoodSessionCreate, user_id: str) -> MoodSessionResponse:
        mood = payload.mood.lower().strip()
        if mood not in SUPPORTED_MOODS:
            raise ValueError(f"Unsupported mood. Choose one of: {', '.join(sorted(SUPPORTED_MOODS))}")
        doc = {
            "user_id": user_id,
            "mood": mood,
            "intensity": payload.intensity or 5,
            "playlist": payload.playlist or "",
            "duration": payload.duration or "45 min",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        if db_manager.is_connected and db_manager.db is not None:
            try:
                result = db_manager.db.mood_sessions.insert_one(doc)
                doc["_id"] = result.inserted_id
                return _format_session(doc)
            except Exception as exc:
                logger.warning("Failed to persist mood session: %s", exc)
        doc["_id"] = f"session-{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        IN_MEMORY_MOOD_SESSIONS.insert(0, doc)
        return _format_session(doc)

    @staticmethod
    async def get_history(user_id: str) -> List[MoodSessionResponse]:
        if db_manager.is_connected and db_manager.db is not None:
            try:
                docs = db_manager.db.mood_sessions.find({"user_id": user_id}).sort("created_at", -1)
                return [_format_session(doc) for doc in docs]
            except Exception as exc:
                logger.warning("Failed to load mood history: %s", exc)
        return [_format_session(doc) for doc in IN_MEMORY_MOOD_SESSIONS if doc.get("user_id") == user_id]

    @staticmethod
    async def get_latest(user_id: str) -> Optional[MoodSessionResponse]:
        history = await MoodService.get_history(user_id)
        return history[0] if history else None


mood_service = MoodService()