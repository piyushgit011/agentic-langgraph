interface FetchOptions {
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    [key: string]: any;
}

interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status?: number;
}

export const fetchData = async <T = any>(
    url: string,
    method: string = 'GET',
    payload: any = null,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
    try {
        // Default headers
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Prepare fetch configuration
        const config: RequestInit = {
            method: method.toUpperCase(),
            headers: defaultHeaders,
            credentials:'include', // Ensure credentials are included
            ...options
        };

        // Add body for methods that support it
        if (payload && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            config.body = JSON.stringify(payload);
        }

        // Add query parameters for GET requests
        if (payload && method.toUpperCase() === 'GET') {
            const queryParams = new URLSearchParams(payload);
            url += `?${queryParams.toString()}`;
        }

        // Make the API call
        const response = await fetch(url, config);

        // Check if response is ok
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // Parse response based on content type
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }

    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};

export const getAuthHeaders = (token: string): Record<string, string> => {
    return {
        'Authorization': `Bearer ${token}`
    };
};

export const fetchWithAuth = <T = any>(
    url: string,
    method: string,
    token: string,
    payload: any = null,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
    const authHeaders = getAuthHeaders(token);
    const mergedOptions = {
        ...options,
        headers: {
            ...authHeaders,
            ...options.headers
        }
    };
    return fetchData<T>(url, method, payload, mergedOptions);
}; 
