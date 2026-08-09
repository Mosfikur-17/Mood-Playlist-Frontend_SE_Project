import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.mongodb import db_manager
from app.routes import health, auth, youtube, recommendations, playlists, moods

# Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("mood_playlist")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Lifespan Context Manager for startup/shutdown events."""
    logger.info("Initializing FastAPI Backend Services...")
    db_manager.connect()
    yield
    logger.info("Shutting down FastAPI Backend Services...")
    db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Mood-Driven Coding Playlist Generator powered by FastAPI, MongoDB & YouTube Data API v3.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An internal server error occurred. Please try again later.",
            "path": request.url.path
        }
    )

# Include Routers under /api Prefix
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(youtube.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(playlists.router, prefix="/api")
app.include_router(moods.router, prefix="/api")

# Root Endpoint Redirect/Summary
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Mood-Driven Coding Playlist Generator API",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", settings.PORT))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
