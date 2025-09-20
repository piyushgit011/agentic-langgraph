"""
Enhanced Curriculum Service with Topic Tool Integration
"""

import json
import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass


@dataclass
class TopicContent:
    """Enhanced topic content with tool information."""
    topic_number: str
    topic_title: str
    unit_number: int
    unit_title: str
    full_text: str
    paragraphs: List[str]
    word_count: int
    paragraph_count: int
    # New fields for tool integration
    has_interactive_tools: bool = False
    available_tools: List[str] = None
    tool_categories: List[str] = None


class CurriculumService:
    """Enhanced service for managing curriculum data with tool integration."""
    
    def __init__(self, curriculum_file_path: str = "curriculum_data.json"):
        """Initialize the curriculum service."""
        self.curriculum_file_path = curriculum_file_path
        self.curriculum_data: List[Dict] = []
        self.topics_index: Dict[str, TopicContent] = {}
        
        # Import topic registry for tool information
        from agent import TOPIC_TOOL_REGISTRY, get_topic_capabilities
        self.topic_registry = TOPIC_TOOL_REGISTRY
        self.get_capabilities = get_topic_capabilities
        
        self.load_curriculum_data()
    
    def load_curriculum_data(self) -> None:
        """Load curriculum data with enhanced tool information."""
        try:
            with open(self.curriculum_file_path, 'r', encoding='utf-8') as file:
                self.curriculum_data = json.load(file)
            
            # Build enhanced topics index
            self._build_enhanced_topics_index()
            print(f"✅ [CURRICULUM] Loaded {len(self.topics_index)} topics with tool information")
            
        except FileNotFoundError:
            print(f"❌ [CURRICULUM] File not found: {self.curriculum_file_path}")
            self.curriculum_data = []
        except json.JSONDecodeError as e:
            print(f"❌ [CURRICULUM] JSON parsing error: {e}")
            self.curriculum_data = []

    def get_topic_capabilities_safe(topic_number: str) -> Dict[str, Any]:
        """Safe getter for topic capabilities to avoid circular imports"""
        try:
            from app.agents.agent import get_topic_capabilities
            return get_topic_capabilities(topic_number)
        except ImportError:
            # Fallback if circular import occurs
            return {
                "has_interactive_tools": False,
                "tool_count": 1,
                "categories": ["curriculum"],
                "primary_focus": "discussion_based",
                "available_tools": ["get_curriculum_content"]
            }
    
    def _build_enhanced_topics_index(self) -> None:
        """Build enhanced index with tool information."""
        self.topics_index = {}
        
        for unit in self.curriculum_data:
            unit_number = unit.get("unit_number", 0)
            unit_title = unit.get("unit_title", "Unknown Unit")
            
            for topic in unit.get("topics", []):
                topic_number = topic.get("topic_number", "")
                topic_title = topic.get("topic_title", "Unknown Topic")
                
                # Get tool capabilities for this topic with safe import
                capabilities = self.get_topic_capabilities_safe(topic_number)
                
                # Extract content
                content = None
                if "content" in topic:
                    content_data = topic["content"]
                    content = TopicContent(
                        topic_number=topic_number,
                        topic_title=topic_title,
                        unit_number=unit_number,
                        unit_title=unit_title,
                        full_text=content_data.get("full_text", ""),
                        paragraphs=content_data.get("paragraphs", []),
                        word_count=content_data.get("word_count", 0),
                        paragraph_count=content_data.get("paragraph_count", 0),
                        # Enhanced with tool information
                        has_interactive_tools=capabilities["has_interactive_tools"],
                        available_tools=capabilities["available_tools"],
                        tool_categories=capabilities["categories"]
                    )
                else:
                    # Create minimal content structure
                    content = TopicContent(
                        topic_number=topic_number,
                        topic_title=topic_title,
                        unit_number=unit_number,
                        unit_title=unit_title,
                        full_text=f"Content for {topic_title} will be loaded dynamically.",
                        paragraphs=[],
                        word_count=0,
                        paragraph_count=0,
                        has_interactive_tools=capabilities["has_interactive_tools"],
                        available_tools=capabilities["available_tools"],
                        tool_categories=capabilities["categories"]
                    )
                
                self.topics_index[topic_number] = content
    
    def get_topic_summary(self, topic_number: str) -> Dict[str, Any]:
        """Get enhanced topic summary with tool information."""
        topic = self.topics_index.get(topic_number)
        if not topic:
            return {
                "topic_number": topic_number,
                "error": "Topic not found in curriculum"
            }
        
        return {
            "topic_number": topic.topic_number,
            "topic_title": topic.topic_title,
            "unit_number": topic.unit_number,
            "unit_title": topic.unit_title,
            
            # Tool information
            "has_interactive_tools": topic.has_interactive_tools,
            "available_tools": topic.available_tools or [],
            "tool_categories": topic.tool_categories or [],
            "tool_count": len(topic.available_tools) if topic.available_tools else 0,
            
            # Content information
            "content_summary": {
                "word_count": topic.word_count,
                "paragraph_count": topic.paragraph_count,
                "main_concepts": self._extract_main_concepts(topic),
                "key_questions": self._extract_questions(topic)
            },
            
            # Full content (truncated for context window)
            "full_content": (topic.full_text[:1500] + "..." 
                           if len(topic.full_text) > 1500 
                           else topic.full_text)
        }
    
    def get_curriculum_overview(self) -> Dict[str, Any]:
        """Get enhanced curriculum overview with tool statistics."""
        units = {}
        total_interactive_topics = 0
        
        for topic in self.topics_index.values():
            unit_key = f"Unit {topic.unit_number}"
            if unit_key not in units:
                units[unit_key] = {
                    "unit_number": topic.unit_number,
                    "unit_title": topic.unit_title,
                    "topics": [],
                    "interactive_topics_count": 0
                }
            
            topic_info = {
                "topic_number": topic.topic_number,
                "topic_title": topic.topic_title,
                "has_interactive_tools": topic.has_interactive_tools,
                "tool_count": len(topic.available_tools) if topic.available_tools else 0,
                "tool_categories": topic.tool_categories or []
            }
            
            units[unit_key]["topics"].append(topic_info)
            
            if topic.has_interactive_tools:
                units[unit_key]["interactive_topics_count"] += 1
                total_interactive_topics += 1
        
        return {
            "total_topics": len(self.topics_index),
            "topics_with_tools": total_interactive_topics,
            "units": units,
            "tool_statistics": self._get_tool_statistics()
        }
    
    def _get_tool_statistics(self) -> Dict[str, Any]:
        """Get statistics about tool usage across curriculum."""
        tool_counts = {}
        category_counts = {}
        
        for topic in self.topics_index.values():
            if topic.available_tools:
                for tool in topic.available_tools:
                    tool_counts[tool] = tool_counts.get(tool, 0) + 1
                
                for category in (topic.tool_categories or []):
                    category_counts[category] = category_counts.get(category, 0) + 1
        
        return {
            "most_used_tools": sorted(tool_counts.items(), key=lambda x: x[1], reverse=True)[:5],
            "tool_categories": category_counts,
            "total_unique_tools": len(tool_counts)
        }
    
    def get_topics_by_tool_category(self, category: str) -> List[str]:
        """Get topics that have tools in a specific category."""
        matching_topics = []
        
        for topic_number, topic in self.topics_index.items():
            if topic.tool_categories and category in topic.tool_categories:
                matching_topics.append(topic_number)
        
        return matching_topics
    
    def get_topics_with_tools(self) -> List[str]:
        """Get all topics that have interactive tools."""
        return [
            topic_number for topic_number, topic in self.topics_index.items()
            if topic.has_interactive_tools
        ]
    
    # Keep existing methods for compatibility...
    def get_all_topics(self) -> List[TopicContent]:
        return list(self.topics_index.values())
    
    def get_topic(self, topic_number: str) -> Optional[TopicContent]:
        return self.topics_index.get(topic_number)
    
    def get_topic_content(self, topic_number: str) -> Optional[TopicContent]:
        return self.get_topic(topic_number)
    
    def _extract_main_concepts(self, content: TopicContent) -> List[str]:
        """Extract main concepts from topic content."""
        concepts = []
        text = content.full_text.lower()
        
        # Enhanced concept extraction based on topic type
        if "mathematics is" in text:
            concepts.append("Definition and Nature of Mathematics")
        if "pattern" in text:
            concepts.append("Mathematical Patterns and Sequences")
        if "number" in text and "sequence" in text:
            concepts.append("Number Sequences and Relations")
        if "visualiz" in text or "visual" in text:
            concepts.append("Mathematical Visualization")
        if "problem" in text and "solv" in text:
            concepts.append("Problem Solving Strategies")
        if "real world" in text or "application" in text:
            concepts.append("Real-World Applications")
        
        return concepts[:5]  # Return top 5 concepts
    
    def _extract_questions(self, content: TopicContent) -> List[str]:
        """Extract key questions from topic content."""
        questions = []
        
        for paragraph in content.paragraphs:
            if paragraph.strip().endswith('?'):
                question = paragraph.strip()
                if len(question) < 200:
                    questions.append(question)
        
        return questions[:3]  # Return up to 3 key questions
    
    


# Global enhanced curriculum service instance
curriculum_service = CurriculumService()


def get_curriculum_service() -> CurriculumService:
    """Get the global enhanced curriculum service instance."""
    return curriculum_service