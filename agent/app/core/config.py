from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Math Teacher AI - Unified Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database - Using same SQLite file as frontend for data consistency
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///../ui/prisma/dev.db")
    
    # Redis for sessions and Mem0 metadata
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    
    # Qdrant Vector Database
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: Optional[str] = os.getenv("QDRANT_API_KEY")
    QDRANT_COLLECTION_NAME: str = os.getenv("QDRANT_COLLECTION_NAME", "mathteacher_memories")
    QDRANT_VECTOR_SIZE: int = int(os.getenv("QDRANT_VECTOR_SIZE", "1536"))
    
    # Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000"
    ]
    
    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Mem0 Configuration Mode
    MEM0_MODE: str = os.getenv("MEM0_MODE", "local")  # local or cloud
    MEM0_API_KEY: Optional[str] = os.getenv("MEM0_API_KEY")
    MEM0_USER_ID: str = os.getenv("MEM0_USER_ID", "mathteacher_default")
    
    @property
    def MEM0_CONFIG(self) -> dict:
        """Get Mem0 configuration based on mode - Updated for new API"""
        if self.MEM0_MODE == "cloud":
            # Cloud configuration using Mem0 platform
            return {
                "provider": "mem0",
                "config": {
                    "api_key": self.MEM0_API_KEY
                }
            }
        else:
            # Local configuration with Qdrant + Redis - Updated structure
            config = {
                "vector_store": {
                    "provider": "qdrant",
                    "config": {
                        "url": self.QDRANT_URL,
                        "collection_name": self.QDRANT_COLLECTION_NAME,
                    }
                },
                "llm": {
                    "provider": "openai",
                    "config": {
                        "model": "gpt-4o-mini",
                        "temperature": 0.4,
                        "api_key": self.OPENAI_API_KEY
                    }
                },
                "embedder": {
                    "provider": "openai", 
                    "config": {
                        "model": "text-embedding-3-small",
                        "api_key": self.OPENAI_API_KEY
                    }
                },
                "history_db_path": os.path.join(os.path.expanduser("~"), ".mem0", "history.db"),
                "version": "v1.1"
            }
            
            # Add API key if provided
            if self.QDRANT_API_KEY:
                config["vector_store"]["config"]["api_key"] = self.QDRANT_API_KEY
                
            return config
    
    class Config:
        case_sensitive = True
        env_file_encoding = 'utf-8'
        
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [item.strip().strip('"') for item in v.split(',')]
        return v

settings = Settings()