'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/types';
import { getOrCreateCart, addItemToCart, removeItemFromCart } from '@/services/cart';

/**
 * Interfaz que define las funciones y datos disponibles en el CartContext
 */
interface CartContextType {
    cart: Cart | null;                          // El carrito actual (null si aún no se ha cargado)
    loading: boolean;                           // Indica si estamos cargando el carrito
    itemCount: number;                          // Número total de items en el carrito
    addToCart: (productId: string, quantity?: number) => Promise<void>;  // Función para agregar productos
    removeFromCart: (itemId: string) => Promise<void>;                   // Función para eliminar items
    refreshCart: () => Promise<void>;           // Función para recargar el carrito
}

// Crear el contexto con valor inicial undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Provider del CartContext - Envuelve la aplicación para proporcionar el carrito
 * @param children - Componentes hijos que tendrán acceso al carrito
 */
export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Carga el carrito al montar el componente
     * Se ejecuta una sola vez cuando la aplicación inicia
     */
    useEffect(() => {
        loadCart();
    }, []);

    /**
     * Carga o crea el carrito del usuario
     */
    const loadCart = async () => {
        try {
            setLoading(true);
            const loadedCart = await getOrCreateCart();
            setCart(loadedCart);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Agrega un producto al carrito
     * @param productId - ID del producto a agregar
     * @param quantity - Cantidad a agregar (por defecto 1)
     */
    const addToCart = async (productId: string, quantity: number = 1) => {
        if (!cart) return;

        try {
            const updatedCart = await addItemToCart(cart.id, productId, quantity);
            setCart(updatedCart);
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    /**
     * Elimina un item del carrito
     * @param itemId - ID del item a eliminar
     */
    const removeFromCart = async (itemId: string) => {
        if (!cart) return;

        try {
            const updatedCart = await removeItemFromCart(cart.id, itemId);
            setCart(updatedCart);
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    /**
     * Recarga el carrito desde el servidor
     */
    const refreshCart = async () => {
        await loadCart();
    };

    /**
     * Calcula el número total de items en el carrito
     * Suma las cantidades de todos los items
     */
    const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                itemCount,
                addToCart,
                removeFromCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/**
 * Hook personalizado para usar el CartContext
 * Lanza un error si se usa fuera del CartProvider
 * @returns El contexto del carrito con todas sus funciones
 */
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
