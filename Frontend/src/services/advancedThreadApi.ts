/**
 * Advanced Thread Management API Service
 * Integrates with the sophisticated TeacherAgent backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://164.52.192.178/ai-agent';

export interface CreateThreadRequest {
  user_id: string;
  topic: string;
  mode: 'teaching' | 'practice' | 'assessment';
}

export interface CreateThreadResponse {
  status: string;
  thread_id: string;
  user_id: string;
  topic: string;
  mode: string;
  message: string;
  capabilities: string[];
}

export interface SendMessageRequest {
  user_id: string;
  message: string;
}

export interface ThreadMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SendMessageResponse {
  status: string;
  messages: ThreadMessage[];
  thread_id: string;
  frontend_actions: any[];
  tools_used: string[];
  requires_human_input: boolean;
  interaction_type?: string;
}

export interface ThreadHistoryResponse {
  status: string;
  thread_id: string;
  messages: ThreadMessage[];
  total_messages: number;
  session_info: {
    topic: string;
    mode: string;
    student_id: string;
    tools_used: string[];
    created_at: string;
    last_activity: string;
  };
}

export interface HealthResponse {
  status: string;
  advanced_thread_management_enabled: boolean;
  database_url: string;
  agent_type: string;
  capabilities: {
    dynamic_prompting: boolean;
    subject_tools: string[];
    teaching_modes: string[];
    visualizations: boolean;
    human_in_the_loop: boolean;
    interruption_handling: boolean;
    frontend_actions: boolean;
    postgresql_persistence: boolean;
  };
  message: string;
}

class AdvancedThreadApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Create a new advanced thread session
   */
  async createThread(request: CreateThreadRequest): Promise<CreateThreadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/advanced/threads/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create thread');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating advanced thread:', error);
      throw error;
    }
  }

  /**
   * Send a message to an existing thread
   */
  async sendMessage(threadId: string, request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/advanced/threads/${threadId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message to advanced thread:', error);
      throw error;
    }
  }

  /**
   * Get thread history
   */
  async getThreadHistory(threadId: string): Promise<ThreadHistoryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/advanced/threads/${threadId}/history`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get thread history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting thread history:', error);
      throw error;
    }
  }

  /**
   * Check health status of advanced thread management
   */
  async getHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/advanced/threads/health`);

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking advanced thread health:', error);
      throw error;
    }
  }

  /**
   * Get available subjects for dynamic prompting
   */
  getAvailableSubjects(): string[] {
    return ['basic_mathematics', 'probability', 'algebra'];
  }

  /**
   * Get available teaching modes
   */
  getAvailableTeachingModes(): Array<'teaching' | 'practice' | 'assessment'> {
    return ['teaching', 'practice', 'assessment'];
  }

  /**
   * Map topic to subject category for better API integration
   */
  mapTopicToSubject(topic: string): string {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('addition') || topicLower.includes('subtraction') ||
      topicLower.includes('multiplication') || topicLower.includes('division') ||
      topicLower.includes('number') || topicLower.includes('fraction') ||
      topicLower.includes('basic math')) {
      return 'basic_mathematics';
    } else if (topicLower.includes('probability') || topicLower.includes('chance') ||
      topicLower.includes('odds') || topicLower.includes('random') ||
      topicLower.includes('statistics')) {
      return 'probability';
    } else if (topicLower.includes('algebra') || topicLower.includes('equation') ||
      topicLower.includes('variable') || topicLower.includes('expression') ||
      topicLower.includes('solve')) {
      return 'algebra';
    } else {
      return 'basic_mathematics'; // Default fallback
    }
  }
}

// Export singleton instance
export const advancedThreadApi = new AdvancedThreadApiService();
export default advancedThreadApi;
