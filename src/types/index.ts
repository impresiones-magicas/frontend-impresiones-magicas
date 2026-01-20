export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'user';
    avatarUrl?: string;
    lastPasswordChangeDate?: string;
    isPasswordExpired?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    isFeatured: boolean;
    children?: Category[];
    parent?: Category;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductImage {
    id: string;
    url: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    isFeatured: boolean;
    images: ProductImage[];
    slug?: string;
    category?: Category;
    avgRating?: number;
    reviewCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        avatarUrl?: string;
    };
}

// Cart Types
export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
}

export interface Cart {
    id: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}
