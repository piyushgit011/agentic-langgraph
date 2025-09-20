from copilotkit import Action as CopilotAction
from typing import Dict, Any
from app.services.memory_service import memory_service
from app.core.database import get_db
from app.models.session import ChatSession, UserProgress
from sqlalchemy.orm import Session
import json

async def get_curriculum_content(topic_number: str, user_id: str = None, session_id: str = None) -> Dict[str, Any]:
    """Get curriculum content with personalized context"""
    
    # Mock curriculum data - replace with your actual curriculum service
    curriculum_data = {
        "1.1": {
            "topic_title": "What is Mathematics",
            "unit_title": "Patterns in Mathematics", 
            "content": "Mathematics is the study of numbers, shapes, patterns...",
            "interactive_tools": ["number_line", "calculator", "practice_problems"],
            "key_concepts": ["Numbers", "Operations", "Problem Solving"]
        },
        "1.2": {
            "topic_title": "Patterns in Numbers",
            "unit_title": "Patterns in Mathematics",
            "content": "Mathematical patterns help us understand...",
            "interactive_tools": [],
            "key_concepts": ["Sequences", "Patterns", "Relationships"]
        }
    }
    
    topic_info = curriculum_data.get(topic_number, {})
    
    # Add personalized context if user is provided
    if user_id:
        memories = memory_service.get_contextual_memories(user_id, f"topic {topic_number}")
        topic_info["personalized_context"] = memories[:3]
        
        # Record curriculum access
        memory_service.add_learning_event(
            user_id=user_id,
            session_id=session_id or "unknown",
            event_data={
                "type": "curriculum_access",
                "topic_number": topic_number,
                "action": "get_curriculum_content"
            }
        )
    
    return topic_info

async def validate_student_work(
    problem: str,
    student_answer: float,
    method: str,
    user_id: str = None,
    session_id: str = None
) -> Dict[str, Any]:
    """Validate student work with memory integration"""
    
    # Simple validation logic
    try:
        # Parse and evaluate the problem
        correct_answer = eval(problem.replace("=", "==").split("==")[0])
        is_correct = abs(student_answer - correct_answer) < 0.01
        
        # Record the learning event
        if user_id:
            memory_service.add_learning_event(
                user_id=user_id,
                session_id=session_id or "unknown",
                event_data={
                    "type": "problem_attempt",
                    "problem": problem,
                    "student_answer": student_answer,
                    "correct_answer": correct_answer,
                    "method": method,
                    "is_correct": is_correct,
                    "performance": "excellent" if is_correct else "needs_practice"
                }
            )
        
        if is_correct:
            return {
                "is_correct": True,
                "message": f"🎉 Excellent! You correctly solved {problem} = {student_answer}",
                "encouragement": "Great work! You're mastering these concepts."
            }
        else:
            return {
                "is_correct": False,
                "message": f"Good effort! The correct answer for {problem} is {correct_answer}",
                "hint": "Try breaking down the problem step by step",
                "correct_answer": correct_answer
            }
            
    except Exception as e:
        return {
            "is_correct": False,
            "message": "I had trouble understanding that problem. Can you try again?",
            "error": str(e)
        }

async def mark_topic_completed(
    topic_number: str,
    user_id: str,
    session_id: str,
    performance_score: float = 0.8
) -> Dict[str, Any]:
    """Mark topic as completed with memory and database updates"""
    
    db = next(get_db())
    try:
        # Update database
        progress = db.query(UserProgress).filter(
            UserProgress.user_id == user_id,
            UserProgress.topic_number == topic_number
        ).first()
        
        if progress:
            progress.status = "completed"
            progress.score = int(performance_score * 100)
            progress.completed_at = datetime.now()
        else:
            progress = UserProgress(
                user_id=user_id,
                topic_number=topic_number,
                status="completed",
                score=int(performance_score * 100),
                completed_at=datetime.now()
            )
            db.add(progress)
        
        # Update session completed topics
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            completed_topics = session.completed_topics or []
            if topic_number not in completed_topics:
                completed_topics.append(topic_number)
                session.completed_topics = completed_topics
        
        db.commit()
        
        # Record in memory
        memory_service.add_learning_event(
            user_id=user_id,
            session_id=session_id,
            event_data={
                "type": "topic_completed",
                "topic_number": topic_number,
                "performance_score": performance_score,
                "mastery_level": "high" if performance_score >= 0.8 else "medium"
            }
        )
        
        return {
            "success": True,
            "message": f"🎉 Topic {topic_number} completed with {int(performance_score * 100)}% mastery!",
            "unlocked_features": ["topic_discussion", "advanced_problems"]
        }
        
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Error marking topic completed: {str(e)}"
        }
    finally:
        db.close()

async def get_personalized_recommendations(user_id: str) -> Dict[str, Any]:
    """Get AI-powered personalized learning recommendations"""
    
    profile = memory_service.get_student_profile(user_id)
    
    # Analyze learning patterns
    recommendations = {
        "next_topics": [],
        "study_methods": [],
        "focus_areas": [],
        "motivational_message": ""
    }
    
    # Simple recommendation logic (can be enhanced with AI)
    learning_patterns = profile.get("learning_patterns", [])
    if learning_patterns:
        last_pattern = learning_patterns[0].get("memory", "")
        if "visual" in last_pattern.lower():
            recommendations["study_methods"].append("Use interactive visual tools")
        if "struggle" in last_pattern.lower():
            recommendations["focus_areas"].append("Review previous concepts")
    
    recommendations["motivational_message"] = "Keep up the great work! Every step forward is progress."
    
    return recommendations

# CopilotKit Actions
copilot_actions = [
    CopilotAction(
        name="get_curriculum_content",
        description="Get comprehensive curriculum content for a specific topic",
        parameters=[
            {"name": "topic_number", "type": "string", "description": "Topic number (e.g., '1.1')", "required": True},
            {"name": "user_id", "type": "string", "description": "User ID for personalization", "required": False},
            {"name": "session_id", "type": "string", "description": "Session ID for context", "required": False}
        ],
        handler=get_curriculum_content
    ),
    CopilotAction(
        name="validate_student_work",
        description="Validate student's mathematical work with personalized feedback",
        parameters=[
            {"name": "problem", "type": "string", "description": "The math problem", "required": True},
            {"name": "student_answer", "type": "number", "description": "Student's answer", "required": True},
            {"name": "method", "type": "string", "description": "Method used to solve", "required": True},
            {"name": "user_id", "type": "string", "description": "User ID", "required": False},
            {"name": "session_id", "type": "string", "description": "Session ID", "required": False}
        ],
        handler=validate_student_work
    ),
    CopilotAction(
        name="mark_topic_completed",
        description="Mark a topic as completed for the user",
        parameters=[
            {"name": "topic_number", "type": "string", "description": "Topic number", "required": True},
            {"name": "user_id", "type": "string", "description": "User ID", "required": True},
            {"name": "session_id", "type": "string", "description": "Session ID", "required": True},
            {"name": "performance_score", "type": "number", "description": "Performance score (0-1)", "required": False}
        ],
        handler=mark_topic_completed
    ),
    CopilotAction(
        name="get_personalized_recommendations",
        description="Get personalized learning recommendations for the user",
        parameters=[
            {"name": "user_id", "type": "string", "description": "User ID", "required": True}
        ],
        handler=get_personalized_recommendations
    )
]