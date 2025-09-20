const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5113/api';

interface EndpointConfig {
    path: string;
    method: string;
}

interface ApiConfig {
    BASE_URL: string;
    endpoints: Record<string, EndpointConfig>;
}

interface ApiConfigResult {
    url: string;
    method: string;
}

export const API_CONFIG: ApiConfig = {
    BASE_URL,
    endpoints: {
        // Auth
        login: {
            path: '/auth/login',
            method: 'POST',
        },
        logout: {
            path: '/auth/logout',
            method: 'POST',
        },
        autoLogin: {
            path: '/auth/auto-login',
            method: 'GET',
        },
        register: {
            path: '/auth/register',
            method: 'POST',
        },

        // Registration Flow
        checkEmail: {
            path: '/registration/check-email',
            method: 'GET',
        },
        registration: {
            path: '/registration',
            method: 'POST',
        },

        // Academic Data
        boards: {
            path: '/board',
            method: 'GET',
        },
        classes: {
            path: '/grade',
            method: 'GET',
        },
        languages: {
            path: '/language',
            method: 'GET',
        },
        subjects: {
            path: '/subject',
            method: 'GET',
        },
        gradeByBoard: {
            path: '/grade/by-board',
            method: 'GET',
        },
        subjectByBoardGrade: {
            path: '/subject/by-board-grade',
            method: 'GET',
        },
        getChaptersTopics: {
            path: '/subject/get-chapters-topics',
            method: 'POST',
        },
        studentSelectedSubjects: {
            path: '/subject/student-selected',
            method: 'GET',
        },
        subjectChaptersTopics: {
            path: '/subject/{subjectId}/chapters-topics',
            method: 'GET',
        },

        // Agent
        agentAsk: {
            path: '/agent/ask',
            method: 'POST',
        },
        toolAnswerChecker: {
            path: '/agent/tool-answer-checker',
            method: 'POST',
        },
        systemPrompt: {
            path: '/system-prompts',
            method: 'GET',
        },
        createAgent: {
            path: '/system-prompts',
            method: 'POST',
        },
        updateAgent: {
            path: '/system-prompts/{id}',
            method: 'PUT',
        },
        getAgentById: {
            path: '/system-prompts/{id}',
            method: 'GET',
        },
        deleteAgent: {
            path: '/system-prompts/{id}',
            method: 'DELETE',
        },

        //topics
        topics: {
            path: '/topics',
            method: 'GET',
        },
        topicById: {
            path: '/topic/{topicId}',
            method: 'GET',
        },

        // History
        historyList: {
            path: '/history/history-list',
            method: 'GET',
        },
        myHistoryList: {
            path: '/history/my-history-list',
            method: 'GET',
        },
        myHistory: {
            path: '/history/my-history/{sessionId}',
            method: 'GET',
        },
        history: {
            path: '/history/{sessionId}',
            method: 'GET',
        },
        deleteHistory: {
            path: '/history/{sessionId}',
            method: 'DELETE',
        },
        toolData: {
            path: '/agent/Tool-Data',
            method: 'POST',
        },
        // Tools
        tools: {
            path: '/tool',
            method: 'GET',
        },
        createTool: {
            path: '/tool',
            method: 'POST',
        },
        toolById: {
            path: '/tool/{toolId}',
            method: 'GET',
        },
        updateTool: {
            path: '/tool/{toolId}',
            method: 'PUT',
        },
        deleteTool: {
            path: '/tool/{toolId}',
            method: 'DELETE',
        },
    },
};

// Log the API configuration for debugging
console.log('API Configuration:', {
    BASE_URL,
    endpoints: Object.keys(API_CONFIG.endpoints)
});

export const getApiUrl = (endpoint: string, pathParams: Record<string, string> = {}): string => {
    const endpointConfig = API_CONFIG.endpoints[endpoint];
    if (!endpointConfig) {
        throw new Error(`Endpoint ${endpoint} not found in API configuration`);
    }

    let baseUrl = API_CONFIG.BASE_URL;

    // Replace path parameters in the URL
    let path = endpointConfig.path;
    Object.keys(pathParams).forEach(key => {
        path = path.replace(`{${key}}`, pathParams[key]);
    });

    const fullUrl = `${baseUrl}${path}`;
    console.log(`Generated API URL for ${endpoint}:`, fullUrl);

    return fullUrl;
};

export const getApiConfig = (endpoint: string, pathParams: Record<string, string> = {}): ApiConfigResult => {
    const endpointConfig = API_CONFIG.endpoints[endpoint];
    if (!endpointConfig) {
        throw new Error(`Endpoint ${endpoint} not found in API configuration`);
    }

    let baseUrl = API_CONFIG.BASE_URL;

    // Replace path parameters in the URL
    let path = endpointConfig.path;
    Object.keys(pathParams).forEach(key => {
        path = path.replace(`{${key}}`, pathParams[key]);
    });

    const fullUrl = `${baseUrl}${path}`;

    return {
        url: fullUrl,
        method: endpointConfig.method
    };
}; 
