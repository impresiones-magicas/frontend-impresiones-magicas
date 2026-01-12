import { config } from './config';

export interface Category {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    isFeatured: boolean;
    children?: Category[];
    parent?: Category;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    isFeatured: boolean;
    images: { id: string; url: string }[];
    slug?: string;
    category?: Category;
}

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch(`${config.apiUrl}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const fetchProduct = async (term: string): Promise<Product | null> => {
    try {
        const url = `${config.apiUrl}/products/${term}`;
        console.log(`Fetching product from: ${url}`);
        const response = await fetch(url);
        console.log(`Response status for ${term}:`, response.status);
        if (!response.ok) {
            console.error(`Failed to fetch product: ${response.status} ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${config.apiUrl}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
