from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.youtube import YouTubeSearchResponse
from app.services.youtube_service import youtube_service

router = APIRouter(prefix="/youtube", tags=["YouTube Integration"])

@router.get("/search", response_model=YouTubeSearchResponse, summary="Search YouTube Music for Coding")
async def search_youtube(
    mood: Optional[str] = Query(default="focused", description="Coding mood (focused, happy, relaxed, energetic, sad, stressed)"),
    query: Optional[str] = Query(default=None, description="Custom search query override"),
    max_results: int = Query(default=10, ge=1, le=50, description="Max video results")
):
    """Searches YouTube Data API v3 for coding tracks matching user mood or query."""
    search_q = query or f"{mood} coding music instrumental"
    return await youtube_service.search_videos(query=search_q, mood=mood, max_results=max_results)
