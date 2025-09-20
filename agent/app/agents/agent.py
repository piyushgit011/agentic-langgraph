"""
Enhanced Math Teacher Agent with Universal Curriculum and Topic-Specific Tools
"""

import json
import re
import os
from datetime import datetime
from typing import Annotated, TypedDict, Dict, List, Any, Optional, Set
from enum import Enum

# LangGraph imports - Fixed imports
from langgraph.graph.message import add_messages, AnyMessage
from langgraph.graph import START, END, StateGraph
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import AIMessage, HumanMessage, BaseMessage
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MathTeachingState(TypedDict):
    """Enhanced state for topic-aware math teaching agent."""
    messages: Annotated[list[AnyMessage], add_messages]
    # Topic management
    selected_topic_number: Optional[str]
    topic_initialized: Optional[bool]
    curriculum_content: Optional[Dict[str, Any]]
    available_tools: Optional[List[str]]
    topic_has_interactive_tools: Optional[bool]
    
    # Learning progress
    current_topic: Optional[str]
    completed_problems: List[Dict[str, Any]]
    current_progress: Optional[Dict[str, int]]
    
    # Tool interaction
    last_tool_call: Optional[str]
    tool_in_progress: Optional[bool]
    active_tool_type: Optional[str]
    
    # Legacy fields (maintained for compatibility)
    current_operation: Optional[str]
    last_problem: Optional[str]
    student_answer: Optional[int]
    correct_answer: Optional[int]
    interaction_type: Optional[str]
    feedback: Optional[str]


# Topic-specific tool registry (backend version)
TOPIC_TOOL_REGISTRY = {
    "1.1": {
        "tools": [
            "get_curriculum_content",
            "calculate", 
            "show_number_line",
            "demonstrate_number_line",
            "practice_problem", 
            "open_calculator",
            "validate_learning_step"
        ],
        "categories": {
            "visual": ["show_number_line", "demonstrate_number_line"],
            "practice": ["practice_problem"],
            "utility": ["calculate", "open_calculator"],
            "validation": ["validate_learning_step"],
            "curriculum": ["get_curriculum_content"]
        },
        "primary_focus": "interactive_arithmetic"
    },
    
    # Topic 1.2: Patterns in Numbers (UPDATED)
    "1.2": {
        "tools": [
            "get_curriculum_content",
            "show_pattern_explorer", 
            "demonstrate_patterns",
            "practice_patterns",
            "build_pattern",
            "validate_pattern_sequence_work"
        ],
        "categories": {
            "visual": ["show_pattern_explorer"],
            "demo": ["demonstrate_patterns"],
            "practice": ["practice_patterns"],
            "builder": ["build_pattern"],
            "validation": ["validate_pattern_sequence_work"],
            "curriculum": ["get_curriculum_content"]
        },
        "primary_focus": "interactive_patterns"
    },

    # Topic 1.3: Visualising Number Sequences (UPDATED)
    "1.3": {
        "tools": [
            "get_curriculum_content",
            "show_sequence_visualizer",
            "demonstrate_sequences", 
            "practice_sequences",
            "build_sequence",
            "validate_pattern_sequence_work"
        ],
        "categories": {
            "visual": ["show_sequence_visualizer"],
            "demo": ["demonstrate_sequences"],
            "practice": ["practice_sequences"],
            "builder": ["build_sequence"],
            "validation": ["validate_pattern_sequence_work"],
            "curriculum": ["get_curriculum_content"]
        },
        "primary_focus": "interactive_sequences"
    },
    
    # Topic 2.1: Future geometry tools
    "2.1": {
        "tools": ["get_curriculum_content"],  # Discussion-based for now
        "categories": {
            "curriculum": ["get_curriculum_content"]
            # Future: "geometry": ["angle_measurer", "protractor_tool"]
        },
        "primary_focus": "angle_concepts"
    }
}

def get_tools_for_topic(topic_number: Optional[str]) -> List:
    """Get available tools for a specific topic from registry."""
    # Import tools dynamically to avoid circular imports
    try:
        from app.agents.tools import (
            get_curriculum_content, calculate, show_number_line, 
            demonstrate_number_line, practice_problem, open_calculator, 
            validate_learning_step,
            # NEW IMPORTS
            show_pattern_explorer, demonstrate_patterns, practice_patterns, build_pattern,
            show_sequence_visualizer, demonstrate_sequences, practice_sequences, build_sequence,
            validate_pattern_sequence_work
        )
    except ImportError as e:
        print(f"❌ Import error: {e}")
        from app.agents.tools import get_curriculum_content
        return [get_curriculum_content]
    
    # Always include curriculum content tool
    universal_tools = [get_curriculum_content]
    
    if not topic_number or topic_number not in TOPIC_TOOL_REGISTRY:
        print(f"📚 [TOOLS] Topic {topic_number} not in registry, using discussion-based learning")
        return universal_tools
    
    topic_config = TOPIC_TOOL_REGISTRY[topic_number]
    tool_names = topic_config["tools"]
    
    # Map tool names to actual tool functions
    tool_mapping = {
        "get_curriculum_content": get_curriculum_content,
        "calculate": calculate,
        "show_number_line": show_number_line,
        "demonstrate_number_line": demonstrate_number_line,
        "practice_problem": practice_problem,
        "open_calculator": open_calculator,
        "validate_learning_step": validate_learning_step,
        # NEW MAPPINGS
        "show_pattern_explorer": show_pattern_explorer,
        "demonstrate_patterns": demonstrate_patterns,
        "practice_patterns": practice_patterns,
        "build_pattern": build_pattern,
        "show_sequence_visualizer": show_sequence_visualizer,
        "demonstrate_sequences": demonstrate_sequences,
        "practice_sequences": practice_sequences,
        "build_sequence": build_sequence,
        "validate_pattern_sequence_work": validate_pattern_sequence_work
    }
    
    available_tools = []
    for tool_name in tool_names:
        if tool_name in tool_mapping:
            available_tools.append(tool_mapping[tool_name])
        else:
            print(f"⚠️ [TOOLS] Tool '{tool_name}' not found in mapping for topic {topic_number}")
    
    print(f"🛠️ [TOOLS] Topic {topic_number} has {len(available_tools)} tools: {tool_names}")
    return available_tools


def has_interactive_tools(topic_number: str) -> bool:
    """Check if a topic has interactive tools beyond curriculum content."""
    if topic_number not in TOPIC_TOOL_REGISTRY:
        return False
    
    tools = TOPIC_TOOL_REGISTRY[topic_number]["tools"]
    # More than just curriculum content means interactive tools available
    return len(tools) > 1 or "get_curriculum_content" not in tools


def get_topic_capabilities(topic_number: str) -> Dict[str, Any]:
    """Get comprehensive information about a topic's capabilities."""
    if topic_number not in TOPIC_TOOL_REGISTRY:
        return {
            "has_interactive_tools": False,
            "tool_count": 1,
            "categories": ["curriculum"],
            "primary_focus": "discussion_based",
            "available_tools": ["get_curriculum_content"]
        }
    
    config = TOPIC_TOOL_REGISTRY[topic_number]
    return {
        "has_interactive_tools": has_interactive_tools(topic_number),
        "tool_count": len(config["tools"]),
        "categories": list(config["categories"].keys()),
        "primary_focus": config["primary_focus"],
        "available_tools": config["tools"]
    }


def get_topic_specific_system_prompt(state: MathTeachingState) -> str:
    """Generate system prompt based on selected topic and available tools."""
    
    if not state.get("topic_initialized") or not state.get("selected_topic_number"):
        return get_default_system_prompt()
    
    topic_number = state["selected_topic_number"]
    curriculum_content = state.get("curriculum_content", {})
    topic_title = curriculum_content.get("topic_title", f"Topic {topic_number}")
    
    capabilities = get_topic_capabilities(topic_number)
    
    base_prompt = f"""You are a knowledgeable and patient math teacher currently teaching {topic_title} (Topic {topic_number}).

🎯 CRITICAL TEACHING REQUIREMENT:
- ONLY teach content from the selected topic's curriculum material
- Use get_curriculum_content tool to access the complete topic content
- Do NOT introduce concepts or examples outside the selected topic
- Base all explanations, examples, and activities on the curriculum content provided
- If students ask about other topics, redirect them to select the appropriate topic first

CURRENT TOPIC CONTEXT:
- Topic: {topic_title}
- Focus Area: {capabilities['primary_focus'].replace('_', ' ').title()}
- Interactive Tools Available: {capabilities['has_interactive_tools']}
- Tool Categories: {', '.join(capabilities['categories'])}

CURRICULUM CONTENT OVERVIEW:
{curriculum_content.get('full_content', '')[:500]}...

TOPIC-SPECIFIC TEACHING RULES:
1. Start every session by retrieving the full curriculum content for this topic
2. Use only concepts, vocabulary, and examples from the retrieved curriculum material
3. All interactive tools should connect directly to the topic's learning objectives
4. If asked about concepts not in this topic, guide students to select the relevant topic
5. Keep discussions focused on the specific topic's content and objectives
"""

    if capabilities['has_interactive_tools']:
        base_prompt += f"""
INTERACTIVE TEACHING MODE:
You have access to {capabilities['tool_count']} interactive tools for this topic:
{', '.join(capabilities['available_tools'])}

TOOL USAGE STRATEGY:
1. **Always start with get_curriculum_content** to access full topic material
2. **Use visual tools** (show_number_line, demonstrate_number_line) for concepts that benefit from visualization
3. **Provide practice opportunities** with practice_problem when students need hands-on experience
4. **Use utility tools** (calculator, validate_learning_step) to support learning process
5. **Adapt based on student responses** - if they struggle with concepts, use more visual tools

TEACHING APPROACH:
- Begin with curriculum concepts, then reinforce with interactive tools
- Use demonstrations for new concepts, then let students practice
- Validate understanding through interactive exercises
- Provide immediate feedback and encouragement
"""
    else:
        base_prompt += f"""
DISCUSSION-BASED TEACHING MODE:
This topic currently focuses on conceptual understanding through conversation.
Available tools: {', '.join(capabilities['available_tools'])}

TEACHING APPROACH:
- Use get_curriculum_content to access comprehensive topic material
- Explain concepts clearly with examples and analogies
- Ask thought-provoking questions to check understanding
- Provide detailed explanations for complex topics
- Connect ideas to real-world applications
- Encourage questions and provide patient explanations

NOTE: If students request interactive tools, explain that this topic focuses on conceptual learning and suggest Topic 1.1 for hands-on activities.
"""
    
    base_prompt += f"""

CURRENT SESSION STATUS:
- Topic: {topic_number} ({topic_title})
- Tools available: {capabilities['tool_count']}
- Student progress: {len(state.get('completed_problems', []))} completed activities

Remember to stay focused on {topic_title} content and help students master its concepts thoroughly.
"""
    
    return base_prompt


def get_default_system_prompt() -> str:
    """Default system prompt for topic selection phase."""
    return """You are a friendly and knowledgeable mathematics teacher helping students explore a comprehensive curriculum.

CURRENT MODE: Topic Selection & Curriculum Navigation

Your role:
- Help students understand the available curriculum topics
- Explain which topics have interactive tools (🎮) vs discussion-based learning (📝)
- Guide students to select appropriate topics based on their interests and level
- Use the get_curriculum_content tool to provide detailed information about any topic

CURRICULUM OVERVIEW:
- Topic 1.1: "What is Mathematics" - Full interactive experience with visual tools
- Topics 1.2-1.3: "Patterns in Mathematics" - Interactive pattern and sequence tools
- Topics 2.1-2.5: "Angles and Symmetry" - Discussion-based with future tool development
- Topics 10.1-10.3: "Practical Geometry" - Conceptual learning

GUIDANCE FOR STUDENTS:
- Recommend Topic 1.1, 1.2, 1.3 for students who want hands-on, visual learning
- Suggest other topics based on mathematical interests
- Explain that all topics provide valuable learning, just in different formats

To select a topic, students should say something like "Select topic 1.1" or "I want to learn about topic 2.1"
"""


def initialize_topic_context(state: MathTeachingState, topic_number: str) -> MathTeachingState:
    """Initialize topic-specific context with enhanced tool awareness."""
    print(f"🎯 [TOPIC INIT] Initializing Topic {topic_number}")
    
    try:
        from app.services.curriculum_service import get_curriculum_service
        
        curriculum = get_curriculum_service()
        topic_summary = curriculum.get_topic_summary(topic_number)
        
        if "error" not in topic_summary:
            capabilities = get_topic_capabilities(topic_number)
            
            updated_state = {
                **state,
                "selected_topic_number": topic_number,
                "curriculum_content": topic_summary,
                "topic_initialized": True,
                "current_topic": topic_summary["topic_title"],
                "available_tools": capabilities["available_tools"],
                "topic_has_interactive_tools": capabilities["has_interactive_tools"],
                "completed_problems": [],
                "current_progress": {"correct": 0, "total": 0}
            }
            
            print(f"✅ [TOPIC INIT] Topic {topic_number} initialized successfully")
            print(f"📊 [CAPABILITIES] Interactive tools: {capabilities['has_interactive_tools']}")
            print(f"🛠️ [TOOLS] Available: {len(capabilities['available_tools'])} tools")
            
            return updated_state
        else:
            print(f"❌ [TOPIC INIT] Failed to load topic {topic_number}: {topic_summary['error']}")
            return state
            
    except Exception as e:
        print(f"❌ [TOPIC INIT] Error initializing topic {topic_number}: {str(e)}")
        return state


def generate_topic_welcome_message(curriculum_content: Dict[str, Any], capabilities: Dict[str, Any]) -> str:
    """Generate a comprehensive welcome message for a topic."""
    topic_title = curriculum_content.get("topic_title", "Unknown Topic")
    unit_title = curriculum_content.get("unit_title", "Unknown Unit")
    topic_number = curriculum_content.get("topic_number", "Unknown")
    has_tools = capabilities["has_interactive_tools"]
    tool_count = capabilities["tool_count"]
    
    message = f"🎓 **Welcome to {topic_title}** (Topic {topic_number})\n"
    message += f"📚 Part of: {unit_title}\n\n"
    
    # Add main concepts if available
    main_concepts = curriculum_content.get("content_summary", {}).get("main_concepts", [])
    if main_concepts:
        message += "📝 **Key Concepts We'll Explore:**\n"
        for concept in main_concepts[:3]:  # Show top 3 concepts
            message += f"• {concept}\n"
        message += "\n"
    
    # Tool availability information
    if has_tools:
        message += f"🎮 **Interactive Learning Available!** ({tool_count} tools)\n\n"
        
        categories = capabilities["categories"]
        if "visual" in categories:
            message += "📊 **Visual Tools**: Interactive demonstrations and number lines\n"
        if "practice" in categories:
            message += "🎯 **Practice Tools**: Hands-on problem solving with feedback\n"
        if "utility" in categories:
            message += "🧮 **Utility Tools**: Calculators and helper functions\n"
        
        message += "\n✨ **Try saying:**\n"
        message += "• 'Show me the number line for 5 + 3'\n"
        message += "• 'Demonstrate addition step by step'\n"
        message += "• 'Give me practice problems'\n"
        message += "• 'Open the calculator'\n\n"
    else:
        message += "📖 **Learning Mode**: Conceptual understanding through discussion\n\n"
        message += "💭 **Perfect for exploring:**\n"
        message += "• Deep conceptual understanding\n"
        message += "• Mathematical reasoning and logic\n"
        message += "• Problem-solving strategies\n"
        message += "• Real-world connections\n\n"
        
        message += "✨ **Try asking:**\n"
        message += "• 'Explain the main concepts'\n"
        message += "• 'Give me examples and applications'\n"
        message += "• 'Help me understand this topic better'\n"
        message += "• 'What are the key ideas I should know?'\n\n"
        
        message += "🎮 *Want interactive tools? Try Topic 1.1 for hands-on activities!*\n\n"
    
    message += "🚀 **Ready to learn?** Ask me anything about this topic!"
    
    return message


def chat_node(state: MathTeachingState) -> MathTeachingState:
    """Enhanced chat node with topic-aware tool management."""
    
    print(f"\n{'='*60}")
    print("🤖 [CHAT NODE] Processing - Universal Curriculum Agent")
    print(f"📅 Timestamp: {datetime.now().isoformat()}")
    print(f"🎯 Current Topic: {state.get('selected_topic_number', 'None')}")
    print(f"🛠️ Tools Available: {len(state.get('available_tools', []))}")
    print(f"{'='*60}")
    
    # Get messages
    messages = state.get("messages", [])
    
    # Check for topic selection
    if messages and isinstance(messages[-1], HumanMessage):
        last_message = messages[-1]
        topic_selection = detect_topic_selection(last_message.content)
        
        if topic_selection:
            print(f"🎯 [TOPIC SELECTION] Detected: {topic_selection}")
            
            # Initialize topic context
            updated_state = initialize_topic_context(state, topic_selection)
            
            if updated_state.get("topic_initialized"):
                capabilities = get_topic_capabilities(topic_selection)
                curriculum_content = updated_state["curriculum_content"]
                welcome_message = generate_topic_welcome_message(curriculum_content, capabilities)
                
                topic_response = AIMessage(content=welcome_message)
                
                final_state = {
                    **updated_state,
                    "messages": messages + [topic_response]
                }
                
                print(f"✅ [TOPIC SELECTION] Successfully initialized Topic {topic_selection}")
                return final_state
            else:
                error_response = AIMessage(
                    content=f"❌ Sorry, I couldn't load Topic {topic_selection}. Please check the topic number and try again, or ask me about available topics."
                )
                return {
                    **state,
                    "messages": messages + [error_response]
                }
    
    # Set up model
    model = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.3,
        api_key=os.getenv("OPENAI_API_KEY")
    )
    
    # Get topic-specific system prompt
    system_prompt = get_topic_specific_system_prompt(state)
    
    # Get topic-specific tools
    selected_topic = state.get("selected_topic_number")
    available_tools = get_tools_for_topic(selected_topic)
    
    print(f"🛠️ [TOOLS] Binding {len(available_tools)} tools for topic {selected_topic}")
    
    # Check if tool is in progress
    tool_in_progress = state.get('tool_in_progress', False)
    
    if tool_in_progress:
        print("⚠️ [TOOLS] Tool in progress - not binding tools to prevent duplication")
        model_with_tools = model
    else:
        model_with_tools = model.bind_tools(available_tools)
    
    # Prepare messages for model
    messages_for_model = [
        {"role": "system", "content": system_prompt}
    ] + [
        {"role": "human" if isinstance(msg, HumanMessage) else "assistant", "content": msg.content}
        for msg in messages
    ]
    
    print(f"📨 [MODEL] Sending {len(messages_for_model)} messages")
    print(f"📏 [PROMPT] System prompt length: {len(system_prompt)} chars")
    
    try:
        response = model_with_tools.invoke(messages_for_model)
        
        print(f"✅ [RESPONSE] Received from model")
        print(f"📄 [CONTENT] Length: {len(response.content)} chars")
        
        # Check for tool calls
        has_tool_calls = hasattr(response, 'tool_calls') and response.tool_calls
        
        if has_tool_calls:
            tool_names = [tc.get('name', 'unknown') for tc in response.tool_calls]
            print(f"🔧 [TOOL CALLS] Agent calling: {tool_names}")
            
            updated_state = {
                **state,
                "messages": messages + [response],
                "tool_in_progress": True,
                "last_tool_call": tool_names[0],
                "active_tool_type": tool_names[0]
            }
            
            print(f"🔧 [STATE] Tool '{tool_names[0]}' now in progress")
            return updated_state
        
    except Exception as e:
        print(f"❌ [ERROR] Model invocation failed: {e}")
        response = AIMessage(
            content="I'm having a technical issue. Please try again or ask me about a different topic."
        )
    
    # Return updated state
    final_state = {
        **state,
        "messages": messages + [response],
        "tool_in_progress": False,
        "last_tool_call": None,
        "active_tool_type": None
    }
    
    print(f"✅ [COMPLETE] Chat node finished")
    print(f"📊 [STATE] Messages: {len(final_state['messages'])}, Topic: {final_state.get('selected_topic_number', 'None')}")
    print(f"{'='*60}\n")
    
    return final_state


def detect_topic_selection(message_content: str) -> Optional[str]:
    """Enhanced topic selection detection."""
    if not message_content:
        return None
    
    content_lower = message_content.lower()
    
    # Enhanced patterns for topic selection
    patterns = [
        r'select\s+topic\s+(\d+\.\d+)',
        r'start\s+topic\s+(\d+\.\d+)',
        r'begin\s+topic\s+(\d+\.\d+)',
        r'load\s+topic\s+(\d+\.\d+)',
        r'topic\s*:?\s*(\d+\.\d+)',
        r'switch\s+to\s+topic\s+(\d+\.\d+)',
        r'go\s+to\s+topic\s+(\d+\.\d+)',
        r'open\s+topic\s+(\d+\.\d+)',
        r'teach\s+me\s+topic\s+(\d+\.\d+)',
        r'i\s+want\s+to\s+learn\s+topic\s+(\d+\.\d+)',
        r'show\s+me\s+topic\s+(\d+\.\d+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content_lower)
        if match:
            topic_number = match.group(1)
            print(f"🎯 [DETECTION] Found topic selection: {topic_number} using pattern: {pattern}")
            return topic_number
    
    return None


# Create the enhanced workflow - Fixed to remove undefined GraphInput/GraphOutput
workflow = StateGraph(MathTeachingState)

# Add the enhanced chat node
workflow.add_node("chat", chat_node)

# Set entry point and edges
workflow.add_edge(START, "chat")
workflow.add_edge("chat", END)

# Compile the graph with memory
math_teacher_graph = workflow.compile(checkpointer=MemorySaver())

print("🚀 [STARTUP] Enhanced Math Teacher Agent initialized with Universal Curriculum support")
print(f"📚 [REGISTRY] Loaded {len(TOPIC_TOOL_REGISTRY)} topic configurations")
print(f"🛠️ [TOOLS] Interactive topics: {[t for t in TOPIC_TOOL_REGISTRY.keys() if has_interactive_tools(t)]}")