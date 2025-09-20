"""
Enhanced CopilotKit Actions with Student Profile Integration
"""
from copilotkit import Action as CopilotAction
from typing import Dict, Any
from app.services.enhanced_memory_service import enhanced_memory_service
from app.services.learning_analytics_processor import analytics_processor
from app.models.student_profile import LearningAnalytics
from datetime import datetime
import json

async def get_personalized_curriculum_content(
    topic_number: str, 
    user_id: str = None, 
    session_id: str = None
) -> Dict[str, Any]:
    """Get curriculum content personalized to student's profile and learning history"""
    
    # Get personalized teaching context
    teaching_context = enhanced_memory_service.get_personalized_teaching_context(
        user_id=user_id, 
        topic_number=topic_number
    )
    
    # Get base curriculum content
    from curriculum_service import get_curriculum_service
    curriculum = get_curriculum_service()
    topic_info = curriculum.get_topic_summary(topic_number)
    
    if "error" in topic_info:
        return topic_info
    
    # Personalize content based on student profile
    profile = teaching_context["profile"]
    strategy = teaching_context["teaching_strategy"]
    
    # Customize response based on learning style and performance
    personalized_response = {
        **topic_info,
        "personalization": {
            "learning_style": profile.get("learning_style"),
            "recommended_approach": strategy["approach"],
            "difficulty_level": strategy["difficulty_level"],
            "support_level": strategy["support_level"],
            "recommended_tools": strategy["recommended_tools"]
        },
        "adaptive_insights": {
            "student_strengths": teaching_context.get("learning_insights", {}).get("strengths", []),
            "areas_to_focus": teaching_context.get("learning_insights", {}).get("focus_areas", []),
            "estimated_completion_time": _estimate_completion_time(profile),
            "success_probability": teaching_context.get("adaptive_difficulty", {}).get("success_rate", 0.7)
        }
    }
    
    # Record curriculum access
    await analytics_processor.process_real_time_interaction(
        user_id=user_id,
        session_id=session_id or "unknown",
        interaction_data={
            "type": "curriculum_access",
            "topic_number": topic_number,
            "personalized": True,
            "timestamp": datetime.now()
        }
    )
    
    return personalized_response

async def validate_student_work_with_analytics(
    problem: str,
    student_answer: float,
    method: str,
    user_id: str = None,
    session_id: str = None,
    response_time_seconds: float = None
) -> Dict[str, Any]:
    """Enhanced validation with learning analytics and profile updates"""
    
    # Basic validation
    try:
        correct_answer = eval(problem.replace("=", "==").split("==")[0])
        is_correct = abs(student_answer - correct_answer) < 0.01
        
        # Process real-time analytics
        analytics = await analytics_processor.process_real_time_interaction(
            user_id=user_id,
            session_id=session_id or "unknown",
            interaction_data={
                "type": "problem_solution",
                "problem": problem,
                "student_answer": student_answer,
                "correct_answer": correct_answer,
                "method": method,
                "is_correct": is_correct,
                "response_time": response_time_seconds,
                "timestamp": datetime.now()
            }
        )
        
        # Generate personalized feedback based on analytics
        feedback = _generate_personalized_feedback(analytics, is_correct, method)
        
        # Update student profile
        profile_updates = {
            "last_active_at": datetime.now(),
            "total_problems_solved": "+1",  # Increment
        }
        
        if is_correct:
            profile_updates["consecutive_correct_streak"] = "+1"
        else:
            profile_updates["consecutive_correct_streak"] = 0
        
        return {
            "is_correct": is_correct,
            "feedback": feedback,
            "analytics_insights": {
                "current_accuracy": analytics.current_accuracy,
                "learning_velocity": analytics.current_speed,
                "engagement_level": analytics.current_engagement,
                "needs_support": analytics.shows_frustration,
            },
            "personalized_recommendations": _get_next_step_recommendations(analytics),
            "correct_answer": correct_answer if not is_correct else None
        }
        
    except Exception as e:
        return {
            "is_correct": False,
            "feedback": "I had trouble understanding that problem. Can you try again?",
            "error": str(e)
        }

async def get_student_progress_dashboard(user_id: str) -> Dict[str, Any]:
    """Get comprehensive student progress dashboard"""
    
    # Get learning progress report
    progress_report = enhanced_memory_service.get_learning_progress_report(
        user_id=user_id,
        time_period_days=30
    )
    
    # Get recent session data
    recent_sessions = await analytics_processor.get_recent_sessions(user_id, limit=10)
    
    return {
        "student_profile": progress_report["profile_snapshot"],
        "learning_progress": progress_report["progress_analysis"],
        "achievements": progress_report["achievements"],
        "improvement_areas": progress_report["areas_for_improvement"],
        "next_goals": progress_report["next_learning_goals"],
        "recent_sessions": recent_sessions,
        "personalization_insights": progress_report["personalization_insights"],
        "dashboard_generated_at": datetime.now().isoformat()
    }

def _generate_personalized_feedback(
    analytics: LearningAnalytics, 
    is_correct: bool, 
    method: str
) -> str:
    """Generate personalized feedback based on learning analytics"""
    
    base_feedback = ""
    
    if is_correct:
        if analytics.current_speed > 1.2:  # Fast learner
            base_feedback = f"🚀 Excellent! You solved that quickly using {method}. "
        else:
            base_feedback = f"✅ Great job! You got it right using {method}. "
        
        if analytics.current_accuracy > 0.85:
            base_feedback += "You're really getting the hang of this! "
        
        if analytics.completes_optional_problems:
            base_feedback += "I love seeing you challenge yourself with extra problems! "
    else:
        if analytics.shows_frustration:
            base_feedback = f"I can see this is challenging. Let's take a step back and try a different approach. "
        else:
            base_feedback = f"Good effort! Let's work through this together. "
        
        if analytics.asks_for_help_frequently:
            base_feedback += "Remember, asking for help shows you're thinking critically about the problem! "
    
    return base_feedback

def _get_next_step_recommendations(analytics: LearningAnalytics) -> List[str]:
    """Get personalized next step recommendations"""
    recommendations = []
    
    if analytics.current_accuracy > 0.9:
        recommendations.append("Try more challenging problems")
        recommendations.append("Explore advanced concepts in this topic")
    elif analytics.current_accuracy < 0.6:
        recommendations.append("Review fundamental concepts")
        recommendations.append("Practice with guided examples")
    
    if analytics.shows_frustration:
        recommendations.append("Take a short break")
        recommendations.append("Try visual learning tools")
    
    if analytics.current_engagement < 0.5:
        recommendations.append("Switch to interactive activities")
        recommendations.append("Try gamified learning approach")
    
    return recommendations

# Enhanced CopilotKit Actions
enhanced_copilot_actions = [
    CopilotAction(
        name="get_personalized_curriculum_content",
        description="Get curriculum content personalized to the student's learning profile and history",
        parameters=[
            {"name": "topic_number", "type": "string", "description": "Topic number (e.g., '1.1')", "required": True},
            {"name": "user_id", "type": "string", "description": "User ID for personalization", "required": False},
            {"name": "session_id", "type": "string", "description": "Session ID for context", "required": False}
        ],
        handler=get_personalized_curriculum_content
    ),
    CopilotAction(
        name="validate_student_work_with_analytics",
        description="Validate student's work with learning analytics and personalized feedback",
        parameters=[
            {"name": "problem", "type": "string", "description": "The math problem", "required": True},
            {"name": "student_answer", "type": "number", "description": "Student's answer", "required": True},
            {"name": "method", "type": "string", "description": "Method used to solve", "required": True},
            {"name": "user_id", "type": "string", "description": "User ID", "required": False},
            {"name": "session_id", "type": "string", "description": "Session ID", "required": False},
            {"name": "response_time_seconds", "type": "number", "description": "Time taken to answer", "required": False}
        ],
        handler=validate_student_work_with_analytics
    ),
    CopilotAction(
        name="get_student_progress_dashboard",
        description="Get comprehensive student progress and analytics dashboard",
        parameters=[
            {"name": "user_id", "type": "string", "description": "User ID", "required": True}
        ],
        handler=get_student_progress_dashboard
    )
]