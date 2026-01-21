'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/types';
import { getOrCreateCart, addItemToCart, removeItemFromCart, getUserCart } from '@/services/cart';
import { useAuth } from './AuthContext';

/**
 * Interfaz que define las funciones y datos disponibles en el CartContext
 */
interface CartContextType {
    cart: Cart | null;                          // El carrito actual (null si aún no se ha cargado)
    loading: boolean;                           // Indica si estamos cargando el carrito
    itemCount: number;                          // Número total de items en el carrito
    addToCart: (productId: string, quantity?: number, customization?: any) => Promise<void>;  // Función para agregar productos
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
    const { user, isAuthenticated } = useAuth();

    /**
     * Carga el carrito al montar el componente
     * O cuando cambia el estado de autenticación
     */
    useEffect(() => {
        loadCart();
    }, [isAuthenticated]);

    /**
     * Carga o crea el carrito del usuario
     * @returns El carrito cargado
     */
    const loadCart = async (): Promise<Cart | null> => {
        try {
            setLoading(true);
            
            let loadedCart: Cart;
            
            // Si está autenticado, intentar cargar el carrito del usuario
            if (isAuthenticated) {
                loadedCart = await getUserCart();
                setCart(loadedCart);
                // Guardamos el cartId por si acaso, aunque el backend lo asocia al usuario
                localStorage.setItem('cartId', loadedCart.id);
            } else {
                // Si no está autenticado, usar el flujo normal de localStorage
                loadedCart = await getOrCreateCart();
                setCart(loadedCart);
            }
            
            return loadedCart;
        } catch (error) {
            console.error('Error loading cart:', error);
            // Si falla al cargar el carrito del usuario, intentamos crear uno nuevo
            if (isAuthenticated) {
                const newCart = await getOrCreateCart();
                setCart(newCart);
                return newCart;
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Agrega un producto al carrito
     * @param productId - ID del producto a agregar
     * @param quantity - Cantidad a agregar (por defecto 1)
     */
    const addToCart = async (productId: string, quantity: number = 1, customization?: any) => {
        try {
            let currentCart = cart;
            
            // Si no hay carrito, intentar cargarlo primero
            if (!currentCart) {
                console.log('Cart not loaded, attempting to load...');
                currentCart = await loadCart();
                
                // Si después de cargar sigue sin carrito, lanzar error
                if (!currentCart) {
                    throw new Error('No se pudo cargar el carrito');
                }
            }

            const updatedCart = await addItemToCart(currentCart.id, productId, quantity, customization);
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
