"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
// import { useCoAgent } from '@copilotkit/react-core';

interface MathTeacherState {
  currentTopic: string | null;
  selectedTopicNumber: string | null;
  activeTool: string | null;
  demoInProgress: boolean;
  lastProblem: string | null;
  completedProblems: string[];
  currentProgress: {
    correct: number;
    total: number;
  };
  // CoAgents specific fields
  currentProblem: string | null;
  userInteractions: any[];
  toolState: any;
  agentFeedback: string | null;
  awaitingUserInput: boolean;
  // Teaching flow specific fields
  currentQuestion?: string;
  currentContext?: string;
  completedTopics?: string[];
  practiceMode?: {
    difficulty: string;
    count: number;
    started: string;
  };
  lastPerformance?: string;
}

interface MathTeacherContextType {
  state: MathTeacherState;
  updateState: (updates: Partial<MathTeacherState>) => void;
  setState: (newState: MathTeacherState | ((prevState: MathTeacherState | undefined) => MathTeacherState)) => void;
  resetProgress: () => void;
  addCompletedProblem: (problem: string) => void;
}

const MathTeacherContext = createContext<MathTeacherContextType | undefined>(undefined);

const initialState: MathTeacherState = {
  currentTopic: null,
  selectedTopicNumber: null,
  activeTool: null,
  demoInProgress: false,
  lastProblem: null,
  completedProblems: [],
  currentProgress: { correct: 0, total: 0 },
  // CoAgents specific initial state
  currentProblem: null,
  userInteractions: [],
  toolState: {},
  agentFeedback: null,
  awaitingUserInput: false,
  // Teaching flow specific initial state
  currentQuestion: undefined,
  currentContext: undefined,
  completedTopics: [],
  practiceMode: undefined,
  lastPerformance: undefined
};

export function MathTeacherCoAgentProvider({ children }: { children: ReactNode }) {
  // Use local state management instead of CoAgents for now
  const [state, setState] = useState<MathTeacherState>(initialState);

  // Ensure state is always defined with fallback to initialState
  const currentState = state || initialState;

  const updateState = (updates: Partial<MathTeacherState>) => {
    setState(prev => ({ 
      ...initialState,
      ...prev, 
      ...updates 
    }));
  };

  const resetProgress = () => {
    updateState({
      completedProblems: [],
      currentProgress: { correct: 0, total: 0 }
    });
  };

  const addCompletedProblem = (problem: string) => {
    if (currentState) {
      updateState({
        completedProblems: [...currentState.completedProblems, problem],
        currentProgress: {
          ...currentState.currentProgress,
          total: currentState.currentProgress.total + 1
        }
      });
    }
  };

  return (
    <MathTeacherContext.Provider value={{
      state: currentState,
      updateState,
      setState,
      resetProgress,
      addCompletedProblem
    }}>
      {children}
    </MathTeacherContext.Provider>
  );
}

export function useMathTeacherCoAgent() {
  const context = useContext(MathTeacherContext);
  if (context === undefined) {
    throw new Error('useMathTeacherCoAgent must be used within a MathTeacherCoAgentProvider');
  }
  return context;
}

export function useMathTeacherState() {
  const context = useContext(MathTeacherContext);
  if (!context) {
    throw new Error('useMathTeacherState must be used within MathTeacherCoAgentProvider');
  }
  return context;
}