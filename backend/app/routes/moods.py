from fastapi import APIRouter, Depends, HTTPException, status
from app.services.recommendation_service import MOOD_QUERY_MAP
from app.services.mood_service import mood_service
from app.schemas.mood import MoodSessionCreate, MoodSessionResponse
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/moods", tags=["Mood Catalog"])

@router.get("", summary="Get Supported Moods Catalog")
async def get_moods():
    """Returns catalog of supported developer coding moods and search keywords."""
    catalog = []
    for mood_name, info in MOOD_QUERY_MAP.items():
        catalog.append({
            "name": mood_name.capitalize(),
            "query": info["query"],
            "title": info["title"],
            "description": info["description"]
        })
    return {"moods": catalog}


@router.post("", response_model=MoodSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_mood_session(
    payload: MoodSessionCreate,
    user_id: str = Depends(get_current_user_id)
):
    try:
        return await mood_service.create_session(payload, user_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("/history", response_model=list[MoodSessionResponse])
async def get_mood_history(user_id: str = Depends(get_current_user_id)):
    return await mood_service.get_history(user_id)


@router.get("/latest", response_model=MoodSessionResponse)
async def get_latest_mood(user_id: str = Depends(get_current_user_id)):
    session = await mood_service.get_latest(user_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No mood sessions found")
    return session
