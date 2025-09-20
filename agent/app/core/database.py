from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

# Create directory for SQLite database if it doesn't exist
# For shared database location, ensure the ui/prisma directory exists
if settings.DATABASE_URL.startswith("sqlite"):
    # Extract the path from the SQLite URL
    db_path = settings.DATABASE_URL.replace("sqlite:///", "").replace("sqlite://", "")
    if db_path.startswith("../"):
        # Handle relative path from agent directory
        db_dir = os.path.dirname(os.path.join(os.path.dirname(__file__), "..", "..", db_path))
    else:
        db_dir = os.path.dirname(db_path)
    
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

# SQLite specific engine configuration
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite with FastAPI
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()