from fastapi import APIRouter
from app.services.recommendation_service import MOOD_QUERY_MAP

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
