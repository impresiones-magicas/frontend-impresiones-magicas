import { config } from './config';
import { Category, Product } from '@/types';
export type { Category, Product };

export const api = {
    get: async <T>(url: string): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = {};
        if (token && token !== 'null') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${config.apiUrl}${url}`, {
            headers,
        });
        if (response.status === 401) {
            window.dispatchEvent(new Event('unauthorized'));
            throw new Error('API Error: 401 Unauthorized');
        }
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return { data: await response.json() };
    },

    post: async <T>(url: string, body: any): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const isFormData = body instanceof FormData;

        const headers: Record<string, string> = {};
        if (token && token !== 'null') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${config.apiUrl}${url}`, {
            method: 'POST',
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });

        if (response.status === 401) {
            window.dispatchEvent(new Event('unauthorized'));
            throw new Error('API Error: 401 Unauthorized');
        }

        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return { data: await response.json() };
    },

    patch: async <T>(url: string, body: any): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const isFormData = body instanceof FormData;

        const headers: Record<string, string> = {};
        if (token && token !== 'null') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${config.apiUrl}${url}`, {
            method: 'PATCH',
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });

        if (response.status === 401) {
            window.dispatchEvent(new Event('unauthorized'));
            throw new Error('API Error: 401 Unauthorized');
        }

        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return { data: await response.json() };
    },

    delete: async <T>(url: string): Promise<{ data: T }> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = {};
        if (token && token !== 'null') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${config.apiUrl}${url}`, {
            method: 'DELETE',
            headers,
        });
        if (response.status === 401) {
            window.dispatchEvent(new Event('unauthorized'));
            throw new Error('API Error: 401 Unauthorized');
        }
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

export const fetchProducts = async (search?: string): Promise<Product[]> => {
    const url = search ? `/products?search=${encodeURIComponent(search)}` : '/products';
    const { data } = await api.get<Product[]>(url);
    return data;
};
