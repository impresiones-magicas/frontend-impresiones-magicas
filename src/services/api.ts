import { config } from './config';

export const api = {
    get: async <T>(endpoint: string, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${config.apiUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },

    post: async <T>(endpoint: string, body: any, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${config.apiUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },

    put: async <T>(endpoint: string, body: any, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${config.apiUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },

    delete: async <T>(endpoint: string, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${config.apiUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },
};
