import { config } from './config';
import { Category, Product } from '@/types';

export const api = {
    get: async <T>(url: string): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`${config.apiUrl}${url}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return { data: await response.json() };
    },

    post: async <T>(url: string, body: any): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`${config.apiUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return { data: await response.json() };
    },

    patch: async <T>(url: string, body: any): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`${config.apiUrl}${url}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return { data: await response.json() };
    },

    delete: async <T>(url: string): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`${config.apiUrl}${url}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return { data: await response.json() };
    }
};

export const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories');
    return data;
};

export const fetchProduct = async (term: string): Promise<Product | null> => {
    try {
        const { data } = await api.get<Product>(`/products/${term}`);
        return data;
    } catch {
        return null;
    }
};

export const fetchProducts = async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products');
    return data;
};
