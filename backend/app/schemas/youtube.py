from pydantic import BaseModel, Field
from typing import Optional, List

class YouTubeVideoItem(BaseModel):
    video_id: str = Field(..., min_length=1, max_length=100, pattern=r"^[A-Za-z0-9_-]+$")
    title: str = Field(..., min_length=1, max_length=500)
    thumbnail: str = Field(default="", max_length=2000)
    channel_title: str = Field(default="YouTube Music", max_length=200)
    description: Optional[str] = ""
    duration: Optional[str] = "3:45"
    bpm: Optional[int] = 72
    audio_freq: Optional[int] = 220

class YouTubeSearchResponse(BaseModel):
    query: str
    mood: Optional[str] = None
    total_results: int
    videos: List[YouTubeVideoItem]
