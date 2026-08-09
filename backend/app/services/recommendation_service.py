import logging
from typing import Dict, Any, Optional
from app.services.youtube_service import youtube_service
from app.schemas.playlist import RecommendationRequest, RecommendationResponse
from app.database.mongodb import db_manager
from app.models.recommendation import create_recommendation_doc

logger = logging.getLogger("mood_playlist.recommendation")

# Centralized Mood -> Query Mapping
MOOD_QUERY_MAP: Dict[str, Dict[str, str]] = {
    "focused": {
        "query": "lofi coding music instrumental",
        "title": "Deep Focus Coding Flow",
        "description": "Minimal beats and smooth textures for immersive, deep focus development."
    },
    "happy": {
        "query": "upbeat coding music indie",
        "title": "Happy Refactor Flow",
        "description": "Bright, uplifting tracks to keep your coding momentum high."
    },
    "relaxed": {
        "query": "chill ambient coding music",
        "title": "Calm Soundscapes & Code",
        "description": "Soft ambient pads for steady and comfortable development sessions."
    },
    "energetic": {
        "query": "energetic rock electronic coding music",
        "title": "Cyberpunk High Output Energy",
        "description": "Driving electronic synth beats for high-velocity coding and refactoring."
    },
    "sad": {
        "query": "calm relaxing coding music piano",
        "title": "Late Night Solitude Code",
        "description": "Quiet acoustic piano soundscapes for late night coding."
    },
    "stressed": {
        "query": "relaxing study tension relief coding music",
        "title": "Stress Relief & Gentle Focus",
        "description": "Soothing rhythms to reduce tension and gently return to flow state."
    },
    "tired": {
        "query": "relaxing study coding music soft",
        "title": "Restful Study & Code",
        "description": "Low BPM calm melodies to sustain effort when tired."
    }
}

class RecommendationService:
    @staticmethod
    async def generate_recommendation(
        request: RecommendationRequest,
        user_id: Optional[str] = None
    ) -> RecommendationResponse:
        """Generates mood-based playlist recommendation using rule-based recommendation logic."""
        clean_mood = request.mood.lower().strip()
        mapping = MOOD_QUERY_MAP.get(clean_mood, MOOD_QUERY_MAP["focused"])
        query = mapping["query"]

        # Call YouTube Service
        youtube_res = await youtube_service.search_videos(
            query=query,
            mood=clean_mood,
            max_results=8
        )

        # Store recommendation record in MongoDB if available
        if db_manager.is_connected and db_manager.db is not None:
            try:
                rec_doc = create_recommendation_doc(
                    mood=clean_mood,
                    query=query,
                    video_ids=[v.video_id for v in youtube_res.videos],
                    user_id=user_id,
                    intensity=request.intensity or 5
                )
                db_manager.db.recommendations.insert_one(rec_doc)
            except Exception as e:
                logger.warning(f"Failed to log recommendation to MongoDB: {e}")

        return RecommendationResponse(
            mood=clean_mood.capitalize(),
            query=query,
            playlist_title=mapping["title"],
            description=mapping["description"],
            videos=youtube_res.videos
        )

recommendation_service = RecommendationService()
