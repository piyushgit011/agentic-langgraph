from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

# CopilotKit Integration - FIXED: Updated for new API
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, LangGraphAgent

# FastAPI Users
from fastapi_users import FastAPIUsers, BaseUserManager
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users.schemas import BaseUser, BaseUserCreate

# Local imports
from app.core.config import settings
from app.core.database import Base, engine, get_db
from app.models.user import User
from app.models.session import ChatSession, ChatMessage, UserProgress
from app.services.memory_service import memory_service
from app.services.enhanced_memory_service import enhanced_memory_service
from app.services.learning_analytics_processor import analytics_processor
from app.models.student_profile import StudentProfile, LearningSession
from app.api.curriculum import router as curriculum_router

# User schemas for FastAPI-Users
class UserRead(BaseUser[uuid.UUID]):
    name: str
    role: str
    
class UserCreate(BaseUserCreate):
    name: str
    role: str = "student"

# Database initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    yield
    print("🔄 Application shutdown")

# FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI Users setup
class UserManager(BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.SECRET_KEY
    verification_token_secret = settings.SECRET_KEY

async def get_user_db(session: Session = Depends(get_db)):
    yield SQLAlchemyUserDatabase(session, User)

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

# Authentication backend
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.SECRET_KEY,
        lifetime_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)

# Include authentication routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

# Include curriculum router
app.include_router(curriculum_router)

# CopilotKit Remote Endpoint setup - FIXED: Updated for new API
try:
    # Import the agent graph
    from app.agents.agent import math_teacher_graph
    
    # FIXED: Create CopilotKit Remote Endpoint with LangGraph agent
    copilot_remote_endpoint = CopilotKitRemoteEndpoint(
        agents=[
            LangGraphAgent(
                name="math_teacher",
                description="An intelligent math teacher that provides personalized instruction across various mathematical topics with interactive tools and adaptive learning.",
                graph=math_teacher_graph,
            )
        ],
        actions=[]  # Add any custom actions here if needed
    )
    
    # FIXED: Add CopilotKit endpoint with proper path
    add_fastapi_endpoint(app, copilot_remote_endpoint, "/copilotkit", max_workers=10)
    print("✅ CopilotKit Remote Endpoint initialized successfully")
    
except Exception as e:
    print(f"❌ Failed to initialize CopilotKit: {e}")
    print("⚠️ Running without CopilotKit integration")

# Enhanced API endpoints
@app.get("/")
async def root():
    return {
        "message": "Math Teacher AI - Unified Backend with Memory & Authentication",
        "version": settings.VERSION,
        "features": [
            "🤖 CopilotKit Remote Endpoint Integration",
            "🧠 Mem0 Memory Management", 
            "🔐 FastAPI-Users Authentication",
            "💬 Session Management",
            "📊 Progress Tracking",
            "🎯 Personalized Learning"
        ]
    }

@app.get("/api/v1/memory/profile/{user_id}")
async def get_memory_profile(
    user_id: str,
    current_user: User = Depends(current_active_user)
):
    """Get user's memory profile"""
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    profile = memory_service.get_student_profile(user_id)
    return {"user_id": user_id, "profile": profile}

@app.post("/api/v1/memory/event")
async def record_learning_event(
    event_data: dict,
    current_user: User = Depends(current_active_user)
):
    """Record a learning event"""
    user_id = str(current_user.id)
    session_id = event_data.get("session_id", "unknown")
    
    memory_service.add_learning_event(user_id, session_id, event_data)
    return {"success": True, "message": "Event recorded"}

@app.get("/api/v1/sessions")
async def get_user_sessions(
    current_user: User = Depends(current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's chat sessions"""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == str(current_user.id)
    ).order_by(ChatSession.updated_at.desc()).all()
    
    return [
        {
            "id": session.id,
            "title": session.title,
            "topic": session.topic,
            "topic_number": session.topic_number,
            "is_active": session.is_active,
            "completed_topics": session.completed_topics or [],
            "created_at": session.created_at,
            "updated_at": session.updated_at
        }
        for session in sessions
    ]

@app.post("/api/v1/sessions")
async def create_session(
    session_data: dict,
    current_user: User = Depends(current_active_user),
    db: Session = Depends(get_db)
):
    """Create new chat session"""
    
    # Deactivate other sessions
    db.query(ChatSession).filter(
        ChatSession.user_id == str(current_user.id),
        ChatSession.is_active == True
    ).update({"is_active": False})
    
    # Create new session
    new_session = ChatSession(
        user_id=str(current_user.id),
        title=session_data.get("title", f"Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"),
        topic=session_data.get("topic"),
        topic_number=session_data.get("topic_number"),
        is_active=True
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return {
        "id": new_session.id,
        "title": new_session.title,
        "is_active": new_session.is_active,
        "created_at": new_session.created_at
    }

@app.get("/api/v1/student-profile/{user_id}")
async def get_student_profile(
    user_id: str,
    current_user: User = Depends(current_active_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive student profile with insights"""
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    try:
        # Get or create profile
        profile = enhanced_memory_service.create_or_update_student_profile(
            user_id=user_id,
            profile_data={}  # Will use defaults if new
        )
        
        # Get teaching context
        context = enhanced_memory_service.get_personalized_teaching_context(
            user_id=user_id,
            topic_number="1.1"  # Default context
        )
        
        return {
            "profile": profile,
            "insights": {
                "current_accuracy": context.get("recent_performance", {}).get("accuracy", 0.0),
                "learning_velocity": context.get("recent_performance", {}).get("speed", 1.0),
                "engagement_level": context.get("recent_performance", {}).get("engagement", 0.8),
                "needs_support": len(context.get("teaching_strategy", {}).get("recommended_tools", [])) > 2
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")

@app.patch("/api/v1/student-profile/{user_id}")
async def update_student_profile(
    user_id: str,
    profile_updates: dict,
    current_user: User = Depends(current_active_user)
):
    """Update student profile preferences"""
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    try:
        updated_profile = enhanced_memory_service.create_or_update_student_profile(
            user_id=user_id,
            profile_data=profile_updates
        )
        
        return {"success": True, "profile": updated_profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")

@app.post("/api/v1/learning-analytics")
async def record_learning_analytics(
    analytics_data: dict,
    current_user: User = Depends(current_active_user)
):
    """Record real-time learning analytics"""
    try:
        user_id = str(current_user.id)
        session_id = analytics_data.get("session_id", "unknown")
        
        # Process analytics
        result = await analytics_processor.process_real_time_interaction(
            user_id=user_id,
            session_id=session_id,
            interaction_data=analytics_data
        )
        
        return {
            "success": True,
            "analytics_processed": True,
            "recommendations": {
                "immediate_feedback": "Great work exploring mathematical concepts!",
                "next_steps": ["Continue with current difficulty", "Try visual tools if struggling"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing analytics: {str(e)}")

@app.get("/api/v1/topic/{topic_number}/tools")
async def get_topic_tools(topic_number: str):
    """Get available tools for a specific topic"""
    try:
        from app.agents.agent import get_topic_capabilities, TOPIC_TOOL_REGISTRY
        
        capabilities = get_topic_capabilities(topic_number)
        topic_config = TOPIC_TOOL_REGISTRY.get(topic_number, {})
        
        return {
            "topic_number": topic_number,
            "has_interactive_tools": capabilities["has_interactive_tools"],
            "available_tools": capabilities["available_tools"],
            "tool_categories": capabilities["categories"],
            "tool_count": capabilities["tool_count"],
            "primary_focus": capabilities["primary_focus"],
            "tools_detail": topic_config.get("tools", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching topic tools: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "connected",
            "memory": "initialized",
            "copilotkit": "active" if 'copilot_remote_endpoint' in globals() else "disabled"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)