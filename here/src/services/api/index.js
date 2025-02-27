import config from '../../config';

const API_URL = config.API_URL;

class ApiError extends Error {
    constructor(message, code, status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

// Generic API request handler with error handling
const apiRequest = async (endpoint, options = {}) => {
    try {
        const url = `${API_URL}${endpoint}`;
        console.log('Making API request to:', url);

        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { error: response.statusText };
            }
            throw new ApiError(
                errorData.error || 'Something went wrong',
                errorData.code || 'UNKNOWN_ERROR',
                response.status
            );
        }

        // Only try to parse JSON if we're expecting it
        if (response.headers.get('content-type')?.includes('application/json')) {
            return await response.json();
        }

        return { success: true };
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

export { apiRequest, ApiError }; 