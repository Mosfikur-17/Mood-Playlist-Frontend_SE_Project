from fastapi import APIRouter
from app.database.mongodb import db_manager

router = APIRouter(tags=["Health"])

@router.get("/health", summary="System Health Check")
async def health_check():
    """Returns the operational status of backend and MongoDB connectivity."""
    db_connected = db_manager.is_connected
    if not db_connected:
        db_connected = db_manager.connect()

    return {
        "status": "ok",
        "database": "connected" if db_connected else "disconnected",
        "service": "Mood-Driven Coding Playlist Generator API",
        "version": "1.0.0"
    }
