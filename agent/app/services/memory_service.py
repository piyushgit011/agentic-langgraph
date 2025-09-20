from mem0 import Memory
from typing import Dict, List, Any, Optional
from app.core.config import settings
import json
from datetime import datetime

class MathTeacherMemoryService:
    def __init__(self):
        # Use from_config method for newer Mem0 API
        try:
            if settings.MEM0_MODE == "cloud" and settings.MEM0_API_KEY:
                # For cloud mode, use MemoryClient instead
                from mem0 import MemoryClient
                self.memory = MemoryClient(api_key=settings.MEM0_API_KEY)
                print("✅ Mem0 initialized with cloud configuration")
            else:
                # For local mode, use Memory.from_config
                self.memory = Memory.from_config(config_dict=settings.MEM0_CONFIG)
                print("✅ Mem0 initialized with local configuration")
        except Exception as e:
            print(f"❌ Failed to initialize Mem0: {e}")
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
                print("⚠️ Using basic Mem0 configuration with ChromaDB as fallback")
            except Exception as fallback_error:
                print(f"❌ Even fallback initialization failed: {fallback_error}")
                raise RuntimeError(f"Could not initialize Mem0: {fallback_error}")
    
    def add_learning_event(self, user_id: str, session_id: str, event_data: Dict[str, Any]) -> None:
        """Record a learning event in memory"""
        event_data.update({
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        })
        
        # Create contextual memory text
        memory_text = self._create_memory_text(event_data)
        
        try:
            self.memory.add(
                messages=memory_text,
                user_id=user_id,
                metadata=event_data
            )
        except Exception as e:
            print(f"❌ Error adding learning event: {e}")
    
    def get_student_profile(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive student learning profile"""
        
        try:
            # Get different types of memories
            learning_patterns = self.memory.search(
                query="learning style preferences strengths struggles",
                user_id=user_id,
                limit=10
            )
            
            topic_progress = self.memory.search(
                query="topic completed performance mastery",
                user_id=user_id,
                limit=15
            )
            
            tool_preferences = self.memory.search(
                query="tool usage interactive visual calculator number line",
                user_id=user_id,
                limit=8
            )
            
            return {
                "learning_patterns": learning_patterns.get("results", []) if isinstance(learning_patterns, dict) else [],
                "topic_progress": topic_progress.get("results", []) if isinstance(topic_progress, dict) else [],
                "tool_preferences": tool_preferences.get("results", []) if isinstance(tool_preferences, dict) else [],
                "profile_generated_at": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"❌ Error getting student profile: {e}")
            return {
                "learning_patterns": [],
                "topic_progress": [],
                "tool_preferences": [],
                "profile_generated_at": datetime.now().isoformat(),
                "error": str(e)
            }
    
    def get_contextual_memories(self, user_id: str, current_context: str) -> List[Dict]:
        """Get memories relevant to current learning context"""
        try:
            memories = self.memory.search(
                query=current_context,
                user_id=user_id,
                limit=5
            )
            return memories.get("results", []) if isinstance(memories, dict) else []
        except Exception as e:
            print(f"❌ Error getting contextual memories: {e}")
            return []
    
    def update_learning_preference(self, user_id: str, preference_type: str, value: str) -> None:
        """Update learning preference"""
        memory_text = f"Student prefers {preference_type}: {value}"
        try:
            self.memory.add(
                messages=memory_text,
                user_id=user_id,
                metadata={
                    "event_type": "learning_preference",
                    "preference_type": preference_type,
                    "preference_value": value,
                    "timestamp": datetime.now().isoformat()
                }
            )
        except Exception as e:
            print(f"❌ Error updating learning preference: {e}")
    
    def _create_memory_text(self, event_data: Dict[str, Any]) -> str:
        """Create contextual memory text from event data"""
        event_type = event_data.get("type", "learning_event")
        
        if event_type == "topic_completed":
            return f"Student successfully completed Topic {event_data['topic_number']} with {event_data.get('performance', 'good')} performance using {event_data.get('method', 'various')} tools"
        elif event_type == "struggle_identified":
            return f"Student struggled with {event_data['concept']} in Topic {event_data['topic_number']}, needed additional support"
        elif event_type == "tool_usage":
            return f"Student effectively used {event_data['tool_name']} for Topic {event_data['topic_number']}"
        elif event_type == "learning_preference":
            return f"Student shows preference for {event_data['preference_type']}: {event_data['preference_value']}"
        else:
            return event_data.get("description", "Learning interaction recorded")

# Global memory service instance
memory_service = MathTeacherMemoryService()