/**
 * Advanced Thread Context
 * Global state management for advanced thread sessions
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { advancedThreadApi, HealthResponse } from '../services/advancedThreadApi';

interface ThreadSession {
  threadId: string;
  topic: string;
  mode: 'teaching' | 'practice' | 'assessment';
  userId: string;
  createdAt: string;
  lastActivity: string;
}

interface AdvancedThreadContextType {
  // State
  sessions: ThreadSession[];
  currentSession: ThreadSession | null;
  isLoading: boolean;
  error: string | null;
  health: HealthResponse | null;
  isHealthy: boolean;

  // Actions
  createSession: (userId: string, topic: string, mode: 'teaching' | 'practice' | 'assessment') => Promise<string>;
  setCurrentSession: (session: ThreadSession | null) => void;
  removeSession: (threadId: string) => void;
  refreshHealth: () => Promise<void>;
  clearError: () => void;
}

const AdvancedThreadContext = createContext<AdvancedThreadContextType | undefined>(undefined);

interface AdvancedThreadProviderProps {
  children: React.ReactNode;
}

export const AdvancedThreadProvider: React.FC<AdvancedThreadProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<ThreadSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ThreadSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Check health on mount
  useEffect(() => {
    refreshHealth();
  }, []);

  const refreshHealth = useCallback(async () => {
    try {
      const healthData = await advancedThreadApi.getHealth();
      setHealth(healthData);
      console.log('🏥 Advanced Thread Health Status:', healthData);
    } catch (error) {
      console.error('❌ Health check failed:', error);
      setHealth(null);
    }
  }, []);

  const createSession = useCallback(async (
    userId: string, 
    topic: string, 
    mode: 'teaching' | 'practice' | 'assessment'
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await advancedThreadApi.createThread({
        user_id: userId,
        topic,
        mode,
      });

      const newSession: ThreadSession = {
        threadId: response.thread_id,
        topic: response.topic,
        mode: response.mode as any,
        userId: response.user_id,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);

      console.log('✅ Session created:', response.thread_id);
      return response.thread_id;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
      setError(errorMessage);
      console.error('❌ Failed to create session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeSession = useCallback((threadId: string) => {
    setSessions(prev => prev.filter(session => session.threadId !== threadId));
    
    if (currentSession?.threadId === threadId) {
      setCurrentSession(null);
    }
  }, [currentSession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AdvancedThreadContextType = {
    // State
    sessions,
    currentSession,
    isLoading,
    error,
    health,
    isHealthy: health?.status === 'healthy' && health?.advanced_thread_management_enabled === true,

    // Actions
    createSession,
    setCurrentSession,
    removeSession,
    refreshHealth,
    clearError,
  };

  return (
    <AdvancedThreadContext.Provider value={value}>
      {children}
    </AdvancedThreadContext.Provider>
  );
};

export const useAdvancedThreadContext = (): AdvancedThreadContextType => {
  const context = useContext(AdvancedThreadContext);
  if (context === undefined) {
    throw new Error('useAdvancedThreadContext must be used within an AdvancedThreadProvider');
  }
  return context;
};

export default AdvancedThreadContext;
