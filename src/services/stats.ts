import { api } from './api';

export interface DashboardStats {
    users: number;
    products: number;
    categories: number;
}

export const statsService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const { data } = await api.get<DashboardStats>('/stats/dashboard');
        return data;
    },
};
