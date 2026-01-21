import { api } from './api';
import { Cart } from '@/types';

/**
 * Servicio para gestionar el carrito de compras
 * Todas las funciones se comunican con el backend en /cart
 */

/**
 * Crea un nuevo carrito vacío en el backend
 * @returns El carrito creado con su ID único
 */
export const createCart = async (): Promise<Cart> => {
    const { data } = await api.post<Cart>('/cart', {});
    return data;
};

/**
 * Obtiene el carrito del usuario autenticado
 */
export const getUserCart = async (): Promise<Cart> => {
    const { data } = await api.get<Cart>('/cart/user');
    return data;
};

/**
 * Obtiene un carrito existente por su ID
 * @param cartId - ID del carrito a obtener
 * @returns El carrito con todos sus items y productos
 */
export const getCart = async (cartId: string): Promise<Cart> => {
    const { data } = await api.get<Cart>(`/cart/${cartId}`);
    return data;
};

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe
 * @param cartId - ID del carrito
 * @param productId - ID del producto a agregar
 * @param quantity - Cantidad a agregar (por defecto 1)
 * @returns El carrito actualizado
 */
export const addItemToCart = async (
    cartId: string,
    productId: string,
    quantity: number = 1
): Promise<Cart> => {
    const { data } = await api.post<Cart>(`/cart/${cartId}/items`, {
        productId,
        quantity,
    });
    return data;
};

/**
 * Elimina un item específico del carrito
 * @param cartId - ID del carrito
 * @param itemId - ID del item a eliminar
 * @returns El carrito actualizado
 */
export const removeItemFromCart = async (
    cartId: string,
    itemId: string
): Promise<Cart> => {
    const { data } = await api.delete<Cart>(`/cart/${cartId}/items/${itemId}`);
    return data;
};

/**
 * Obtiene o crea un carrito para el usuario actual
 * Si existe un cartId en localStorage, lo obtiene
 * Si no existe o falla, crea uno nuevo
 * @returns El carrito del usuario
 */
export const getOrCreateCart = async (): Promise<Cart> => {
    const cartId = localStorage.getItem('cartId');

    if (cartId) {
        try {
            return await getCart(cartId);
        } catch (error) {
            // Si el carrito no existe, crear uno nuevo
            console.log('Cart not found, creating new one');
        }
    }

    // Crear nuevo carrito y guardar su ID
    const newCart = await createCart();
    localStorage.setItem('cartId', newCart.id);
    return newCart;
};
