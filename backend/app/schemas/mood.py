from pydantic import BaseModel, Field
from typing import Optional

class MoodSessionCreate(BaseModel):
    mood: str = Field(..., min_length=2, max_length=30)
    intensity: Optional[int] = Field(default=5, ge=1, le=10)
    playlist: Optional[str] = None
    duration: Optional[str] = "45 min"

class MoodSessionResponse(BaseModel):
    id: str
    mood: str
    intensity: int
    playlist: str
    duration: str
    date: str
