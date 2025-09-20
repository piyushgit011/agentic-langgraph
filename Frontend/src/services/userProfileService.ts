/**
 * User Profile Service for fetching and managing user profiles
 */

interface UserProfile {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  email?: string;
  role: string;
  learning_style: string;
  preferred_difficulty: string;
  current_level: string;
  analytics: {
    total_topics_started: number;
    total_topics_completed: number;
    completion_rate: number;
    average_accuracy: number;
    total_study_time_hours: number;
    learning_velocity_per_week: number;
    current_streak: number;
    problems_solved: number;
    preferred_tools: string[];
  };
  topics_covered: string[];
  recent_activity: Array<{
    topic: string;
    duration_minutes: number;
    problems_attempted: number;
    problems_correct: number;
    accuracy: number;
    start_time: string | null;
    tools_used: string[];
  }>;
  created_at: string | null;
  last_active: string | null;
}

interface UserSummary {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics_started: number;
  topics_completed: number;
  last_active: string | null;
  overall_accuracy: number;
}

class UserProfileService {
  private baseUrl: string;

  constructor() {
    // this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.baseUrl = 'http://164.52.192.178/ai-agent';
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/${userId}/profile`);

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return a default profile for fallback
      return this.getDefaultProfile(userId);
    }
  }

  async getAllUsersSummary(): Promise<UserSummary[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/summary`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users summary: ${response.statusText}`);
      }

      const data = await response.json();
      return data.users;
    } catch (error) {
      console.error('Error fetching users summary:', error);
      // Return default users for fallback
      return this.getDefaultUsers();
    }
  }

  async updateUserProgress(
    userId: string,
    topic: string,
    interactionData: {
      duration_minutes?: number;
      accuracy?: number;
      problems_attempted?: number;
      problems_correct?: number;
      tools_used?: string[];
    }
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/${userId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          interaction_data: interactionData
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update user progress: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
  }

  private getDefaultProfile(userId: string): UserProfile {
    return {
      id: userId,
      name: `Student ${userId.slice(0, 8)}`,
      level: 'beginner',
      email: undefined,
      role: 'student',
      learning_style: 'adaptive',
      preferred_difficulty: 'adaptive',
      current_level: 'beginner',
      analytics: {
        total_topics_started: 0,
        total_topics_completed: 0,
        completion_rate: 0,
        average_accuracy: 0,
        total_study_time_hours: 0,
        learning_velocity_per_week: 0,
        current_streak: 0,
        problems_solved: 0,
        preferred_tools: []
      },
      topics_covered: [],
      recent_activity: [],
      created_at: new Date().toISOString(),
      last_active: null
    };
  }

  private getDefaultUsers(): UserSummary[] {
    return [
      {
        id: 'default_student_1',
        name: 'Alice Johnson',
        level: 'intermediate',
        topics_started: 5,
        topics_completed: 3,
        last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        overall_accuracy: 0.85
      },
      {
        id: 'default_student_2',
        name: 'Bob Smith',
        level: 'beginner',
        topics_started: 2,
        topics_completed: 1,
        last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        overall_accuracy: 0.72
      },
      {
        id: 'default_student_3',
        name: 'Carol Davis',
        level: 'advanced',
        topics_started: 8,
        topics_completed: 7,
        last_active: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        overall_accuracy: 0.93
      }
    ];
  }

  // Utility method to format last active time
  formatLastActive(lastActive: string | null): string {
    if (!lastActive) return 'Never';

    const date = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  }

  // Utility method to get completion percentage color
  getCompletionColor(completionRate: number): string {
    if (completionRate >= 0.8) return 'text-green-600';
    if (completionRate >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  }

  // Utility method to get level badge color
  getLevelColor(level: 'beginner' | 'intermediate' | 'advanced'): string {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

// Export singleton instance
export const userProfileService = new UserProfileService();
export type { UserProfile, UserSummary };
