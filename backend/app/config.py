"""
Configuration management for DeepWork OS
Handles environment variables and application settings
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "DeepWork OS"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./deepwork.db"
    
    # AI Models
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Vector Store
    FAISS_INDEX_PATH: str = "./data/faiss_index"
    VECTOR_DIMENSION: int = 384  # all-MiniLM-L6-v2 dimension
    
    # File Storage
    UPLOAD_DIR: str = "./data/uploads"
    PDF_DIR: str = "./data/pdfs"
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Processing
    MAX_TOKENS: int = 2048
    TEMPERATURE: float = 0.7
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
