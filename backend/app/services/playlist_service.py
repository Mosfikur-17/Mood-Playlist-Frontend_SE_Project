import logging
from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime, timezone
from app.database.mongodb import db_manager
from app.models.playlist import create_playlist_doc
from app.schemas.playlist import PlaylistCreateRequest, PlaylistResponse
from app.schemas.youtube import YouTubeVideoItem

logger = logging.getLogger("mood_playlist.playlists")

# Memory fallback storage when MongoDB is not connected
IN_MEMORY_PLAYLISTS: List[Dict[str, Any]] = [
    {
        "_id": "deep-focus",
        "user_id": "demo_user",
        "name": "Deep Focus",
        "mood": "focused",
        "genre": "Lo-Fi",
        "description": "Minimal beats and calm textures for long coding sessions.",
        "tracks_count": 4,
        "duration": "16m",
        "accent": "focus",
        "cover_color": "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        "tags": ["Focus", "Lo-Fi", "Instrumental"],
        "videos": [
            {
                "video_id": "jfKfPfyJRdk",
                "title": "Midnight Terminal",
                "channel_title": "LoFi Coder",
                "thumbnail": "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
                "description": "Lofi beats for coding",
                "duration": "3:45",
                "bpm": 70,
                "audio_freq": 220
            },
            {
                "video_id": "5qap5aO4i9A",
                "title": "Compiler Pass",
                "channel_title": "Async Waves",
                "thumbnail": "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
                "description": "Chill instrumental lofi",
                "duration": "4:10",
                "bpm": 72,
                "audio_freq": 240
            }
        ],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

def format_playlist_doc(doc: Dict[str, Any]) -> PlaylistResponse:
    videos_raw = doc.get("videos", [])
    videos = [
        YouTubeVideoItem(
            video_id=v.get("video_id", "v1"),
            title=v.get("title", "Track"),
            thumbnail=v.get("thumbnail", ""),
            channel_title=v.get("channel_title", "Channel"),
            description=v.get("description", ""),
            duration=v.get("duration", "3:45"),
            bpm=v.get("bpm", 72),
            audio_freq=v.get("audio_freq", 220)
        )
        for v in videos_raw
    ]
    pl_id = str(doc.get("_id"))
    return PlaylistResponse(
        id=pl_id,
        user_id=str(doc.get("user_id", "demo_user")),
        title=doc.get("name", doc.get("title", "Untitled Playlist")),
        mood=doc.get("mood", "focused").capitalize(),
        genre=doc.get("genre", "Lo-Fi"),
        description=doc.get("description", "Custom coding playlist"),
        tracks=doc.get("tracks_count", len(videos)),
        duration=doc.get("duration", f"{len(videos)*4}m"),
        accent=doc.get("accent", "focus"),
        cover_color=doc.get("cover_color", "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"),
        tags=doc.get("tags", [doc.get("mood", "focused").capitalize(), "Lo-Fi"]),
        videos=videos,
        created_at=doc.get("created_at", datetime.now(timezone.utc).isoformat())
    )

class PlaylistService:
    @staticmethod
    async def create_playlist(payload: PlaylistCreateRequest, user_id: str = "demo_user") -> PlaylistResponse:
        """Creates a new playlist and stores it in MongoDB or memory fallback."""
        doc = create_playlist_doc(
            name=payload.title,
            mood=payload.mood,
            videos=[v.model_dump() for v in payload.videos],
            user_id=user_id,
            description=payload.description,
            genre=payload.genre or "Lo-Fi",
            accent=payload.accent or "focus",
            cover_color=payload.cover_color,
            tags=payload.tags
        )

        if db_manager.is_connected and db_manager.db is not None:
            try:
                res = db_manager.db.playlists.insert_one(doc)
                doc["_id"] = str(res.inserted_id)
                return format_playlist_doc(doc)
            except Exception as e:
                logger.warning(f"Error inserting playlist into MongoDB: {e}")

        # Memory Fallback
        doc["_id"] = f"pl-{int(datetime.now(timezone.utc).timestamp()*1000)}"
        IN_MEMORY_PLAYLISTS.insert(0, doc)
        return format_playlist_doc(doc)

    @staticmethod
    async def get_playlists(user_id: Optional[str] = None, mood: Optional[str] = None) -> List[PlaylistResponse]:
        """Retrieves saved playlists from MongoDB or memory fallback."""
        if db_manager.is_connected and db_manager.db is not None:
            try:
                query: Dict[str, Any] = {}
                if user_id:
                    query["user_id"] = user_id
                if mood and mood.lower() != "all":
                    query["mood"] = mood.lower()
                cursor = db_manager.db.playlists.find(query).sort("created_at", -1)
                docs = list(cursor)
                return [format_playlist_doc(d) for d in docs]
            except Exception as e:
                logger.warning(f"Error fetching playlists from MongoDB: {e}")

        # Memory Fallback filtering
        res = []
        for d in IN_MEMORY_PLAYLISTS:
            if mood and mood.lower() != "all" and d.get("mood", "").lower() != mood.lower():
                continue
            res.append(format_playlist_doc(d))
        return res

    @staticmethod
    async def get_playlist_by_id(playlist_id: str) -> Optional[PlaylistResponse]:
        """Retrieves a single playlist by ID."""
        if db_manager.is_connected and db_manager.db is not None:
            try:
                query = {"_id": ObjectId(playlist_id)} if ObjectId.is_valid(playlist_id) else {"_id": playlist_id}
                doc = db_manager.db.playlists.find_one(query)
                if doc:
                    return format_playlist_doc(doc)
            except Exception as e:
                logger.warning(f"Error fetching playlist by ID from MongoDB: {e}")

        # Memory fallback search
        for d in IN_MEMORY_PLAYLISTS:
            if str(d.get("_id")) == playlist_id:
                return format_playlist_doc(d)
        return None

    @staticmethod
    async def delete_playlist(playlist_id: str, user_id: str = "demo_user") -> bool:
        """Deletes a playlist by ID."""
        if db_manager.is_connected and db_manager.db is not None:
            try:
                query = {"_id": ObjectId(playlist_id)} if ObjectId.is_valid(playlist_id) else {"_id": playlist_id}
                res = db_manager.db.playlists.delete_one(query)
                if res.deleted_count > 0:
                    return True
            except Exception as e:
                logger.warning(f"Error deleting playlist in MongoDB: {e}")

        # Memory fallback
        global IN_MEMORY_PLAYLISTS
        initial_len = len(IN_MEMORY_PLAYLISTS)
        IN_MEMORY_PLAYLISTS = [d for d in IN_MEMORY_PLAYLISTS if str(d.get("_id")) != playlist_id]
        return len(IN_MEMORY_PLAYLISTS) < initial_len

playlist_service = PlaylistService()
