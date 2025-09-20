// contexts/SessionContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { useSession as useNextAuthSession } from 'next-auth/react';
// import { SessionService, SessionWithMessages } from '../../lib/session-service';

// Define SessionWithMessages interface locally
interface SessionWithMessages {
  id: string;
  title: string;
  topic?: string;
  topicNumber?: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    metadata?: any;
    timestamp: string;
  }>;
  completedTopics?: string[];
  createdAt: string;
  updatedAt: string;
}

interface SessionContextType {
  currentSession: SessionWithMessages | null;
  allSessions: SessionWithMessages[];
  isLoading: boolean;
  createNewSession: (title?: string, topic?: string, topicNumber?: string) => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
  addMessageToSession: (role: string, content: string, metadata?: any) => Promise<void>;
  markTopicCompleted: (topicNumber: string) => Promise<void>;
  isTopicCompletedInSession: (topicNumber: string) => boolean;
  refreshSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  // const { data: authSession, status } = useNextAuthSession();
  const [currentSession, setCurrentSession] = useState<SessionWithMessages | null>(null);
  const [allSessions, setAllSessions] = useState<SessionWithMessages[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user sessions when authenticated
  useEffect(() => {
    // Mock authentication for now
    const mockAuthSession = { user: { id: 'mock-user-id' } };
    const status = 'authenticated';
    
    if (status === 'authenticated' && mockAuthSession?.user?.id) {
      loadUserSessions();
    } else if (status === 'unauthenticated') {
      setCurrentSession(null);
      setAllSessions([]);
      setIsLoading(false);
    }
  }, []);

  const loadUserSessions = async () => {
    const mockAuthSession = { user: { id: 'mock-user-id' } };
    if (!mockAuthSession?.user?.id) return;

    try {
      setIsLoading(true);
      
      // Mock session data for now
      const mockSessions: SessionWithMessages[] = [];
      
      setCurrentSession(null);
      setAllSessions(mockSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async (title?: string, topic?: string, topicNumber?: string) => {
    if (!authSession?.user?.id) return;

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, topic, topicNumber }),
      });

      if (response.ok) {
        await loadUserSessions();
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const switchSession = async (sessionId: string) => {
    if (!authSession?.user?.id) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}/activate`, {
        method: 'POST',
      });

      if (response.ok) {
        await loadUserSessions();
      }
    } catch (error) {
      console.error('Error switching session:', error);
    }
  };

  const addMessageToSession = async (role: string, content: string, metadata?: any) => {
    if (!currentSession) return;

    try {
      const response = await fetch(`/api/sessions/${currentSession.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content, metadata }),
      });

      if (response.ok) {
        // Optimistically update current session
        const newMessage = await response.json();
        setCurrentSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null);
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const markTopicCompleted = async (topicNumber: string) => {
    if (!currentSession) return;

    try {
      await fetch(`/api/sessions/${currentSession.id}/complete-topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicNumber }),
      });

      // Update local state
      setCurrentSession(prev => prev ? {
        ...prev,
        completedTopics: [...(prev.completedTopics || []), topicNumber]
      } : null);
    } catch (error) {
      console.error('Error marking topic completed:', error);
    }
  };

  const isTopicCompletedInSession = (topicNumber: string): boolean => {
    return currentSession?.completedTopics?.includes(topicNumber) || false;
  };

  const refreshSessions = async () => {
    await loadUserSessions();
  };

  return (
    <SessionContext.Provider value={{
      currentSession,
      allSessions,
      isLoading,
      createNewSession,
      switchSession,
      addMessageToSession,
      markTopicCompleted,
      isTopicCompletedInSession,
      refreshSessions,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within SessionProvider');
  }
  return context;
}

// Export useSession for compatibility with existing imports
export { useNextAuthSession as useSession };