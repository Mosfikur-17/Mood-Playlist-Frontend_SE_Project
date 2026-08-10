import secrets
from typing import List
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mood-Driven Coding Playlist Generator API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Environment & Server Settings
    PORT: int = Field(default=8000, validation_alias="PORT")
    ENVIRONMENT: str = Field(default="development", validation_alias="ENVIRONMENT")
    FRONTEND_URL: str = Field(default="http://localhost:4200", validation_alias="FRONTEND_URL")

    # Database Settings
    MONGODB_URI: str = Field(default="", validation_alias="MONGODB_URI")
    DATABASE_NAME: str = Field(default="mood_playlist_db", validation_alias="DATABASE_NAME")

    # External APIs
    YOUTUBE_API_KEY: str = Field(default="", validation_alias="YOUTUBE_API_KEY")

    # Security & Auth Settings
    JWT_SECRET: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        validation_alias=AliasChoices("JWT_SECRET_KEY", "JWT_SECRET")
    )
    ALGORITHM: str = Field(default="HS256", validation_alias=AliasChoices("JWT_ALGORITHM", "ALGORITHM"))
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        configured = [origin.strip() for origin in self.FRONTEND_URL.split(",") if origin.strip()]
        if self.ENVIRONMENT != "production":
            configured.extend(["http://localhost:4200", "http://127.0.0.1:4200"])
        return list(dict.fromkeys(configured))

settings = Settings()
