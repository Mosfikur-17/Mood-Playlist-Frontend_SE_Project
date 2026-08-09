import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import HTTPException, status
from app.database.mongodb import db_manager
from app.models.user import create_user_doc
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse

logger = logging.getLogger("mood_playlist.auth")

# In-memory user fallback database
IN_MEMORY_USERS: Dict[str, Dict[str, Any]] = {
    "alex@moodplaylist.dev": {
        "_id": "usr-demo-1",
        "name": "Alex Rivera",
        "email": "alex@moodplaylist.dev",
        "password_hash": hash_password("password123"),
        "favorite_mood": "Focused",
        "favorite_genre": "Lo-Fi",
        "bio": "Fullstack engineer coding with ambient & lofi beats.",
        "joined_date": "August 2026"
    }
}

def format_user_response(user_doc: Dict[str, Any]) -> UserResponse:
    u_id = str(user_doc.get("_id", "usr-1"))
    return UserResponse(
        id=u_id,
        name=user_doc.get("name", "Demo User"),
        email=user_doc.get("email", "demo@moodplaylist.dev"),
        favorite_mood=user_doc.get("favorite_mood", "Focused"),
        favorite_genre=user_doc.get("favorite_genre", "Lo-Fi"),
        bio=user_doc.get("bio", "Music-powered developer."),
        joined_date=user_doc.get("created_at") or user_doc.get("joined_date") or "August 2026"
    )

class AuthService:
    @staticmethod
    async def register(payload: UserRegisterRequest) -> TokenResponse:
        """Registers a new user and returns JWT token."""
        email_clean = payload.email.lower().strip()

        # Check existing in MongoDB
        if db_manager.is_connected and db_manager.db is not None:
            try:
                existing = db_manager.db.users.find_one({"email": email_clean})
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="User with this email already exists."
                    )
            except HTTPException:
                raise
            except Exception as e:
                logger.warning(f"Error querying user in MongoDB: {e}")

        # Check in memory fallback
        if email_clean in IN_MEMORY_USERS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )

        hashed = hash_password(payload.password)
        doc = create_user_doc(name=payload.name, email=email_clean, password_hash=hashed)

        if db_manager.is_connected and db_manager.db is not None:
            try:
                res = db_manager.db.users.insert_one(doc)
                doc["_id"] = str(res.inserted_id)
            except Exception as e:
                logger.warning(f"Error inserting user into MongoDB: {e}")
                doc["_id"] = f"usr-{int(datetime.now(timezone.utc).timestamp())}"
                IN_MEMORY_USERS[email_clean] = doc
        else:
            doc["_id"] = f"usr-{int(datetime.now(timezone.utc).timestamp())}"
            IN_MEMORY_USERS[email_clean] = doc

        user_resp = format_user_response(doc)
        token = create_access_token({"sub": user_resp.id, "email": user_resp.email})
        return TokenResponse(access_token=token, user=user_resp)

    @staticmethod
    async def login(payload: UserLoginRequest) -> TokenResponse:
        """Authenticates a user and returns JWT token."""
        email_clean = payload.email.lower().strip()
        user_doc: Optional[Dict[str, Any]] = None

        if db_manager.is_connected and db_manager.db is not None:
            try:
                user_doc = db_manager.db.users.find_one({"email": email_clean})
            except Exception as e:
                logger.warning(f"Error querying user in MongoDB during login: {e}")

        if not user_doc:
            user_doc = IN_MEMORY_USERS.get(email_clean)

        if not user_doc or not verify_password(payload.password, user_doc.get("password_hash", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password credentials."
            )

        user_resp = format_user_response(user_doc)
        token = create_access_token({"sub": user_resp.id, "email": user_resp.email})
        return TokenResponse(access_token=token, user=user_resp)

    @staticmethod
    async def get_current_user(user_id: str) -> Optional[UserResponse]:
        """Gets user profile by ID."""
        if db_manager.is_connected and db_manager.db is not None:
            try:
                query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
                user_doc = db_manager.db.users.find_one(query)
                if user_doc:
                    return format_user_response(user_doc)
            except Exception as e:
                logger.warning(f"Error fetching user from MongoDB: {e}")

        for doc in IN_MEMORY_USERS.values():
            if str(doc.get("_id")) == user_id:
                return format_user_response(doc)

        # Default fallback demo user
        default_user = IN_MEMORY_USERS["alex@moodplaylist.dev"]
        return format_user_response(default_user)

auth_service = AuthService()
