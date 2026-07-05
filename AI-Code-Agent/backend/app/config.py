import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


class Settings:
    app_name: str = os.getenv("APP_NAME", "AI Code Generation Agent")
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")


settings = Settings()
