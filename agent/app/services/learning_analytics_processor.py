"""
Real-time Learning Analytics Processing Service
"""
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
from app.models.student_profile import LearningAnalytics
from app.services.enhanced_memory_service import enhanced_memory_service
import asyncio
from collections import deque

@dataclass
class RealTimeMetrics:
    """Real-time learning metrics"""
    response_times: List[float]
    accuracy_trend: List[float]
    engagement_indicators: List[Dict[str, Any]]
    help_requests: List[Dict[str, datetime]]
    tool_usage: List[str]
    timestamp: datetime

class LearningAnalyticsProcessor:
    def __init__(self):
        # Store recent metrics for trend analysis
        self.user_metrics: Dict[str, deque] = {}
        self.session_analytics: Dict[str, RealTimeMetrics] = {}
        
    async def process_real_time_interaction(
        self, 
        user_id: str, 
        session_id: str,
        interaction_data: Dict[str, Any]
    ) -> LearningAnalytics:
        """Process real-time learning interaction and generate analytics"""
        
        # Initialize user metrics if not exists
        if user_id not in self.user_metrics:
            self.user_metrics[user_id] = deque(maxlen=100)  # Keep last 100 interactions
        
        # Process the interaction
        analytics = await self._analyze_interaction(user_id, session_id, interaction_data)
        
        # Store metrics
        self.user_metrics[user_id].append({
            "timestamp": datetime.now(),
            "accuracy": analytics.current_accuracy,
            "speed": analytics.current_speed,
            "engagement": analytics.current_engagement,
            "tool_used": interaction_data.get("tool_used"),
            "problem_difficulty": interaction_data.get("difficulty", 0.5)
        })
        
        # Update Mem0 with behavioral insights
        await self._update_memory_with_insights(user_id, session_id, analytics, interaction_data)
        
        return analytics
    
    async def _analyze_interaction(
        self, 
        user_id: str, 
        session_id: str,
        interaction_data: Dict[str, Any]
    ) -> LearningAnalytics:
        """Analyze individual interaction for learning patterns"""
        
        # Get historical data for comparison
        historical_metrics = self.user_metrics.get(user_id, deque())
        
        # Calculate current performance metrics
        current_accuracy = self._calculate_current_accuracy(user_id, interaction_data)
        current_speed = self._calculate_response_speed(interaction_data)
        engagement_score = self._calculate_engagement_score(user_id, interaction_data)
        
        # Detect behavioral patterns
        shows_frustration = self._detect_frustration_pattern(user_id, interaction_data)
        help_frequency = self._analyze_help_request_pattern(user_id)
        
        # Advanced analytics
        concept_retention = self._estimate_concept_retention(user_id, interaction_data)
        metacognitive_awareness = self._assess_metacognitive_awareness(user_id, interaction_data)
        
        return LearningAnalytics(
            user_id=user_id,
            session_id=session_id,
            topic_number=interaction_data.get("topic_number", "unknown"),
            current_accuracy=current_accuracy,
            current_speed=current_speed,
            current_engagement=engagement_score,
            current_difficulty_comfort=self._assess_difficulty_comfort(user_id),
            shows_frustration=shows_frustration,
            asks_for_help_frequently=help_frequency > 0.3,  # More than 30% of interactions
            prefers_hints_over_struggle=self._prefers_hints(user_id),
            completes_optional_problems=interaction_data.get("completed_optional", False),
            concept_retention=concept_retention,
            transfer_learning_ability=self._assess_transfer_learning(user_id),
            metacognitive_awareness=metacognitive_awareness,
            timestamp=datetime.now()
        )
    
    def _calculate_current_accuracy(self, user_id: str, interaction_data: Dict[str, Any]) -> float:
        """Calculate rolling accuracy from recent interactions"""
        recent_metrics = list(self.user_metrics.get(user_id, []))[-10:]  # Last 10 interactions
        
        if not recent_metrics:
            return 1.0 if interaction_data.get("is_correct", False) else 0.0
        
        # Weight recent interactions more heavily
        weights = np.logspace(0, 1, len(recent_metrics))
        accuracies = [m.get("accuracy", 0.5) for m in recent_metrics]
        
        # Include current interaction
        current_correct = 1.0 if interaction_data.get("is_correct", False) else 0.0
        accuracies.append(current_correct)
        weights = np.append(weights, weights[-1] * 1.5)  # Weight current interaction heavily
        
        return np.average(accuracies, weights=weights)
    
    def _detect_frustration_pattern(self, user_id: str, interaction_data: Dict[str, Any]) -> bool:
        """Detect signs of student frustration"""
        recent_metrics = list(self.user_metrics.get(user_id, []))[-5:]  # Last 5 interactions
        
        frustration_indicators = 0
        
        # Check for declining accuracy
        accuracies = [m.get("accuracy", 0.5) for m in recent_metrics]
        if len(accuracies) >= 3 and all(accuracies[i] > accuracies[i+1] for i in range(len(accuracies)-2)):
            frustration_indicators += 1
        
        # Check for increasing response time on similar problems
        if interaction_data.get("response_time", 0) > 60:  # More than 1 minute
            frustration_indicators += 1
        
        # Check for multiple consecutive errors
        if len(accuracies) >= 3 and all(acc < 0.5 for acc in accuracies[-3:]):
            frustration_indicators += 1
        
        # Check for help request frequency
        help_requests = interaction_data.get("help_requests_in_session", 0)
        if help_requests > 3:
            frustration_indicators += 1
        
        return frustration_indicators >= 2
    
    async def _update_memory_with_insights(
        self, 
        user_id: str, 
        session_id: str,
        analytics: LearningAnalytics,
        interaction_data: Dict[str, Any]
    ):
        """Update Mem0 with learning insights"""
        
        # Record learning interaction
        enhanced_memory_service.record_learning_interaction(
            user_id=user_id,
            session_id=session_id,
            topic_number=analytics.topic_number,
            interaction_data=interaction_data,
            analytics=analytics
        )
        
        # Track real-time analytics for profile updates
        enhanced_memory_service.track_real_time_analytics(
            user_id=user_id,
            session_id=session_id,
            analytics=analytics
        )
    
    def get_session_summary(self, user_id: str, session_id: str) -> Dict[str, Any]:
        """Generate session summary with insights"""
        session_metrics = self.session_analytics.get(session_id)
        if not session_metrics:
            return {"error": "Session not found"}
        
        return {
            "session_id": session_id,
            "duration": (datetime.now() - session_metrics.timestamp).seconds // 60,
            "average_accuracy": np.mean(session_metrics.accuracy_trend),
            "accuracy_trend": session_metrics.accuracy_trend,
            "tools_used": list(set(session_metrics.tool_usage)),
            "help_requests": len(session_metrics.help_requests),
            "engagement_level": np.mean([e.get("score", 0.5) for e in session_metrics.engagement_indicators]),
            "recommendations": self._generate_session_recommendations(session_metrics)
        }

# Global analytics processor instance
analytics_processor = LearningAnalyticsProcessor()