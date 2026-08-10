from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.youtube import YouTubeVideoItem

class RecommendationRequest(BaseModel):
    mood: str = Field(..., min_length=2, max_length=30, description="Target coding mood")
    intensity: Optional[int] = Field(default=5, ge=1, le=10)
    task: Optional[str] = Field(default="Coding", max_length=100)
    ambient: Optional[str] = Field(default="off")

class RecommendationResponse(BaseModel):
    mood: str
    query: str
    playlist_title: str
    description: str
    videos: List[YouTubeVideoItem]

class PlaylistCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    mood: str = Field(..., min_length=2, max_length=30)
    genre: Optional[str] = "Lo-Fi"
    description: Optional[str] = None
    videos: List[YouTubeVideoItem] = Field(default_factory=list)
    accent: Optional[str] = "focus"
    cover_color: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)

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
