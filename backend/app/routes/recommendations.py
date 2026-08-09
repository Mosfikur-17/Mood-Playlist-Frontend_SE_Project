from fastapi import APIRouter, Depends
from app.schemas.playlist import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import recommendation_service
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/recommendations", tags=["Recommendation Engine"])

@router.post("/generate", response_model=RecommendationResponse, summary="Generate Mood Playlist Recommendation")
async def generate_recommendation(
    payload: RecommendationRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Generates personalized coding music recommendations based on mood and intensity."""
    return await recommendation_service.generate_recommendation(payload, user_id=user_id)
