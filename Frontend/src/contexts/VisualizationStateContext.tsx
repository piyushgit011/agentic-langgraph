import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

// Define the types for visualization states
// Tool/Demonstration State - for tracking ongoing tool executions
export interface ToolState {
  toolId: string;
  toolType: 'number_line_demo' | 'interactive_practice' | 'step_by_step_demo' | 'assessment';
  isActive: boolean;
  isInterrupted: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number; // 0-100
  data: any; // Tool-specific data
  timestamp: string;
  canResume: boolean;
  autoPlay?: boolean;
  stepDuration?: number;
}

// Number Line State
export interface NumberLineState {
  currentStep: number;
  isPlaying: boolean;
  isCompleted: boolean;
  mode: 'demonstration' | 'practice' | 'assessment';
  // Tool state integration
  toolState?: ToolState;
  // Additional state properties for InteractiveNumberLine
  isInitialized?: boolean;
  problem?: string;
  operation?: string;
  start?: number;
  end?: number;
  viewportStart?: number;
  viewportEnd?: number;
  userClicks?: number[];
  isWaitingForAgent?: boolean;
  localFeedback?: string;
  agentHighlight?: number;
  isDemoRunning?: boolean;
  demoStep?: number;
  // Additional state properties for InteractivePracticeVisualization
  userAnswer?: string;
  showHint?: boolean;
  isCorrect?: boolean | null;
  completedSteps?: number[];
  // Additional state properties for InteractivePracticeSessionVisualization
  studentPosition?: number;
  studentActions?: any[];
  awaitingHumanFeedback?: boolean;
  feedbackMessage?: string;
  showReasoningInput?: boolean;
  userReasoning?: string;
}

interface VennDiagramState {
  currentStep: number;
  selectedRegions: string[];
  isInteractive: boolean;
  userAnswers: Record<string, any>;
  // Tool state integration
  toolState?: ToolState;
}

interface AlgebraState {
  currentStep: number;
  userInput: string;
  isValidated: boolean;
  feedback?: string;
  // Tool state integration
  toolState?: ToolState;
}

interface VisualizationStates {
  numberLine: Record<string, NumberLineState>;
  vennDiagram: Record<string, VennDiagramState>;
  algebra: Record<string, AlgebraState>;
  // Session-level tool state management
  activeTools: Record<string, ToolState>; // toolId -> ToolState
  toolHistory: ToolState[]; // All tools that have been used in this session
}

// Actions for state management
type VisualizationAction =
  | { type: 'SET_NUMBER_LINE_STATE'; payload: { visualizationId: string; state: Partial<NumberLineState> } }
  | { type: 'SET_VENN_DIAGRAM_STATE'; payload: { visualizationId: string; state: Partial<VennDiagramState> } }
  | { type: 'SET_ALGEBRA_STATE'; payload: { visualizationId: string; state: Partial<AlgebraState> } }
  | { type: 'SET_TOOL_STATE'; payload: { toolId: string; state: Partial<ToolState> } }
  | { type: 'INTERRUPT_TOOL'; payload: { toolId: string } }
  | { type: 'RESUME_TOOL'; payload: { toolId: string } }
  | { type: 'COMPLETE_TOOL'; payload: { toolId: string } }
  | { type: 'RESET_VISUALIZATION'; payload: { visualizationId: string } }
  | { type: 'LOAD_SESSION_STATE'; payload: { sessionId: string; states: VisualizationStates } }
  | { type: 'CLEAR_SESSION'; payload: { sessionId: string } };

interface VisualizationStateContextType {
  states: Record<string, VisualizationStates>; // sessionId -> VisualizationStates
  currentSessionId: string | null;
  setNumberLineState: (visualizationId: string, state: Partial<NumberLineState>) => void;
  setVennDiagramState: (visualizationId: string, state: Partial<VennDiagramState>) => void;
  setAlgebraState: (visualizationId: string, state: Partial<AlgebraState>) => void;
  // Tool state management
  setToolState: (toolId: string, state: Partial<ToolState>) => void;
  interruptTool: (toolId: string) => void;
  resumeTool: (toolId: string) => void;
  completeTool: (toolId: string) => void;
  getToolState: (toolId: string) => ToolState | null;
  getActiveTools: () => ToolState[];
  getToolHistory: () => ToolState[];
  // Existing methods
  resetVisualization: (visualizationId: string) => void;
  loadSessionState: (sessionId: string, states?: VisualizationStates) => void;
  clearSession: (sessionId: string) => void;
  getNumberLineState: (visualizationId: string) => NumberLineState | null;
  getVennDiagramState: (visualizationId: string) => VennDiagramState | null;
  getAlgebraState: (visualizationId: string) => AlgebraState | null;
  saveStateToLocalStorage: () => void;
  loadStateFromLocalStorage: () => void;
}

const defaultNumberLineState: NumberLineState = {
  currentStep: 0,
  isPlaying: false,
  isCompleted: false,
  mode: 'demonstration',
  isInitialized: false,
  userClicks: [],
  isWaitingForAgent: false,
  localFeedback: '',
  isDemoRunning: false,
  demoStep: 0,
  studentPosition: 0,
  studentActions: [],
  awaitingHumanFeedback: false,
  feedbackMessage: '',
  showReasoningInput: false,
  userReasoning: ''
};

const defaultVennDiagramState: VennDiagramState = {
  currentStep: 0,
  selectedRegions: [],
  isInteractive: false,
  userAnswers: {}
};

const defaultAlgebraState: AlgebraState = {
  currentStep: 0,
  userInput: '',
  isValidated: false
};

const defaultVisualizationStates: VisualizationStates = {
  numberLine: {},
  vennDiagram: {},
  algebra: {},
  activeTools: {},
  toolHistory: []
};

const VisualizationStateContext = createContext<VisualizationStateContextType | undefined>(undefined);

// Reducer function
function visualizationStateReducer(
  state: { states: Record<string, VisualizationStates>; currentSessionId: string | null },
  action: VisualizationAction
): { states: Record<string, VisualizationStates>; currentSessionId: string | null } {
  switch (action.type) {
    case 'SET_NUMBER_LINE_STATE': {
      const { visualizationId, state: newState } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;
      const currentState = sessionStates.numberLine[visualizationId] || defaultNumberLineState;

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            numberLine: {
              ...sessionStates.numberLine,
              [visualizationId]: { ...currentState, ...newState }
            }
          }
        }
      };
    }

    case 'SET_VENN_DIAGRAM_STATE': {
      const { visualizationId, state: newState } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;
      const currentState = sessionStates.vennDiagram[visualizationId] || defaultVennDiagramState;

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            vennDiagram: {
              ...sessionStates.vennDiagram,
              [visualizationId]: { ...currentState, ...newState }
            }
          }
        }
      };
    }

    case 'SET_ALGEBRA_STATE': {
      const { visualizationId, state: newState } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;
      const currentState = sessionStates.algebra[visualizationId] || defaultAlgebraState;

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            algebra: {
              ...sessionStates.algebra,
              [visualizationId]: { ...currentState, ...newState }
            }
          }
        }
      };
    }

    case 'RESET_VISUALIZATION': {
      const { visualizationId } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            numberLine: { ...sessionStates.numberLine, [visualizationId]: defaultNumberLineState },
            vennDiagram: { ...sessionStates.vennDiagram, [visualizationId]: defaultVennDiagramState },
            algebra: { ...sessionStates.algebra, [visualizationId]: defaultAlgebraState }
          }
        }
      };
    }

    case 'LOAD_SESSION_STATE': {
      const { sessionId, states } = action.payload;
      return {
        ...state,
        currentSessionId: sessionId,
        states: {
          ...state.states,
          [sessionId]: states || defaultVisualizationStates
        }
      };
    }

    case 'CLEAR_SESSION': {
      const { sessionId } = action.payload;
      const newStates = { ...state.states };
      delete newStates[sessionId];

      return {
        ...state,
        states: newStates,
        currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
      };
    }

    case 'SET_TOOL_STATE': {
      const { toolId, state: newState } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;
      const currentTool = sessionStates.activeTools[toolId];

      const updatedTool = currentTool ? { ...currentTool, ...newState } : {
        toolId,
        toolType: 'number_line_demo' as const,
        isActive: true,
        isInterrupted: false,
        currentStep: 0,
        totalSteps: 0,
        progress: 0,
        data: {},
        timestamp: new Date().toISOString(),
        canResume: true,
        ...newState
      };

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            activeTools: {
              ...sessionStates.activeTools,
              [toolId]: updatedTool
            }
          }
        }
      };
    }

    case 'INTERRUPT_TOOL': {
      const { toolId } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;
      const currentTool = sessionStates.activeTools[toolId];

      if (!currentTool) return state;

      const updatedTool = {
        ...currentTool,
        isActive: false,
        isInterrupted: true,
        canResume: true,
        timestamp: new Date().toISOString()
      };

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            activeTools: {
              ...sessionStates.activeTools,
              [toolId]: updatedTool
            },
            toolHistory: [...sessionStates.toolHistory, updatedTool]
          }
        }
      };
    }

    case 'RESUME_TOOL': {
      const { toolId } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;
      const currentTool = sessionStates.activeTools[toolId];

      if (!currentTool || !currentTool.canResume) return state;

      const updatedTool = {
        ...currentTool,
        isActive: true,
        isInterrupted: false,
        timestamp: new Date().toISOString()
      };

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            activeTools: {
              ...sessionStates.activeTools,
              [toolId]: updatedTool
            }
          }
        }
      };
    }

    case 'COMPLETE_TOOL': {
      const { toolId } = action.payload;
      if (!state.currentSessionId) return state;

      const sessionStates = state.states[state.currentSessionId] || defaultVisualizationStates;
      const currentTool = sessionStates.activeTools[toolId];

      if (!currentTool) return state;

      const completedTool = {
        ...currentTool,
        isActive: false,
        isInterrupted: false,
        canResume: false,
        progress: 100,
        timestamp: new Date().toISOString()
      };

      const { [toolId]: removedTool, ...remainingActiveTools } = sessionStates.activeTools;

      return {
        ...state,
        states: {
          ...state.states,
          [state.currentSessionId]: {
            ...sessionStates,
            activeTools: remainingActiveTools,
            toolHistory: [...sessionStates.toolHistory, completedTool]
          }
        }
      };
    }

    default:
      return state;
  }
}

// Provider component
export const VisualizationStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(visualizationStateReducer, {
    states: {},
    currentSessionId: null
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('visualizationStates');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        Object.entries(parsed).forEach(([sessionId, states]) => {
          dispatch({ 
            type: 'LOAD_SESSION_STATE', 
            payload: { sessionId, states: states as VisualizationStates } 
          });
        });
      } catch (error) {
        console.error('Failed to load visualization states from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('visualizationStates', JSON.stringify(state.states));
  }, [state.states]);

  // Memoize the callback functions to prevent unnecessary re-renders
  const setNumberLineState = useCallback((visualizationId: string, newState: Partial<NumberLineState>) => {
    dispatch({ type: 'SET_NUMBER_LINE_STATE', payload: { visualizationId, state: newState } });
  }, []);

  const setVennDiagramState = useCallback((visualizationId: string, newState: Partial<VennDiagramState>) => {
    dispatch({ type: 'SET_VENN_DIAGRAM_STATE', payload: { visualizationId, state: newState } });
  }, []);

  const setAlgebraState = useCallback((visualizationId: string, newState: Partial<AlgebraState>) => {
    dispatch({ type: 'SET_ALGEBRA_STATE', payload: { visualizationId, state: newState } });
  }, []);

  const resetVisualization = useCallback((visualizationId: string) => {
    dispatch({ type: 'RESET_VISUALIZATION', payload: { visualizationId } });
  }, []);

  const loadSessionState = useCallback((sessionId: string, states?: VisualizationStates) => {
    dispatch({ 
      type: 'LOAD_SESSION_STATE', 
      payload: { sessionId, states: states || defaultVisualizationStates } 
    });
  }, []);

  const clearSession = useCallback((sessionId: string) => {
    dispatch({ type: 'CLEAR_SESSION', payload: { sessionId } });
  }, []);

  // Tool state management methods
  const setToolState = useCallback((toolId: string, newState: Partial<ToolState>) => {
    dispatch({ type: 'SET_TOOL_STATE', payload: { toolId, state: newState } });
  }, []);

  const interruptTool = useCallback((toolId: string) => {
    dispatch({ type: 'INTERRUPT_TOOL', payload: { toolId } });
  }, []);

  const resumeTool = useCallback((toolId: string) => {
    dispatch({ type: 'RESUME_TOOL', payload: { toolId } });
  }, []);

  const completeTool = useCallback((toolId: string) => {
    dispatch({ type: 'COMPLETE_TOOL', payload: { toolId } });
  }, []);

  const getToolState = useCallback((toolId: string): ToolState | null => {
    if (!state.currentSessionId) return null;
    const sessionStates = state.states[state.currentSessionId];
    return sessionStates?.activeTools[toolId] || null;
  }, [state.currentSessionId, state.states]);

  const getActiveTools = useCallback((): ToolState[] => {
    if (!state.currentSessionId) return [];
    const sessionStates = state.states[state.currentSessionId];
    return Object.values(sessionStates?.activeTools || {});
  }, [state.currentSessionId, state.states]);

  const getToolHistory = useCallback((): ToolState[] => {
    if (!state.currentSessionId) return [];
    const sessionStates = state.states[state.currentSessionId];
    return sessionStates?.toolHistory || [];
  }, [state.currentSessionId, state.states]);

  const getNumberLineState = useCallback((visualizationId: string): NumberLineState | null => {
    if (!state.currentSessionId) return null;
    const sessionStates = state.states[state.currentSessionId];
    return sessionStates?.numberLine[visualizationId] || null;
  }, [state.currentSessionId, state.states]);

  const getVennDiagramState = useCallback((visualizationId: string): VennDiagramState | null => {
    if (!state.currentSessionId) return null;
    const sessionStates = state.states[state.currentSessionId];
    return sessionStates?.vennDiagram[visualizationId] || null;
  }, [state.currentSessionId, state.states]);

  const getAlgebraState = useCallback((visualizationId: string): AlgebraState | null => {
    if (!state.currentSessionId) return null;
    const sessionStates = state.states[state.currentSessionId];
    return sessionStates?.algebra[visualizationId] || null;
  }, [state.currentSessionId, state.states]);

  const saveStateToLocalStorage = useCallback(() => {
    localStorage.setItem('visualizationStates', JSON.stringify(state.states));
  }, [state.states]);

  const loadStateFromLocalStorage = useCallback(() => {
    const savedState = localStorage.getItem('visualizationStates');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        Object.entries(parsed).forEach(([sessionId, states]) => {
          dispatch({ 
            type: 'LOAD_SESSION_STATE', 
            payload: { sessionId, states: states as VisualizationStates } 
          });
        });
      } catch (error) {
        console.error('Failed to load visualization states from localStorage:', error);
      }
    }
  }, []);

  const contextValue = useMemo<VisualizationStateContextType>(() => ({
    states: state.states,
    currentSessionId: state.currentSessionId,
    setNumberLineState,
    setVennDiagramState,
    setAlgebraState,
    // Tool state management
    setToolState,
    interruptTool,
    resumeTool,
    completeTool,
    getToolState,
    getActiveTools,
    getToolHistory,
    // Existing methods
    resetVisualization,
    loadSessionState,
    clearSession,
    getNumberLineState,
    getVennDiagramState,
    getAlgebraState,
    saveStateToLocalStorage,
    loadStateFromLocalStorage
  }), [
    state.states,
    state.currentSessionId,
    setNumberLineState,
    setVennDiagramState,
    setAlgebraState,
    setToolState,
    interruptTool,
    resumeTool,
    completeTool,
    getToolState,
    getActiveTools,
    getToolHistory,
    resetVisualization,
    loadSessionState,
    clearSession,
    getNumberLineState,
    getVennDiagramState,
    getAlgebraState,
    saveStateToLocalStorage,
    loadStateFromLocalStorage
  ]);

  return (
    <VisualizationStateContext.Provider value={contextValue}>
      {children}
    </VisualizationStateContext.Provider>
  );
};

// Hook to use the context
export const useVisualizationState = (): VisualizationStateContextType => {
  const context = useContext(VisualizationStateContext);
  if (context === undefined) {
    throw new Error('useVisualizationState must be used within a VisualizationStateProvider');
  }
  return context;
};

// Hook for number line state management
export const useNumberLineState = (visualizationId: string) => {
  const { getNumberLineState, setNumberLineState } = useVisualizationState();
  
  const state = getNumberLineState(visualizationId) || defaultNumberLineState;
  
  const updateState = useCallback((newState: Partial<NumberLineState>) => {
    setNumberLineState(visualizationId, newState);
  }, [setNumberLineState, visualizationId]);

  return [state, updateState] as const;
};

// Hook for Venn diagram state management
export const useVennDiagramState = (visualizationId: string) => {
  const { getVennDiagramState, setVennDiagramState } = useVisualizationState();
  
  const state = getVennDiagramState(visualizationId) || defaultVennDiagramState;
  
  const updateState = useCallback((newState: Partial<VennDiagramState>) => {
    setVennDiagramState(visualizationId, newState);
  }, [setVennDiagramState, visualizationId]);

  return [state, updateState] as const;
};

// Hook for algebra state management
export const useAlgebraState = (visualizationId: string) => {
  const { getAlgebraState, setAlgebraState } = useVisualizationState();
  
  const state = getAlgebraState(visualizationId) || defaultAlgebraState;
  
  const updateState = useCallback((newState: Partial<AlgebraState>) => {
    setAlgebraState(visualizationId, newState);
  }, [setAlgebraState, visualizationId]);

  return [state, updateState] as const;
};
