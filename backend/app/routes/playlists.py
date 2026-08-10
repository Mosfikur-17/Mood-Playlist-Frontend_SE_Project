from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.schemas.playlist import PlaylistCreateRequest, PlaylistResponse
from app.services.playlist_service import playlist_service
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/playlists", tags=["Playlist Management"])

@router.post("", response_model=PlaylistResponse, status_code=status.HTTP_201_CREATED, summary="Save Playlist")
async def create_playlist(
    payload: PlaylistCreateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Saves a recommended playlist to MongoDB persistence."""
    return await playlist_service.create_playlist(payload, user_id=user_id)

@router.get("", response_model=List[PlaylistResponse], summary="Get Saved Playlists")
async def get_playlists(
    mood: Optional[str] = Query(default=None, description="Filter playlists by mood"),
    user_id: str = Depends(get_current_user_id)
):
    """Retrieves all saved playlists for current user."""
    return await playlist_service.get_playlists(user_id=user_id, mood=mood)

@router.get("/{playlist_id}", response_model=PlaylistResponse, summary="Get Single Playlist")
async def get_playlist_by_id(playlist_id: str, user_id: str = Depends(get_current_user_id)):
    """Retrieves single playlist details by ID."""
    pl = await playlist_service.get_playlist_by_id(playlist_id, user_id=user_id)
    if not pl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playlist not found")
    return pl

@router.delete("/{playlist_id}", status_code=status.HTTP_200_OK, summary="Delete Playlist")
async def delete_playlist(
    playlist_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Deletes a playlist by ID."""
    success = await playlist_service.delete_playlist(playlist_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playlist not found or already deleted")
    return {"status": "success", "message": "Playlist deleted successfully", "id": playlist_id}
