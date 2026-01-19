import { config } from './config';
import { api } from './api';
import { User } from '@/types';

export interface LoginRequest {
    email: string;
    pass: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface RegisterRequest {
    name: string;
    email: string;
    pass: string;
    role: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>('/auth/login', {
            email: credentials.email,
            password: credentials.pass
        });
        return data;
    },

    register: async (data: RegisterRequest): Promise<User> => {
        const payload = {
            name: data.name,
            email: data.email,
            password: data.pass,
            role: data.role
        };
        const { data: user } = await api.post<User>('/auth/register', payload);
        return user;
    },
};
