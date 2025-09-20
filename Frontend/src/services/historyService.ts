import axios from 'axios';

const API_BASE_URL = 'http://164.52.192.178/ai-agent';

export interface ThreadSession {
  thread_id: string;
  user_id: string;
  topic: string;
  mode: string;
  created_at: string;
  last_activity: string;
  total_messages: number;
  status: 'active' | 'completed' | 'paused';
}

export interface ThreadMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ThreadHistory {
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

class HistoryService {
  private sessions: ThreadSession[] = [];

  // Get all thread sessions for a user
  async getUserSessions(userId: string): Promise<ThreadSession[]> {
    try {
      // For now, we'll use localStorage to track sessions
      // In a real app, this would come from a backend API
      const storedSessions = localStorage.getItem(`thread_sessions_${userId}`);
      if (storedSessions) {
        this.sessions = JSON.parse(storedSessions);
      }
      return this.sessions;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  // Add a new session to history
  addSession(session: ThreadSession): void {
    const existingIndex = this.sessions.findIndex(s => s.thread_id === session.thread_id);

    if (existingIndex >= 0) {
      // Update existing session
      this.sessions[existingIndex] = {
        ...this.sessions[existingIndex],
        ...session,
        last_activity: new Date().toISOString()
      };
    } else {
      // Add new session
      this.sessions.unshift(session);
    }

    // Keep only last 50 sessions
    if (this.sessions.length > 50) {
      this.sessions = this.sessions.slice(0, 50);
    }

    // Save to localStorage
    localStorage.setItem(`thread_sessions_${session.user_id}`, JSON.stringify(this.sessions));
  }

  // Get thread history from backend
  async getThreadHistory(threadId: string): Promise<ThreadHistory | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/advanced/threads/${threadId}/history`);

      if (response.data.status === 'success') {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching thread history:', error);
      return null;
    }
  }

  // Update session activity
  updateSessionActivity(threadId: string, messageCount?: number): void {
    const sessionIndex = this.sessions.findIndex(s => s.thread_id === threadId);
    if (sessionIndex >= 0) {
      this.sessions[sessionIndex].last_activity = new Date().toISOString();
      if (messageCount !== undefined) {
        this.sessions[sessionIndex].total_messages = messageCount;
      }

      // Move to front
      const session = this.sessions.splice(sessionIndex, 1)[0];
      this.sessions.unshift(session);

      // Save to localStorage
      localStorage.setItem(`thread_sessions_${session.user_id}`, JSON.stringify(this.sessions));
    }
  }

  // Delete a session
  deleteSession(threadId: string, userId: string): void {
    this.sessions = this.sessions.filter(s => s.thread_id !== threadId);
    localStorage.setItem(`thread_sessions_${userId}`, JSON.stringify(this.sessions));
  }

  // Search sessions
  searchSessions(userId: string, query: string): ThreadSession[] {
    const allSessions = this.sessions.filter(s => s.user_id === userId);

    if (!query.trim()) {
      return allSessions;
    }

    const searchLower = query.toLowerCase();
    return allSessions.filter(session =>
      session.topic.toLowerCase().includes(searchLower) ||
      session.mode.toLowerCase().includes(searchLower) ||
      session.thread_id.toLowerCase().includes(searchLower)
    );
  }

  // Get sessions by topic
  getSessionsByTopic(userId: string, topic: string): ThreadSession[] {
    return this.sessions.filter(s =>
      s.user_id === userId &&
      s.topic.toLowerCase().includes(topic.toLowerCase())
    );
  }

  // Get sessions by mode
  getSessionsByMode(userId: string, mode: string): ThreadSession[] {
    return this.sessions.filter(s =>
      s.user_id === userId &&
      s.mode.toLowerCase() === mode.toLowerCase()
    );
  }
}

export const historyService = new HistoryService();
