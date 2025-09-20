"""Enhanced Math tools with topic awareness."""

from langchain_core.tools import tool
import re
from typing import Dict, Any, Optional


@tool
def get_curriculum_content(topic_number: str) -> str:
    """
    Universal tool to get comprehensive curriculum content for any topic.
    
    Args:
        topic_number: The topic number (e.g., '1.1', '2.3', '10.5')
        
    Returns:
        str: Detailed curriculum content with tool availability information
    """
    try:
        from curriculum_service import get_curriculum_service
        from agent import get_topic_capabilities
        
        curriculum = get_curriculum_service()
        topic_summary = curriculum.get_topic_summary(topic_number)
        
        print(f"📚 [CURRICULUM TOOL] Retrieved content for topic {topic_number}")
        
        if "error" in topic_summary:
            return f"❌ Topic {topic_number} not found in curriculum. Please check the topic number or ask me about available topics."
        
        # Get enhanced capabilities
        capabilities = get_topic_capabilities(topic_number)
        
        # Build comprehensive response
        response = f"""📚 **TOPIC {topic_summary['topic_number']}: {topic_summary['topic_title']}**
📖 **Unit {topic_summary['unit_number']}: {topic_summary['unit_title']}**

{topic_summary['full_content']}

---

🛠️ **LEARNING TOOLS AVAILABLE:**"""
        
        if capabilities["has_interactive_tools"]:
            response += f"""
✅ **Interactive Tools ({capabilities['tool_count']} available):**
- Tool Categories: {', '.join(capabilities['categories'])}
- Available Tools: {', '.join(capabilities['available_tools'])}

🎮 **You can ask for:**
- Visual demonstrations and step-by-step guides
- Interactive practice problems with feedback
- Hands-on activities and explorations

**Example requests:**
- "Show me the number line for addition"
- "Give me practice problems"
- "Demonstrate this concept step by step"
"""
        else:
            response += f"""
📖 **Discussion-Based Learning:**
This topic focuses on conceptual understanding through conversation and explanation.

💭 **Perfect for exploring:**
- Deep conceptual understanding
- Mathematical reasoning and connections
- Problem-solving strategies and approaches

🎮 **Want interactive tools?** Try Topic 1.1 for hands-on activities!
"""
        
        response += f"""

📊 **Content Statistics:**
- {topic_summary['content_summary']['word_count']} words
- {topic_summary['content_summary']['paragraph_count']} sections
- Main concepts: {len(topic_summary['content_summary']['main_concepts'])}

🚀 **Ready to dive deeper?** Ask me questions or request specific activities!
"""
        
        return response
        
    except Exception as e:
        print(f"❌ [CURRICULUM TOOL] Error: {str(e)}")
        return f"❌ Error retrieving content for topic {topic_number}. Please try again or contact support."


@tool 
def validate_learning_step(
    tool_type: str,
    problem: str,
    operation: str,
    validation_data: dict,
    topic_context: Optional[str] = None
) -> dict:
    """
    Enhanced validation with topic context awareness.
    
    Args:
        tool_type: Type of tool being used
        problem: The math problem being worked on
        operation: The operation type  
        validation_data: Step-specific validation data
        topic_context: Current topic number for context-aware validation
        
    Returns:
        dict: Enhanced validation result with topic-specific guidance
    """
    try:
        from step_validator import StepValidator
        from agent import get_topic_capabilities
        
        validator = StepValidator()
        
        print(f"🔍 [VALIDATION] Topic-aware validation for {tool_type} in topic {topic_context}")
        
        # Get topic capabilities for context
        capabilities = {}
        if topic_context:
            capabilities = get_topic_capabilities(topic_context)
        
        # Perform base validation
        if tool_type == "number_line":
            result = validator.validate_number_line_step(
                problem=problem,
                operation=operation,
                current_steps=validation_data.get('current_steps', []),
                proposed_step=validation_data.get('proposed_step', 0),
                expected_sequence=validation_data.get('expected_sequence', [])
            )
        elif tool_type == "practice_problem":
            result = validator.validate_practice_step(
                problem=problem,
                operation=operation,
                user_input=validation_data.get('user_input', ''),
                step_number=validation_data.get('step_number', 1)
            )
        else:
            result = {
                "result": "needs_guidance",
                "is_correct": False,
                "feedback": f"Validation for {tool_type} is not yet implemented.",
                "hint": "Continue with your learning!",
                "guidance_level": "gentle"
            }
        
        # Enhance result with topic context
        if topic_context and capabilities.get("has_interactive_tools"):
            if result.get("is_correct"):
                result["topic_encouragement"] = f"Great progress in Topic {topic_context}! You're mastering these concepts."
            else:
                result["topic_suggestion"] = f"In Topic {topic_context}, try using our other interactive tools if you need more practice."
        
        return {
            "action": "validate_learning_step",
            "tool_type": tool_type,
            "problem": problem,
            "topic_context": topic_context,
            "validation_result": result,
            "message": result.get("feedback", "Step validated")
        }
        
    except Exception as e:
        print(f"❌ [VALIDATION] Error: {str(e)}")
        return {
            "action": "validate_learning_step", 
            "validation_result": {
                "result": "needs_guidance",
                "is_correct": False,
                "feedback": "I'm having trouble validating that step. Keep going!",
                "guidance_level": "gentle"
            },
            "message": "Validation completed with fallback guidance"
        }


# Keep existing tools (calculate, show_number_line, etc.) unchanged
# They will work with the new system automatically

@tool
def calculate(expression: str) -> dict:
    """Perform basic math calculations - enhanced with better error handling."""
    try:
        from validators import InputSanitizer, ValidationError, SecurityError
        
        sanitizer = InputSanitizer()
        clean_expression = sanitizer.sanitize_math_expression(expression)
        result = eval(clean_expression)
        explanation = _create_explanation(clean_expression, result)
        
        return {
            "expression": clean_expression,
            "original_expression": expression,
            "result": result,
            "error": None,
            "explanation": explanation
        }
        
    except (ValidationError, SecurityError) as e:
        return {
            "expression": expression,
            "result": None, 
            "error": f"Validation error: {str(e)}",
            "explanation": "Please use only numbers and basic math operations (+, -, *, /)."
        }
    except ZeroDivisionError:
        return {
            "expression": expression,
            "result": None,
            "error": "Cannot divide by zero",
            "explanation": "Division by zero is not allowed in mathematics."
        }
    except Exception as e:
        return {
            "expression": expression,
            "result": None,
            "error": f"Error calculating: {str(e)}",
            "explanation": "There was an error with this calculation."
        }


def _create_explanation(expression: str, result: float) -> str:
    """Create a helpful explanation for the calculation."""
    if "+" in expression and "-" not in expression:
        parts = expression.split("+")
        if len(parts) == 2:
            num1, num2 = parts[0].strip(), parts[1].strip()
            return f"Adding {num1} and {num2} gives us {result}"
    elif "-" in expression and "+" not in expression:
        parts = expression.split("-")
        if len(parts) == 2:
            num1, num2 = parts[0].strip(), parts[1].strip()
            return f"Subtracting {num2} from {num1} gives us {result}"
    elif "*" in expression:
        parts = expression.split("*")
        if len(parts) == 2:
            num1, num2 = parts[0].strip(), parts[1].strip()
            return f"Multiplying {num1} by {num2} gives us {result}"
    elif "/" in expression:
        parts = expression.split("/")
        if len(parts) == 2:
            num1, num2 = parts[0].strip(), parts[1].strip()
            return f"Dividing {num1} by {num2} gives us {result}"
    
    return f"The calculation {expression} equals {result}"


@tool
def show_number_line(problem: str, operation: str, start: int = 0, end: int = 20, topic_number: Optional[str] = None) -> dict:
    """Show an interactive number line - enhanced with topic awareness."""
    
    # For topic 1.1 "What is Mathematics", focus on pattern exploration
    if topic_number == "1.1":
        return {
            "action": "show_number_line",
            "problem": problem,
            "operation": operation,
            "start": start,
            "end": end,
            "topic_focus": "pattern_exploration",
            "ui_config": {
                "interactive": True,
                "showAnimation": True,
                "color": "#4F46E5",
                "mode": "pattern_discovery",
                "show_pattern_hints": True,
                "enable_exploration": True
            },
            "educational_context": {
                "learning_objective": "Discover patterns in mathematics through number relationships",
                "topic_title": "What is Mathematics",
                "focus_area": "Mathematical patterns and their explanations"
            },
            "message": f"🔍 Let's explore mathematical patterns using the number line! This connects to Topic 1.1: 'What is Mathematics' - discovering patterns around us."
        }
    
    return {
        "action": "show_number_line",
        "problem": problem,
        "operation": operation,
        "start": start,
        "end": end,
        "message": f"Displaying interactive number line for {problem} ({operation})"
    }


@tool
def demonstrate_number_line(problem: str, operation: str, start: int = 0, end: int = 20, topic_number: Optional[str] = None) -> dict:
    """Demonstrate step-by-step visual learning - enhanced with topic awareness."""
    
    # For topic 1.1, emphasize pattern discovery and mathematical thinking
    if topic_number == "1.1":
        return {
            "action": "demonstrate_number_line",
            "problem": problem,
            "operation": operation,
            "start": start,
            "end": end,
            "topic_focus": "pattern_discovery",
            "demonstration_style": "exploratory",
            "ui_config": {
                "auto_play": False,
                "step_duration": 3000,
                "student_controlled": True,
                "show_step_guidance": True,
                "enable_pattern_highlighting": True
            },
            "educational_context": {
                "topic_number": "1.1",
                "topic_title": "What is Mathematics",
                "learning_focus": "Mathematics is the search for patterns and their explanations",
                "connection_to_topic": "Number line patterns demonstrate how mathematics helps us understand relationships and patterns in numbers"
            },
            "message": f"🎯 Starting pattern discovery demonstration! This shows how mathematics helps us find and understand patterns - the core idea of Topic 1.1."
        }
    
    return {
        "action": "demonstrate_number_line",
        "problem": problem,
        "operation": operation,
        "start": start,
        "end": end,
        "message": f"Starting step-by-step demonstration of {problem}!"
    }


@tool
def practice_problem(problem: str, operation: str) -> dict:
    """Show a practice problem - enhanced with topic awareness."""
    return {
        "action": "practice_problem",
        "problem": problem,
        "operation": operation,
        "message": f"Here's a practice problem: {problem}"
    }


@tool
def open_calculator() -> dict:
    """Open a visual calculator - enhanced with topic awareness."""
    return {
        "action": "open_calculator",
        "message": "Opening the visual calculator for you to use"
    }

@tool
def show_pattern_explorer(
    difficulty: str = "medium",
    problem_type: str = "arithmetic",
    topic_number: str = "1.2"
) -> dict:
    """
    Show interactive pattern explorer for Topic 1.2
    
    Args:
        difficulty: easy, medium, or hard
        problem_type: arithmetic, geometric, fibonacci, or custom
        topic_number: Topic number for context
        
    Returns:
        dict: Pattern explorer configuration
    """
    print(f"🔍 [PATTERN EXPLORER] Activating for difficulty: {difficulty}, type: {problem_type}")
    
    return {
        "action": "show_pattern_explorer",
        "difficulty": difficulty,
        "problem_type": problem_type,
        "topic_number": topic_number,
        "message": f"🔍 Pattern Explorer ready! Explore {problem_type} patterns at {difficulty} difficulty."
    }

@tool 
def demonstrate_patterns(
    problem_type: str = "arithmetic",
    topic_number: str = "1.2"
) -> dict:
    """
    Show animated pattern demonstrations for Topic 1.2
    
    Args:
        problem_type: arithmetic, geometric, visual, or real_world
        topic_number: Topic number for context
        
    Returns:
        dict: Pattern demo configuration
    """
    print(f"🎬 [PATTERN DEMO] Starting demo for type: {problem_type}")
    
    return {
        "action": "demonstrate_patterns",
        "problem_type": problem_type,
        "topic_number": topic_number,
        "message": f"🎬 Starting animated pattern demonstration for {problem_type} patterns!"
    }

@tool
def practice_patterns(
    difficulty: str = "intermediate",
    problem_type: str = "complete_sequence",
    topic_number: str = "1.2"
) -> dict:
    """
    Launch pattern practice exercises for Topic 1.2
    
    Args:
        difficulty: beginner, intermediate, or advanced
        problem_type: complete_sequence, find_rule, predict_next, or create_pattern
        topic_number: Topic number for context
        
    Returns:
        dict: Pattern practice configuration
    """
    print(f"🎯 [PATTERN PRACTICE] Starting practice: {difficulty} {problem_type}")
    
    return {
        "action": "practice_patterns", 
        "difficulty": difficulty,
        "problem_type": problem_type,
        "topic_number": topic_number,
        "message": f"🎯 Pattern practice ready! Work on {problem_type} at {difficulty} level."
    }

@tool
def build_pattern(topic_number: str = "1.2") -> dict:
    """
    Launch pattern builder tool for Topic 1.2
    
    Args:
        topic_number: Topic number for context
        
    Returns:
        dict: Pattern builder configuration
    """
    print(f"🏗️ [PATTERN BUILDER] Launching pattern builder")
    
    return {
        "action": "build_pattern",
        "topic_number": topic_number,
        "message": "🏗️ Pattern Builder ready! Create your own unique number patterns."
    }

# NEW TOOLS FOR TOPIC 1.3: Visualising Number Sequences

@tool
def show_sequence_visualizer(
    difficulty: str = "intermediate",
    problem_type: str = "linear",
    topic_number: str = "1.3"
) -> dict:
    """
    Show sequence visualizer for Topic 1.3
    
    Args:
        difficulty: basic, intermediate, or advanced
        problem_type: linear, quadratic, exponential, or recursive
        topic_number: Topic number for context
        
    Returns:
        dict: Sequence visualizer configuration
    """
    print(f"📊 [SEQUENCE VISUALIZER] Activating for {difficulty} {problem_type} sequences")
    
    return {
        "action": "show_sequence_visualizer",
        "difficulty": difficulty,
        "problem_type": problem_type, 
        "topic_number": topic_number,
        "message": f"📊 Sequence Visualizer ready! Explore {problem_type} sequences at {difficulty} level."
    }

@tool
def demonstrate_sequences(
    problem_type: str = "growth_patterns",
    topic_number: str = "1.3"
) -> dict:
    """
    Show animated sequence demonstrations for Topic 1.3
    
    Args:
        problem_type: growth_patterns, visual_sequences, or mathematical_sequences
        topic_number: Topic number for context
        
    Returns:
        dict: Sequence demo configuration
    """
    print(f"🎬 [SEQUENCE DEMO] Starting demo for: {problem_type}")
    
    return {
        "action": "demonstrate_sequences",
        "problem_type": problem_type,
        "topic_number": topic_number,
        "message": f"🎬 Starting sequence animation demo for {problem_type}!"
    }

@tool
def practice_sequences(
    difficulty: str = "developing", 
    problem_type: str = "find_term",
    topic_number: str = "1.3"
) -> dict:
    """
    Launch sequence practice exercises for Topic 1.3
    
    Args:
        difficulty: starter, developing, or mastery
        problem_type: find_term, find_rule, graph_sequence, or compare_sequences
        topic_number: Topic number for context
        
    Returns:
        dict: Sequence practice configuration
    """
    print(f"🎯 [SEQUENCE PRACTICE] Starting practice: {difficulty} {problem_type}")
    
    return {
        "action": "practice_sequences",
        "difficulty": difficulty,
        "problem_type": problem_type,
        "topic_number": topic_number,
        "message": f"🎯 Sequence practice ready! Work on {problem_type} at {difficulty} level."
    }

@tool
def build_sequence(topic_number: str = "1.3") -> dict:
    """
    Launch sequence builder tool for Topic 1.3
    
    Args:
        topic_number: Topic number for context
        
    Returns:
        dict: Sequence builder configuration
    """
    print(f"🏗️ [SEQUENCE BUILDER] Launching sequence builder")
    
    return {
        "action": "build_sequence",
        "topic_number": topic_number,
        "message": "🏗️ Sequence Builder ready! Create and visualize your own sequences."
    }

# Enhanced validation tool with pattern/sequence support
@tool
def validate_pattern_sequence_work(
    tool_type: str,
    problem_data: str,
    user_response: str,
    topic_context: Optional[str] = None
) -> dict:
    """
    Validate pattern/sequence work with educational feedback
    
    Args:
        tool_type: pattern_explorer, sequence_visualizer, etc.
        problem_data: JSON string of problem information
        user_response: Student's response or analysis
        topic_context: Current topic number
        
    Returns:
        dict: Validation result with educational feedback
    """
    try:
        from step_validator import StepValidator
        
        validator = StepValidator()
        print(f"🔍 [VALIDATION] Validating {tool_type} work for topic {topic_context}")
        
        # Parse problem data
        try:
            problem_info = json.loads(problem_data)
        except:
            problem_info = {"type": "unknown", "data": problem_data}
        
        # Topic-specific validation
        if topic_context == "1.2":  # Patterns
            result = validator.validate_pattern_work(
                pattern_type=problem_info.get("type", "arithmetic"),
                pattern_data=problem_info.get("sequence", []),
                user_analysis=user_response
            )
        elif topic_context == "1.3":  # Sequences  
            result = validator.validate_sequence_work(
                sequence_type=problem_info.get("type", "linear"),
                sequence_data=problem_info.get("terms", []),
                user_analysis=user_response
            )
        else:
            result = {
                "result": "validated",
                "is_correct": True,
                "feedback": "Great work exploring mathematical concepts!",
                "educational_insight": "Keep practicing to build stronger pattern recognition skills."
            }
        
        return {
            "action": "validate_pattern_sequence_work",
            "tool_type": tool_type,
            "topic_context": topic_context,
            "validation_result": result,
            "message": result.get("feedback", "Work validated successfully")
        }
        
    except Exception as e:
        print(f"❌ [VALIDATION ERROR] {str(e)}")
        return {
            "action": "validate_pattern_sequence_work",
            "validation_result": {
                "result": "completed",
                "is_correct": True,
                "feedback": "Excellent exploration! Keep discovering mathematical patterns.",
                "educational_insight": "Every attempt helps build mathematical intuition."
            },
            "message": "Great work with mathematical exploration!"
        }