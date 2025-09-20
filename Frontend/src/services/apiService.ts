import { getApiConfig, getApiUrl } from '../api';
import { fetchData } from '../utils/apiUtils';

// Type definitions for API responses
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
  success?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  boardId: string;
  gradeId: string;
  subjects: string[];
  medium: string;
  phone: string;
  gender: string;
  parentName: string;
  parentPhone: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  boardId: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  boardId: string;
  gradeId: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  order: number;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  chapterId: string;
  order: number;
  type: string;
  content?: string;
  videoUrl?: string;
  data?: string;
}

export interface Agent {
  id: number;
  agent_name: string;
  prompt: string;
  is_active: boolean;
  model_name: string;
  temperature: number;
  max_tokens: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
}

export interface CreateAgentRequest {
  AgentName: string;
  Prompt: string;
  CreatedBy: string;
  ModelName: string;
  Temperature: number;
  MaxTokens: number;
}

export interface UpdateAgentRequest {
  agent_name?: string;
  prompt?: string;
  is_active?: boolean;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AgentAskRequest {
  message: string;
  agentId: string;
  sessionId?: string;
}

export interface AgentAskResponse {
  question: string;
  answer: string;
  sessionId: string;
  timestamp: string;
  responseTimeSeconds: number;
  toolId?: number;
  toolName?: string;
}

export interface HistoryItem {
  id: string;
  sessionId: string;
  agentId: string;
  agentName: string;
  subjectName: string;
  chapterName: string;
  topicName: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StudentSelectedSubjectsResponse {
  studentInfo: {
    regId: number;
    studentName: string;
    email: string;
    board: string;
    grade: string;
  };
  selectedSubjects: Subject[];
  totalSubjects: number;
}

export interface ToolDataRequest {
  toolId: string;
}

export interface ToolDataResponse {
  data: unknown;
  message?: string;
  success?: boolean;
}

// API Service Class
export class ApiService {
  private static instance: ApiService;

  private constructor() { }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentication APIs
  public async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const apiConfig = getApiConfig('login');
    const response = await fetchData<LoginResponse>(apiConfig.url, apiConfig.method, credentials);
    return response;
  }

  public async autoLogin(): Promise<ApiResponse<{ role: string; email: string; firstName: string; lastName: string; accessToken?: string | null; refreshToken?: string | null }>> {
    const apiConfig = getApiConfig('autoLogin');
    // Cookie-based session; no need to persist tokens client-side
    const response = await fetchData(apiConfig.url, apiConfig.method);
    return response;
  }

  public async logout(): Promise<ApiResponse<null>> {
    const apiConfig = getApiConfig('logout');
    const response = await fetchData<null>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
    return response;
  }

  public async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const apiConfig = getApiConfig('register');
    const response = await fetchData<LoginResponse>(apiConfig.url, apiConfig.method, userData);
    return response;
  }

  public async checkEmail(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    const apiConfig = getApiConfig('checkEmail');
    return await fetchData<{ exists: boolean }>(apiConfig.url, apiConfig.method, { email });
  }

  public async registration(userData: RegistrationRequest): Promise<ApiResponse<{ success: boolean }>> {
    const apiConfig = getApiConfig('registration');
    return await fetchData<{ success: boolean }>(apiConfig.url, apiConfig.method, userData);
  }

  // Academic Data APIs
  public async getBoards(): Promise<ApiResponse<Board[]>> {
    const apiConfig = getApiConfig('boards');
    return await fetchData<Board[]>(apiConfig.url, apiConfig.method);
  }

  public async getClasses(): Promise<ApiResponse<Class[]>> {
    const apiConfig = getApiConfig('classes');
    return await fetchData<Class[]>(apiConfig.url, apiConfig.method);
  }

  public async getLanguages(): Promise<ApiResponse<Language[]>> {
    const apiConfig = getApiConfig('languages');
    return await fetchData<Language[]>(apiConfig.url, apiConfig.method);
  }

  public async getSubjects(): Promise<ApiResponse<Subject[]>> {
    const apiConfig = getApiConfig('subjects');
    return await fetchData<Subject[]>(apiConfig.url, apiConfig.method);
  }

  public async getGradeByBoard(boardId: string): Promise<ApiResponse<Class[]>> {
    const apiConfig = getApiConfig('gradeByBoard');
    const url = `${getApiUrl('gradeByBoard')}?boardId=${boardId}`;
    return await fetchData<Class[]>(url, apiConfig.method);
  }

  public async getSubjectByBoardGrade(boardId: string, gradeId: string): Promise<ApiResponse<Subject[]>> {
    const apiConfig = getApiConfig('subjectByBoardGrade');
    const url = `${getApiUrl('subjectByBoardGrade')}?boardId=${boardId}&gradeId=${gradeId}`;
    return await fetchData<Subject[]>(url, apiConfig.method);
  }

  public async getChaptersTopics(subjectId: string): Promise<ApiResponse<Chapter[]>> {
    const apiConfig = getApiConfig('getChaptersTopics');
    return await fetchData<Chapter[]>(apiConfig.url, apiConfig.method, { subjectId }, { credentials: 'include' });
  }

  public async getStudentSelectedSubjects(): Promise<ApiResponse<StudentSelectedSubjectsResponse>> {
    const apiConfig = getApiConfig('studentSelectedSubjects');
    return await fetchData<StudentSelectedSubjectsResponse>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async getSubjectChaptersTopics(subjectId: string): Promise<ApiResponse<Chapter[]>> {
    const apiConfig = getApiConfig('subjectChaptersTopics', { subjectId });
    return await fetchData<Chapter[]>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  // Agent APIs
  public async askAgent(request: AgentAskRequest): Promise<ApiResponse<AgentAskResponse>> {
    const apiConfig = getApiConfig('agentAsk');
    return await fetchData<AgentAskResponse>(apiConfig.url, apiConfig.method, request, { credentials: 'include' });
  }

  public async getSystemPrompts(): Promise<ApiResponse<Agent[]>> {
    const apiConfig = getApiConfig('systemPrompt');
    return await fetchData<Agent[]>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async createAgent(agentData: CreateAgentRequest): Promise<ApiResponse<Agent>> {
    const apiConfig = getApiConfig('createAgent');
    return await fetchData<Agent>(apiConfig.url, apiConfig.method, agentData, { credentials: 'include' });
  }

  public async updateAgent(agentId: string, agentData: UpdateAgentRequest): Promise<ApiResponse<Agent>> {
    const url = getApiUrl('updateAgent', { id: agentId });
    const apiConfig = getApiConfig('updateAgent');
    return await fetchData<Agent>(url, apiConfig.method, agentData, { credentials: 'include' });
  }

  public async getAgentById(agentId: string): Promise<ApiResponse<Agent>> {
    const url = getApiUrl('getAgentById', { id: agentId });
    const apiConfig = getApiConfig('getAgentById');
    return await fetchData<Agent>(url, apiConfig.method, null, { credentials: 'include' });
  }

  public async deleteAgent(agentId: string): Promise<ApiResponse<{ message: string }>> {
    const url = getApiUrl('deleteAgent', { id: agentId });
    const apiConfig = getApiConfig('deleteAgent');
    return await fetchData<{ message: string }>(url, apiConfig.method, null, { credentials: 'include' });
  }

  public async toolAnswerChecker(request: any): Promise<ApiResponse<any>> {
    const apiConfig = getApiConfig('toolAnswerChecker');
    return await fetchData<any>(apiConfig.url, apiConfig.method, request, { credentials: 'include' });
  }

  // Topic APIs
  public async getTopics(): Promise<ApiResponse<Topic[]>> {
    const apiConfig = getApiConfig('topics');
    return await fetchData<Topic[]>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async getTopicById(topicId: string | number): Promise<ApiResponse<Topic>> {
    const apiConfig = getApiConfig('topicById', { topicId: String(topicId) });
    return await fetchData<Topic>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  // Tools APIs
  public async getTools(): Promise<ApiResponse<{ tools: any[]; pageData: { totalCount: number; page: number; pageSize: number } }>> {
    const apiConfig = getApiConfig('tools');
    // Return server response as-is; cookies included
    return await fetchData(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async getToolById(toolId: string | number): Promise<ApiResponse<any>> {
    const apiConfig = getApiConfig('toolById', { toolId: String(toolId) });
    return await fetchData(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async updateTool(toolId: string | number, body: any): Promise<ApiResponse<any>> {
    const apiConfig = getApiConfig('updateTool', { toolId: String(toolId) });
    return await fetchData(apiConfig.url, apiConfig.method, body, { credentials: 'include' });
  }

  public async createTool(body: any): Promise<ApiResponse<any>> {
    const apiConfig = getApiConfig('createTool');
    return await fetchData(apiConfig.url, apiConfig.method, body, { credentials: 'include' });
  }

  public async deleteTool(toolId: string | number): Promise<ApiResponse<any>> {
    const apiConfig = getApiConfig('deleteTool', { toolId: String(toolId) });
    return await fetchData(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  // History APIs
  public async getHistoryList(): Promise<ApiResponse<HistoryItem[]>> {
    const apiConfig = getApiConfig('historyList');
    return await fetchData<HistoryItem[]>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async getMyHistoryList(): Promise<ApiResponse<HistoryItem[]>> {
    const apiConfig = getApiConfig('myHistoryList');
    return await fetchData<HistoryItem[]>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async getMyHistory(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    const apiConfig = getApiConfig('myHistory', { sessionId });
    return await fetchData<ChatMessage[]>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async getHistory(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    const apiConfig = getApiConfig('history', { sessionId });
    return await fetchData<ChatMessage[]>(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async deleteHistory(sessionId: string): Promise<ApiResponse<any>> {
    const apiConfig = getApiConfig('deleteHistory', { sessionId });
    return await fetchData(apiConfig.url, apiConfig.method, null, { credentials: 'include' });
  }

  public async getToolData(request: ToolDataRequest): Promise<ApiResponse<ToolDataResponse>> {
    const apiConfig = getApiConfig('toolData');
    return await fetchData<ToolDataResponse>(apiConfig.url, apiConfig.method, request, { credentials: 'include' });
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

// Export individual API functions for convenience
export const authAPI = {
  login: (credentials: LoginRequest) => apiService.login(credentials),
  autoLogin: () => apiService.autoLogin(),
  logout: () => apiService.logout(),
  register: (userData: RegisterRequest) => apiService.register(userData),
  checkEmail: (email: string) => apiService.checkEmail(email),
  registration: (userData: RegistrationRequest) => apiService.registration(userData),
};

export const academicAPI = {
  getBoards: () => apiService.getBoards(),
  getClasses: () => apiService.getClasses(),
  getLanguages: () => apiService.getLanguages(),
  getSubjects: () => apiService.getSubjects(),
  getGradeByBoard: (boardId: string) => apiService.getGradeByBoard(boardId),
  getSubjectByBoardGrade: (boardId: string, gradeId: string) => apiService.getSubjectByBoardGrade(boardId, gradeId),
  getChaptersTopics: (subjectId: string) => apiService.getChaptersTopics(subjectId),
  getStudentSelectedSubjects: () => apiService.getStudentSelectedSubjects(),
  getSubjectChaptersTopics: (subjectId: string) => apiService.getSubjectChaptersTopics(subjectId),
};

export const agentAPI = {
  askAgent: (request: AgentAskRequest) => apiService.askAgent(request),
  getSystemPrompts: () => apiService.getSystemPrompts(),
  createAgent: (agentData: CreateAgentRequest) => apiService.createAgent(agentData),
  updateAgent: (agentId: string, agentData: UpdateAgentRequest) => apiService.updateAgent(agentId, agentData),
  getAgentById: (agentId: string) => apiService.getAgentById(agentId),
  deleteAgent: (agentId: string) => apiService.deleteAgent(agentId),
  toolAnswerChecker: (request: any) => apiService.toolAnswerChecker(request),
};

export const topicAPI = {
  getTopics: () => apiService.getTopics(),
  getTopicById: (topicId: string | number) => apiService.getTopicById(topicId),
};

export const historyAPI = {
  getHistoryList: () => apiService.getHistoryList(),
  getMyHistoryList: () => apiService.getMyHistoryList(),
  getMyHistory: (sessionId: string) => apiService.getMyHistory(sessionId),
  getHistory: (sessionId: string) => apiService.getHistory(sessionId),
  deleteHistory: (sessionId: string) => apiService.deleteHistory(sessionId),
};

export const toolAPI = {
  getToolData: (request: ToolDataRequest) => apiService.getToolData(request),
  getTools: () => apiService.getTools(),
  getToolById: (toolId: string | number) => apiService.getToolById(toolId),
  updateTool: (toolId: string | number, body: any) => apiService.updateTool(toolId, body),
  createTool: (body: any) => apiService.createTool(body),
  deleteTool: (toolId: string | number) => apiService.deleteTool(toolId),
}; 
