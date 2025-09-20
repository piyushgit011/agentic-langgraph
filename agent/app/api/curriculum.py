"""
Curriculum API endpoints for accessing curriculum data
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
import json
import os
from pathlib import Path

router = APIRouter(prefix="/api/v1/curriculum", tags=["curriculum"])

# Path to curriculum data
CURRICULUM_DATA_PATH = Path(__file__).parent.parent / "data" / "curriculum_data.json"

def load_curriculum_data() -> List[Dict[str, Any]]:
    """Load curriculum data from JSON file"""
    try:
        with open(CURRICULUM_DATA_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Curriculum data not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid curriculum data format")

@router.get("/")
async def get_all_curriculum() -> List[Dict[str, Any]]:
    """Get all curriculum data organized by units"""
    curriculum_data = load_curriculum_data()
    
    # Group topics by unit
    units = {}
    for topic in curriculum_data:
        unit_number = topic["unit_number"]
        if unit_number not in units:
            units[unit_number] = {
                "unit_number": unit_number,
                "unit_title": topic["unit_title"],
                "unit_directory": topic.get("unit_directory", ""),
                "topics": []
            }
        units[unit_number]["topics"].append(topic)
    
    return list(units.values())

@router.get("/overview")
async def get_curriculum_overview() -> List[Dict[str, Any]]:
    """Get curriculum overview with unit summaries"""
    curriculum_data = load_curriculum_data()
    
    # Count topics per unit
    unit_counts = {}
    for topic in curriculum_data:
        unit_number = topic["unit_number"]
        if unit_number not in unit_counts:
            unit_counts[unit_number] = {
                "unit_number": unit_number,
                "unit_title": topic["unit_title"],
                "topic_count": 0
            }
        unit_counts[unit_number]["topic_count"] += 1
    
    return list(unit_counts.values())

@router.get("/unit/{unit_number}")
async def get_unit(unit_number: int) -> Dict[str, Any]:
    """Get all topics for a specific unit"""
    curriculum_data = load_curriculum_data()
    
    unit_topics = [topic for topic in curriculum_data if topic["unit_number"] == unit_number]
    
    if not unit_topics:
        raise HTTPException(status_code=404, detail=f"Unit {unit_number} not found")
    
    return {
        "unit_number": unit_number,
        "unit_title": unit_topics[0]["unit_title"],
        "unit_directory": unit_topics[0].get("unit_directory", ""),
        "topics": unit_topics
    }

@router.get("/topic/{topic_number}")
async def get_topic(topic_number: str) -> Dict[str, Any]:
    """Get specific topic by topic number"""
    curriculum_data = load_curriculum_data()
    
    topic = next((t for t in curriculum_data if t["topic_number"] == topic_number), None)
    
    if not topic:
        raise HTTPException(status_code=404, detail=f"Topic {topic_number} not found")
    
    return topic

@router.get("/search")
async def search_topics(q: str) -> List[Dict[str, Any]]:
    """Search topics by content"""
    if not q or len(q.strip()) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters")
    
    curriculum_data = load_curriculum_data()
    query = q.lower()
    
    matching_topics = []
    for topic in curriculum_data:
        # Search in title
        if query in topic["topic_title"].lower():
            matching_topics.append(topic)
            continue
            
        # Search in content
        content = topic.get("content", {})
        full_text = content.get("full_text", "").lower()
        if query in full_text:
            matching_topics.append(topic)
    
    return matching_topics

@router.get("/topic/{topic_number}/tools")
async def get_topic_tools(topic_number: str) -> List[str]:
    """Get available interactive tools for a topic"""
    # Define which topics have which tools
    topic_tools = {
        "1.1": ["number_line", "pattern_finder"],
        "1.2": ["sequence_builder", "pattern_analyzer"],
        "1.3": ["visualization_tools", "shape_builder"],
        # Add more topics and their tools as needed
    }
    
    return topic_tools.get(topic_number, [])

@router.get("/tools")
async def get_all_tools() -> Dict[str, List[str]]:
    """Get all available tools organized by topic"""
    return {
        "1.1": ["number_line", "pattern_finder"],
        "1.2": ["sequence_builder", "pattern_analyzer"],
        "1.3": ["visualization_tools", "shape_builder"],
    }