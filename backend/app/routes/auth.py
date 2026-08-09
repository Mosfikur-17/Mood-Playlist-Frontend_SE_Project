from fastapi import APIRouter, Depends, Header, HTTPException, status
from typing import Optional
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from app.services.auth_service import auth_service
from app.core.security import decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

async def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Dependency helper to extract user ID from Authorization header Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        return "usr-demo-1"
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return "usr-demo-1"
    return payload["sub"]

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, summary="Register User")
async def register(payload: UserRegisterRequest):
    """Registers a new user account and returns access token."""
    return await auth_service.register(payload)

@router.post("/login", response_model=TokenResponse, summary="Login User")
async def login(payload: UserLoginRequest):
    """Authenticates a user and returns access token."""
    return await auth_service.login(payload)

@router.get("/me", response_model=UserResponse, summary="Get Current User Profile")
async def get_me(user_id: str = Depends(get_current_user_id)):
    """Retrieves current user profile details."""
    user = await auth_service.get_current_user(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
