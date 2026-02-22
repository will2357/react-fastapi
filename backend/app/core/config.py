"""Application configuration."""

import os

from pydantic_settings import BaseSettings, SettingsConfigDict

env = os.getenv("ENVIRONMENT", "development")
env_file = f".env.{env}"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=env_file,
        case_sensitive=True,
        extra="ignore",
    )

    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FastAPI Backend"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    LOG_LEVEL: str = "INFO"
    LOG_JSON_FORMAT: bool = False
    SECRET_KEY: str = "your-secret-key-change-in-production"
    DATABASE_URL: str = "postgresql://dev:password@localhost:5432/api_dev"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@example.com"
    SMTP_FROM_NAME: str = "App Name"


settings = Settings()
