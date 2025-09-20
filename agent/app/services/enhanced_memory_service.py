"""
Enhanced Memory Service with Qdrant Vector Database
"""
from mem0 import Memory, MemoryClient
from typing import Dict, List, Any, Optional
from app.core.config import settings
from app.models.student_profile import StudentProfile, LearningSession, LearningAnalytics
from app.core.database import get_db
import json
from datetime import datetime, timedelta
import numpy as np
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

class EnhancedMathTeacherMemoryService:
    def __init__(self):
        # Initialize Mem0 with proper configuration
        try:
            if settings.MEM0_MODE == "cloud" and settings.MEM0_API_KEY:
                logger.info("🌐 Initializing Mem0 with cloud configuration")
                self.memory = MemoryClient(api_key=settings.MEM0_API_KEY)
            else:
                logger.info("🏠 Initializing Mem0 with local configuration")
                # Setup Qdrant collection first if needed
                if settings.MEM0_MODE == "local":
                    try:
                        from app.services.qdrant_setup import qdrant_setup
                        logger.info("🔧 Setting up Qdrant for Mem0...")
                        if qdrant_setup.setup_collection():
                            logger.info("✅ Qdrant setup completed")
                        else:
                            logger.warning("⚠️ Qdrant setup had issues, continuing anyway")
                    except Exception as e:
                        logger.warning(f"⚠️ Qdrant setup error: {e}, using fallback")
                
                # Use from_config method for newer Mem0 API
                self.memory = Memory.from_config(config_dict=settings.MEM0_CONFIG)
            
            logger.info("✅ Enhanced Mem0 initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Enhanced Mem0: {e}")
            # Fallback to basic configuration
            try:
                basic_config = {
                    "vector_store": {
                        "provider": "chroma",
                        "config": {
                            "collection_name": "mathteacher_memories",
                            "path": "./chroma_db"
                        }
                    },
                    "llm": {
                        "provider": "openai",
                        "config": {
                            "model": "gpt-4o-mini",
                            "temperature": 0.4,
                            "api_key": settings.OPENAI_API_KEY
                        }
                    },
                    "version": "v1.1"
                }
                self.memory = Memory.from_config(config_dict=basic_config)
                logger.warning("⚠️ Using basic Mem0 configuration with ChromaDB as fallback")
            except Exception as fallback_error:
                logger.error(f"❌ Even fallback initialization failed: {fallback_error}")
                raise RuntimeError(f"Could not initialize Enhanced Mem0: {fallback_error}")
    
    def create_or_update_student_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update student profile with initial learning preferences"""
        db = next(get_db())
        try:
            profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
            
            if not profile:
                profile = StudentProfile(
                    user_id=user_id,
                    **profile_data
                )
                db.add(profile)
            else:
                for key, value in profile_data.items():
                    if hasattr(profile, key):
                        setattr(profile, key, value)
                profile.updated_at = datetime.now()
            
            db.commit()
            db.refresh(profile)
            
            # Store initial profile in Mem0
            memory_text = self._create_profile_memory_text(profile)
            try:
                self.memory.add(
                    messages=memory_text,
                    user_id=user_id,
                    metadata={
                        "type": "student_profile",
                        "category": "learning_preferences",
                        "profile_id": profile.id,
                        "timestamp": datetime.now().isoformat()
                    }
                )
            except Exception as mem_error:
                logger.warning(f"⚠️ Could not store profile in Mem0: {mem_error}")
            
            return self._profile_to_dict(profile)
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Error creating/updating profile: {e}")
            return {"error": str(e)}
        finally:
            db.close()
    
    def record_learning_interaction(
        self, 
        user_id: str, 
        session_id: str,
        topic_number: str,
        interaction_data: Dict[str, Any],
        analytics: Optional[LearningAnalytics] = None
    ) -> None:
        """Record detailed learning interaction with real-time profile updates"""
        
        try:
            # Store in Mem0 for contextual memory
            memory_text = self._create_interaction_memory_text(interaction_data, analytics)
            self.memory.add(
                messages=memory_text,
                user_id=user_id,
                metadata={
                    "type": "learning_interaction",
                    "session_id": session_id,
                    "topic_number": topic_number,
                    "timestamp": datetime.now().isoformat(),
                    "interaction_type": interaction_data.get("type", "unknown")
                }
            )
            
            # Update structured profile data
            self._update_profile_from_interaction(user_id, topic_number, interaction_data, analytics)
        except Exception as e:
            logger.error(f"❌ Error recording learning interaction: {e}")
    
    def get_personalized_teaching_context(self, user_id: str, topic_number: str) -> Dict[str, Any]:
        """Get comprehensive context for personalized teaching"""
        try:
            # Get profile data
            profile = self._get_student_profile(user_id)
            
            # Get relevant memories from Mem0
            memories_result = self.memory.search(
                query=f"topic {topic_number} learning struggles strengths preferences",
                user_id=user_id,
                limit=10
            )
            
            memories = memories_result.get("results", []) if isinstance(memories_result, dict) else []
            
            # Get recent performance data
            recent_performance = self._get_recent_performance(user_id, topic_number)
            
            # Generate teaching recommendations
            teaching_strategy = self._generate_teaching_strategy(profile, memories, recent_performance)
            
            return {
                "profile": profile,
                "relevant_memories": memories,
                "recent_performance": recent_performance,
                "teaching_strategy": teaching_strategy,
                "adaptive_difficulty": self._calculate_adaptive_difficulty(user_id, topic_number),
                "learning_insights": self._get_learning_insights(user_id)
            }
        except Exception as e:
            logger.error(f"❌ Error getting teaching context: {e}")
            return {
                "profile": {},
                "relevant_memories": [],
                "recent_performance": {},
                "teaching_strategy": {"approach": "standard"},
                "adaptive_difficulty": {"success_rate": 0.7},
                "learning_insights": {},
                "error": str(e)
            }
    
    def track_real_time_analytics(
        self, 
        user_id: str, 
        session_id: str, 
        analytics: LearningAnalytics
    ) -> Dict[str, Any]:
        """Process real-time learning analytics and update profile"""
        
        try:
            # Update Mem0 with behavioral insights
            if analytics.shows_frustration:
                self.memory.add(
                    messages=f"Student showing frustration with {analytics.topic_number}, may need additional support or different approach",
                    user_id=user_id,
                    metadata={
                        "type": "behavioral_insight",
                        "category": "frustration",
                        "topic_number": analytics.topic_number,
                        "intervention_needed": True,
                        "timestamp": datetime.now().isoformat()
                    }
                )
            
            if analytics.current_accuracy > 0.9 and analytics.current_speed > 1.5:
                self.memory.add(
                    messages=f"Student excelling in {analytics.topic_number} with {analytics.current_accuracy:.1%} accuracy at high speed, ready for advanced challenges",
                    user_id=user_id,
                    metadata={
                        "type": "performance_insight",
                        "category": "excellence",
                        "topic_number": analytics.topic_number,
                        "advancement_ready": True,
                        "timestamp": datetime.now().isoformat()
                    }
                )
            
            # Update profile with real-time data
            profile_updates = self._process_analytics_for_profile(analytics)
            if profile_updates:
                self._update_student_profile(user_id, profile_updates)
            
            # Return immediate teaching recommendations
            return {
                "immediate_feedback": self._generate_immediate_feedback(analytics),
                "difficulty_adjustment": self._suggest_difficulty_adjustment(analytics),
                "tool_recommendations": self._recommend_tools(analytics),
                "intervention_needed": analytics.shows_frustration or analytics.current_accuracy < 0.3
            }
        except Exception as e:
            logger.error(f"❌ Error tracking analytics: {e}")
            return {
                "immediate_feedback": "Great work exploring mathematical concepts!",
                "difficulty_adjustment": "continue",
                "tool_recommendations": [],
                "intervention_needed": False,
                "error": str(e)
            }
    
    def get_learning_progress_report(self, user_id: str, time_period_days: int = 30) -> Dict[str, Any]:
        """Generate comprehensive learning progress report"""
        try:
            profile = self._get_student_profile(user_id)
            
            # Get memories from specified time period
            memories_result = self.memory.search(
                query="learning performance progress completion mastery",
                user_id=user_id,
                limit=50
            )
            
            memories = memories_result.get("results", []) if isinstance(memories_result, dict) else []
            
            # Analyze progress patterns
            progress_analysis = self._analyze_learning_progress(user_id, memories, time_period_days)
            
            return {
                "profile_snapshot": profile,
                "progress_analysis": progress_analysis,
                "achievements": self._identify_achievements(user_id),
                "areas_for_improvement": self._identify_improvement_areas(user_id),
                "next_learning_goals": self._suggest_next_goals(user_id),
                "personalization_insights": self._get_personalization_insights(memories)
            }
        except Exception as e:
            logger.error(f"❌ Error generating progress report: {e}")
            return {
                "profile_snapshot": {},
                "progress_analysis": {},
                "achievements": [],
                "areas_for_improvement": [],
                "next_learning_goals": [],
                "personalization_insights": {},
                "error": str(e)
            }
    
    # Helper methods with error handling
    def _create_profile_memory_text(self, profile: StudentProfile) -> str:
        """Create memory text from profile data"""
        try:
            return f"""Student profile: prefers {profile.learning_style} learning style, 
            difficulty level {profile.preferred_difficulty}, 
            learning pace {profile.learning_pace}. 
            Attention span: {profile.attention_span_minutes} minutes. 
            Prefers visual tools: {profile.prefers_visual_tools}, 
            step-by-step guidance: {profile.prefers_step_by_step}, 
            immediate feedback: {profile.prefers_immediate_feedback}."""
        except Exception as e:
            logger.error(f"❌ Error creating profile memory text: {e}")
            return "Student profile information"
    
    def _create_interaction_memory_text(
        self, 
        interaction_data: Dict[str, Any], 
        analytics: Optional[LearningAnalytics]
    ) -> str:
        """Create contextual memory text from interaction"""
        try:
            base_text = f"Learning interaction: {interaction_data.get('type', 'unknown')} "
            
            if interaction_data.get('problem_solved'):
                base_text += f"successfully solved {interaction_data['problem']} "
            elif interaction_data.get('struggled_with'):
                base_text += f"struggled with {interaction_data['struggled_with']} "
            
            if analytics:
                base_text += f"with {analytics.current_accuracy:.1%} accuracy "
                if analytics.shows_frustration:
                    base_text += "showing signs of frustration "
                if analytics.asks_for_help_frequently:
                    base_text += "requesting help frequently "
            
            base_text += f"using {interaction_data.get('tool_used', 'discussion')} method."
            
            return base_text
        except Exception as e:
            logger.error(f"❌ Error creating interaction memory text: {e}")
            return "Learning interaction recorded"
    
    # Simplified helper methods for missing functionality
    def _get_student_profile(self, user_id: str) -> Dict[str, Any]:
        """Get student profile from database"""
        try:
            db = next(get_db())
            profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
            if profile:
                return self._profile_to_dict(profile)
            return {}
        except Exception as e:
            logger.error(f"❌ Error getting student profile: {e}")
            return {}
        finally:
            db.close()
    
    def _profile_to_dict(self, profile: StudentProfile) -> Dict[str, Any]:
        """Convert profile object to dictionary"""
        try:
            return {
                "id": profile.id,
                "user_id": profile.user_id,
                "learning_style": profile.learning_style,
                "preferred_difficulty": profile.preferred_difficulty,
                "learning_pace": profile.learning_pace,
                "attention_span_minutes": profile.attention_span_minutes,
                "overall_accuracy": profile.overall_accuracy,
                "total_problems_solved": profile.total_problems_solved,
                "current_level": profile.current_level,
                "topic_performance": profile.topic_performance or {},
                "learning_patterns": profile.learning_patterns or {},
                "struggle_areas": profile.struggle_areas or [],
                "strength_areas": profile.strength_areas or [],
                "created_at": profile.created_at.isoformat() if profile.created_at else None,
                "updated_at": profile.updated_at.isoformat() if profile.updated_at else None
            }
        except Exception as e:
            logger.error(f"❌ Error converting profile to dict: {e}")
            return {}
    
    # Placeholder implementations for remaining methods
    def _get_recent_performance(self, user_id: str, topic_number: str) -> Dict[str, Any]:
        return {"accuracy": 0.7, "speed": 1.0, "engagement": 0.8}
    
    def _generate_teaching_strategy(self, profile: Dict, memories: List, performance: Dict) -> Dict[str, Any]:
        return {
            "approach": "adaptive",
            "difficulty_level": 0.5,
            "support_level": "standard",
            "recommended_tools": ["visual_tools", "practice_problems"]
        }
    
    def _calculate_adaptive_difficulty(self, user_id: str, topic_number: str) -> Dict[str, float]:
        return {"success_rate": 0.7}
    
    def _get_learning_insights(self, user_id: str) -> Dict[str, Any]:
        return {"strengths": [], "focus_areas": []}
    
    def _process_analytics_for_profile(self, analytics: LearningAnalytics) -> Dict[str, Any]:
        return {}
    
    def _update_student_profile(self, user_id: str, updates: Dict[str, Any]) -> None:
        pass
    
    def _generate_immediate_feedback(self, analytics: LearningAnalytics) -> str:
        return "Keep up the great work!"
    
    def _suggest_difficulty_adjustment(self, analytics: LearningAnalytics) -> str:
        return "continue"
    
    def _recommend_tools(self, analytics: LearningAnalytics) -> List[str]:
        return []
    
    def _update_profile_from_interaction(self, user_id: str, topic_number: str, interaction_data: Dict, analytics: Optional[LearningAnalytics]) -> None:
        pass
    
    def _analyze_learning_progress(self, user_id: str, memories: List, time_period: int) -> Dict:
        return {}
    
    def _identify_achievements(self, user_id: str) -> List[str]:
        return []
    
    def _identify_improvement_areas(self, user_id: str) -> List[str]:
        return []
    
    def _suggest_next_goals(self, user_id: str) -> List[str]:
        return []
    
    def _get_personalization_insights(self, memories: List) -> Dict:
        return {}

# Global enhanced memory service instance
enhanced_memory_service = EnhancedMathTeacherMemoryService()