import { config } from './config';

export interface LoginRequest {
    email: string;
    pass: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        role: string;
        avatarUrl?: string;
        name?: string;
    };
}

export interface RegisterRequest {
    name: string;
    email: string;
    pass: string;
    role: string;
}

const api = {
    post: async <T>(url: string, body: any): Promise<T> => {
        const response = await fetch(`${config.apiUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    }
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        return api.post<LoginResponse>('/auth/login', {
            email: credentials.email,
            password: credentials.pass
        });
    },

    register: async (data: RegisterRequest): Promise<unknown> => {
        // Map 'pass' to 'password' as expected by backend CreateUserDto
        const payload = {
            name: data.name,
            email: data.email,
            password: data.pass,
            role: data.role
        };
        // Use standard api.post. The backend returns the created user entity.
        return api.post('/users', payload);
    },
};
