import { useState, useCallback } from 'react';
import { apiService, ApiResponse } from '../services/apiService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiFunction(...args);
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific API hooks for common operations
export function useAuth() {
  const login = useApi(apiService.login.bind(apiService));
  const register = useApi(apiService.register.bind(apiService));
  const checkEmail = useApi(apiService.checkEmail.bind(apiService));
  const registration = useApi(apiService.registration.bind(apiService));

  return {
    login,
    register,
    checkEmail,
    registration,
    setAccessToken: apiService.setAccessToken.bind(apiService),
    getAccessToken: apiService.getAccessToken.bind(apiService),
    clearAccessToken: apiService.clearAccessToken.bind(apiService),
  };
}

export function useAcademicData() {
  const boards = useApi(apiService.getBoards.bind(apiService));
  const classes = useApi(apiService.getClasses.bind(apiService));
  const languages = useApi(apiService.getLanguages.bind(apiService));
  const subjects = useApi(apiService.getSubjects.bind(apiService));
  const studentSelectedSubjects = useApi(apiService.getStudentSelectedSubjects.bind(apiService));

  return {
    boards,
    classes,
    languages,
    subjects,
    studentSelectedSubjects,
  };
}

export function useAgent() {
  const askAgent = useApi(apiService.askAgent.bind(apiService));
  const getSystemPrompts = useApi(apiService.getSystemPrompts.bind(apiService));
  const createAgent = useApi(apiService.createAgent.bind(apiService));
  const updateAgent = useApi(apiService.updateAgent.bind(apiService));
  const getAgentById = useApi(apiService.getAgentById.bind(apiService));

  return {
    askAgent,
    getSystemPrompts,
    createAgent,
    updateAgent,
    getAgentById,
  };
}

export function useHistory() {
  const getHistoryList = useApi(apiService.getHistoryList.bind(apiService));
  const getMyHistoryList = useApi(apiService.getMyHistoryList.bind(apiService));
  const getMyHistory = useApi(apiService.getMyHistory.bind(apiService));
  const getHistory = useApi(apiService.getHistory.bind(apiService));

  return {
    getHistoryList,
    getMyHistoryList,
    getMyHistory,
    getHistory,
  };
}

export function useTopics() {
  const getTopics = useApi(apiService.getTopics.bind(apiService));

  return {
    getTopics,
  };
} 
