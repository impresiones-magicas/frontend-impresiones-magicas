import { api } from './api';
import { Review } from '@/types';

export const createReview = async (productId: string, rating: number, comment: string): Promise<Review> => {
    const { data } = await api.post<Review>('/reviews', {
        productId,
        rating,
        comment,
    });
    return data;
};

export const fetchProductReviews = async (productId: string): Promise<Review[]> => {
    const { data } = await api.get<Review[]>(`/reviews/product/${productId}`);
    return data;
};

export const fetchProductStats = async (productId: string): Promise<{ avgRating: number; reviewCount: number }> => {
    const { data } = await api.get<{ avgRating: number; reviewCount: number }>(`/reviews/stats/${productId}`);
    return data;
};
