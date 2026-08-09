from pydantic import BaseModel
from typing import Optional, List

class YouTubeVideoItem(BaseModel):
    video_id: str
    title: str
    thumbnail: str
    channel_title: str
    description: Optional[str] = ""
    duration: Optional[str] = "3:45"
    bpm: Optional[int] = 72
    audio_freq: Optional[int] = 220

class YouTubeSearchResponse(BaseModel):
    query: str
    mood: Optional[str] = None
    total_results: int
    videos: List[YouTubeVideoItem]
