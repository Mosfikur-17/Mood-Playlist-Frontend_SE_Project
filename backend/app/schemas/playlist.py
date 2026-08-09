from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.youtube import YouTubeVideoItem

class RecommendationRequest(BaseModel):
    mood: str = Field(..., description="Target coding mood (focused, happy, relaxed, energetic, sad, stressed)")
    intensity: Optional[int] = Field(default=5, ge=1, le=10)
    task: Optional[str] = Field(default="Coding")
    ambient: Optional[str] = Field(default="off")

class RecommendationResponse(BaseModel):
    mood: str
    query: str
    playlist_title: str
    description: str
    videos: List[YouTubeVideoItem]

class PlaylistCreateRequest(BaseModel):
    title: str
    mood: str
    genre: Optional[str] = "Lo-Fi"
    description: Optional[str] = None
    videos: List[YouTubeVideoItem] = []
    accent: Optional[str] = "focus"
    cover_color: Optional[str] = None
    tags: Optional[List[str]] = []

class PlaylistResponse(BaseModel):
    id: str
    user_id: str
    title: str
    mood: str
    genre: str
    description: str
    tracks: int
    duration: str
    accent: str
    cover_color: str
    tags: List[str]
    videos: List[YouTubeVideoItem]
    created_at: str
