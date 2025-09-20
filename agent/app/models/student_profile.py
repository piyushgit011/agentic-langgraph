"""
Enhanced Student Profile Model with Learning Analytics
"""
from sqlalchemy import Column, String, DateTime, Boolean, Text, JSON, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
from enum import Enum
from dataclasses import dataclass
from typing import Dict, List, Optional, Any
from datetime import datetime

class LearningStyle(str, Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    READING_WRITING = "reading_writing"
    ADAPTIVE = "adaptive"  # Add the missing ADAPTIVE value

class DifficultyPreference(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    ADAPTIVE = "adaptive"

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Basic Profile Information
    learning_style = Column(String(20), default=LearningStyle.ADAPTIVE.value)
    preferred_difficulty = Column(String(10), default=DifficultyPreference.ADAPTIVE.value)
    learning_pace = Column(String(10), default="medium")  # slow, medium, fast
    attention_span_minutes = Column(Integer, default=30)
    
    # Learning Preferences
    prefers_visual_tools = Column(Boolean, default=True)
    prefers_step_by_step = Column(Boolean, default=True)
    prefers_immediate_feedback = Column(Boolean, default=True)
    prefers_gamification = Column(Boolean, default=False)
    
    # Performance Metrics
    overall_accuracy = Column(Float, default=0.0)
    total_problems_solved = Column(Integer, default=0)
    total_study_time_minutes = Column(Integer, default=0)
    consecutive_correct_streak = Column(Integer, default=0)
    current_level = Column(String(10), default="beginner")
    
    # Learning Patterns (JSON stored data)
    topic_performance = Column(JSON, default={})  # {"1.1": {"accuracy": 0.85, "time_spent": 120}}
    learning_patterns = Column(JSON, default={})  # Detailed behavior patterns
    struggle_areas = Column(JSON, default=[])     # Topics/concepts where student struggles
    strength_areas = Column(JSON, default=[])    # Topics/concepts where student excels
    
    # Engagement Metrics
    session_frequency = Column(Float, default=0.0)  # sessions per week
    average_session_duration = Column(Integer, default=0)  # minutes
    tool_usage_preferences = Column(JSON, default={})  # Which tools student uses most
    
    # Adaptive Learning Configuration
    current_difficulty_level = Column(Float, default=0.5)  # 0-1 scale
    learning_velocity = Column(Float, default=1.0)  # How fast student progresses
    retention_rate = Column(Float, default=0.8)  # How well student retains information
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    last_active_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="student_profile")
    learning_sessions = relationship("LearningSession", back_populates="student_profile")


class LearningSession(Base):
    __tablename__ = "learning_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_profile_id = Column(String, ForeignKey("student_profiles.id"), nullable=False)
    topic_number = Column(String(10), nullable=False)
    
    # Session Data
    start_time = Column(DateTime, default=func.now())
    end_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=0)
    
    # Performance in this session
    problems_attempted = Column(Integer, default=0)
    problems_correct = Column(Integer, default=0)
    tools_used = Column(JSON, default=[])
    mistakes_made = Column(JSON, default=[])
    
    # Behavioral Analytics
    engagement_score = Column(Float, default=0.0)  # 0-1 scale
    help_requests = Column(Integer, default=0)
    time_on_difficult_problems = Column(Integer, default=0)
    
    # Session Outcome
    mastery_achieved = Column(Boolean, default=False)
    next_recommended_topic = Column(String(10), nullable=True)
    
    # Relationships
    student_profile = relationship("StudentProfile", back_populates="learning_sessions")


@dataclass
class LearningAnalytics:
    """Real-time learning analytics data structure"""
    user_id: str
    session_id: str
    topic_number: str
    
    # Real-time metrics
    current_accuracy: float
    current_speed: float  # problems per minute
    current_engagement: float  # 0-1 scale
    current_difficulty_comfort: float  # 0-1 scale
    
    # Behavioral indicators
    shows_frustration: bool
    asks_for_help_frequently: bool
    prefers_hints_over_struggle: bool
    completes_optional_problems: bool
    
    # Learning effectiveness
    concept_retention: float
    transfer_learning_ability: float  # applies concepts to new problems
    metacognitive_awareness: float  # knows when they don't know
    
    timestamp: datetime