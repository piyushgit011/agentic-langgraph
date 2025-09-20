'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Teaching stages
export enum TeachingStage {
  TOPIC_INTRODUCTION = 'topic_introduction',
  DEMONSTRATION = 'demonstration', 
  UNDERSTANDING_CHECK = 'understanding_check',
  PRACTICE = 'practice',
  TOPIC_COMPLETION = 'topic_completion',
  SESSION_COMPLETE = 'session_complete'
}

// Practice difficulty levels
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium', 
  HARD = 'hard'
}

// State interface
interface TeachingFlowState {
  currentTopic: string | null;
  currentStage: TeachingStage;
  demonstrationCount: number;
  understandingConfirmed: boolean;
  practiceProblems: Array<{
    id: string;
    problem: string;
    answer: number;
    difficulty: DifficultyLevel;
    completed: boolean;
    attempts: number;
  }>;
  currentPracticeIndex: number;
  topicProgress: {
    [topicId: string]: {
      completed: boolean;
      demonstrationsGiven: number;
      practiceProblemsCompleted: number;
      totalPracticeProblems: number;
      completedAt?: Date;
    };
  };
  sessionStats: {
    topicsCompleted: number;
    totalDemonstrations: number;
    totalPracticeAttempts: number;
    sessionStarted: Date;
  };
}

// Action types
type TeachingFlowAction =
  | { type: 'START_TOPIC'; payload: { topicId: string } }
  | { type: 'START_DEMONSTRATION'; payload: { problem: string } }
  | { type: 'COMPLETE_DEMONSTRATION' }
  | { type: 'CONFIRM_UNDERSTANDING'; payload: { understood: boolean } }
  | { type: 'START_PRACTICE'; payload: { problems: Array<{ problem: string; answer: number; difficulty: DifficultyLevel }> } }
  | { type: 'COMPLETE_PRACTICE_PROBLEM'; payload: { problemId: string; correct: boolean } }
  | { type: 'COMPLETE_TOPIC' }
  | { type: 'RESET_SESSION' }
  | { type: 'MOVE_TO_NEXT_TOPIC' };

// Initial state
const initialState: TeachingFlowState = {
  currentTopic: null,
  currentStage: TeachingStage.TOPIC_INTRODUCTION,
  demonstrationCount: 0,
  understandingConfirmed: false,
  practiceProblems: [],
  currentPracticeIndex: 0,
  topicProgress: {},
  sessionStats: {
    topicsCompleted: 0,
    totalDemonstrations: 0,
    totalPracticeAttempts: 0,
    sessionStarted: new Date(),
  },
};

// Reducer
function teachingFlowReducer(state: TeachingFlowState, action: TeachingFlowAction): TeachingFlowState {
  switch (action.type) {
    case 'START_TOPIC':
      return {
        ...state,
        currentTopic: action.payload.topicId,
        currentStage: TeachingStage.TOPIC_INTRODUCTION,
        demonstrationCount: 0,
        understandingConfirmed: false,
        practiceProblems: [],
        currentPracticeIndex: 0,
      };

    case 'START_DEMONSTRATION':
      return {
        ...state,
        currentStage: TeachingStage.DEMONSTRATION,
        demonstrationCount: state.demonstrationCount + 1,
        sessionStats: {
          ...state.sessionStats,
          totalDemonstrations: state.sessionStats.totalDemonstrations + 1,
        },
      };

    case 'COMPLETE_DEMONSTRATION':
      return {
        ...state,
        currentStage: TeachingStage.UNDERSTANDING_CHECK,
      };

    case 'CONFIRM_UNDERSTANDING':
      if (action.payload.understood) {
        return {
          ...state,
          understandingConfirmed: true,
          currentStage: TeachingStage.PRACTICE,
        };
      } else {
        return {
          ...state,
          understandingConfirmed: false,
          currentStage: TeachingStage.DEMONSTRATION,
        };
      }

    case 'START_PRACTICE':
      const practiceProblems = action.payload.problems.map((problem, index) => ({
        id: `practice_${Date.now()}_${index}`,
        problem: problem.problem,
        answer: problem.answer,
        difficulty: problem.difficulty,
        completed: false,
        attempts: 0,
      }));

      return {
        ...state,
        practiceProblems,
        currentPracticeIndex: 0,
        currentStage: TeachingStage.PRACTICE,
      };

    case 'COMPLETE_PRACTICE_PROBLEM':
      const updatedProblems = state.practiceProblems.map(problem => {
        if (problem.id === action.payload.problemId) {
          return {
            ...problem,
            completed: action.payload.correct,
            attempts: problem.attempts + 1,
          };
        }
        return problem;
      });

      const nextIncompleteIndex = updatedProblems.findIndex(p => !p.completed);
      const allCompleted = updatedProblems.every(p => p.completed);

      return {
        ...state,
        practiceProblems: updatedProblems,
        currentPracticeIndex: allCompleted ? state.currentPracticeIndex : nextIncompleteIndex,
        currentStage: allCompleted ? TeachingStage.TOPIC_COMPLETION : TeachingStage.PRACTICE,
        sessionStats: {
          ...state.sessionStats,
          totalPracticeAttempts: state.sessionStats.totalPracticeAttempts + 1,
        },
      };

    case 'COMPLETE_TOPIC':
      const topicId = state.currentTopic!;
      const completedProblems = state.practiceProblems.filter(p => p.completed).length;

      return {
        ...state,
        currentStage: TeachingStage.TOPIC_COMPLETION,
        topicProgress: {
          ...state.topicProgress,
          [topicId]: {
            completed: true,
            demonstrationsGiven: state.demonstrationCount,
            practiceProblemsCompleted: completedProblems,
            totalPracticeProblems: state.practiceProblems.length,
            completedAt: new Date(),
          },
        },
        sessionStats: {
          ...state.sessionStats,
          topicsCompleted: state.sessionStats.topicsCompleted + 1,
        },
      };

    case 'MOVE_TO_NEXT_TOPIC':
      return {
        ...state,
        currentTopic: null,
        currentStage: TeachingStage.TOPIC_INTRODUCTION,
        demonstrationCount: 0,
        understandingConfirmed: false,
        practiceProblems: [],
        currentPracticeIndex: 0,
      };

    case 'RESET_SESSION':
      return {
        ...initialState,
        sessionStats: {
          ...initialState.sessionStats,
          sessionStarted: new Date(),
        },
      };

    default:
      return state;
  }
}

// Context
interface TeachingFlowContextType {
  state: TeachingFlowState;
  dispatch: React.Dispatch<TeachingFlowAction>;
  startTopic: (topicId: string) => void;
  startDemonstration: (problem: string) => void;
  completeDemonstration: () => void;
  confirmUnderstanding: (understood: boolean) => void;
  startPractice: (problems: Array<{ problem: string; answer: number; difficulty: DifficultyLevel }>) => void;
  completePracticeProblem: (problemId: string, correct: boolean) => void;
  completeTopic: () => void;
  moveToNextTopic: () => void;
  resetSession: () => void;
  getCurrentPracticeProblem: () => TeachingFlowState['practiceProblems'][0] | null;
  getTopicProgress: (topicId: string) => TeachingFlowState['topicProgress'][string] | null;
}

const TeachingFlowContext = createContext<TeachingFlowContextType | undefined>(undefined);

// Provider component
export function TeachingFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(teachingFlowReducer, initialState);

  const startTopic = (topicId: string) => {
    dispatch({ type: 'START_TOPIC', payload: { topicId } });
  };

  const startDemonstration = (problem: string) => {
    dispatch({ type: 'START_DEMONSTRATION', payload: { problem } });
  };

  const completeDemonstration = () => {
    dispatch({ type: 'COMPLETE_DEMONSTRATION' });
  };

  const confirmUnderstanding = (understood: boolean) => {
    dispatch({ type: 'CONFIRM_UNDERSTANDING', payload: { understood } });
  };

  const startPractice = (problems: Array<{ problem: string; answer: number; difficulty: DifficultyLevel }>) => {
    dispatch({ type: 'START_PRACTICE', payload: { problems } });
  };

  const completePracticeProblem = (problemId: string, correct: boolean) => {
    dispatch({ type: 'COMPLETE_PRACTICE_PROBLEM', payload: { problemId, correct } });
  };

  const completeTopic = () => {
    dispatch({ type: 'COMPLETE_TOPIC' });
  };

  const moveToNextTopic = () => {
    dispatch({ type: 'MOVE_TO_NEXT_TOPIC' });
  };

  const resetSession = () => {
    dispatch({ type: 'RESET_SESSION' });
  };

  const getCurrentPracticeProblem = () => {
    if (state.practiceProblems.length === 0 || state.currentPracticeIndex >= state.practiceProblems.length) {
      return null;
    }
    return state.practiceProblems[state.currentPracticeIndex];
  };

  const getTopicProgress = (topicId: string) => {
    return state.topicProgress[topicId] || null;
  };

  const value: TeachingFlowContextType = {
    state,
    dispatch,
    startTopic,
    startDemonstration,
    completeDemonstration,
    confirmUnderstanding,
    startPractice,
    completePracticeProblem,
    completeTopic,
    moveToNextTopic,
    resetSession,
    getCurrentPracticeProblem,
    getTopicProgress,
  };

  return (
    <TeachingFlowContext.Provider value={value}>
      {children}
    </TeachingFlowContext.Provider>
  );
}

// Hook to use the context
export function useTeachingFlow() {
  const context = useContext(TeachingFlowContext);
  if (context === undefined) {
    throw new Error('useTeachingFlow must be used within a TeachingFlowProvider');
  }
  return context;
}
