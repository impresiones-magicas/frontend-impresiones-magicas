'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/utils';

/**
 * Página del Carrito de Compras
 * 
 * Esta página muestra todos los productos que el usuario ha agregado al carrito.
 * Permite:
 * - Ver todos los items con imagen, nombre, precio y cantidad
 * - Aumentar/disminuir cantidad de cada producto
 * - Eliminar productos del carrito
 * - Ver el total del carrito
 * - Proceder al checkout
 */
export default function CartPage() {
    const { cart, loading, removeFromCart, addToCart } = useCart();

    /**
     * Maneja la eliminación de un producto del carrito
     */
    const handleRemoveItem = async (itemId: string, productName: string) => {
        try {
            await removeFromCart(itemId);
            toast.success('Producto eliminado', {
                description: `${productName} se ha eliminado del carrito`,
            });
        } catch (error) {
            toast.error('Error al eliminar', {
                description: 'Por favor, inténtalo de nuevo',
            });
        }
    };

    /**
     * Aumenta la cantidad de un producto en el carrito
     */
    const handleIncreaseQuantity = async (productId: string, productName: string) => {
        try {
            await addToCart(productId, 1);
        } catch (error) {
            toast.error('Error al actualizar cantidad', {
                description: 'Por favor, inténtalo de nuevo',
            });
        }
    };

    /**
     * Disminuye la cantidad de un producto en el carrito
     * Si la cantidad es 1, elimina el producto
     */
    const handleDecreaseQuantity = async (itemId: string, productId: string, currentQuantity: number, productName: string) => {
        if (currentQuantity === 1) {
            await handleRemoveItem(itemId, productName);
        } else {
            try {
                // Para disminuir, agregamos -1 (cantidad negativa)
                // Pero como el backend no soporta cantidades negativas,
                // tenemos que eliminar y volver a agregar con la cantidad correcta
                await removeFromCart(itemId);
                await addToCart(productId, currentQuantity - 1);
            } catch (error) {
                toast.error('Error al actualizar cantidad', {
                    description: 'Por favor, inténtalo de nuevo',
                });
            }
        }
    };


    /**
     * Convierte el precio a número (viene como string desde la BD)
     */
    const parsePrice = (price: number | string): number => {
        return typeof price === 'string' ? parseFloat(price) : price;
    };

    /**
     * Calcula el subtotal de un item (precio × cantidad)
     */
    const getItemSubtotal = (price: number | string, quantity: number) => {
        return parsePrice(price) * quantity;
    };

    /**
     * Calcula el total del carrito sumando todos los subtotales
     */
    const getCartTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => {
            return total + getItemSubtotal(item.product.price, item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 w-full max-w-8xl mx-auto px-4 md:px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando carrito...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const isEmpty = !cart?.items || cart.items.length === 0;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 w-full max-w-8xl mx-auto px-4 md:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Seguir comprando
                    </Link>
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Carrito de Compras
                    {!isEmpty && <span className="text-gray-500 text-xl ml-3">({cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'})</span>}
                </h1>

                {isEmpty ? (
                    /* Carrito Vacío */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
                        <p className="text-gray-600 mb-6">¡Agrega algunos productos para comenzar!</p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                        >
                            Explorar productos
                        </Link>
                    </div>
                ) : (
                    /* Carrito con Productos */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de Productos */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Imagen del Producto */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.product.images?.[0]?.url || '/placeholder.png'}
                                                alt={item.product.name}
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Información del Producto */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <Link
                                                    href={`/products/${item.product.slug || item.product.id}`}
                                                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                {item.product.description && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {item.product.description}
                                                    </p>
                                                )}
                                                <p className="text-xl font-bold text-gray-900 mt-2">
                                                    {formatPrice(item.product.price)}
                                                </p>
                                            </div>

                                            {/* Controles de Cantidad y Eliminar */}
                                            <div className="flex items-center justify-between mt-4">
                                                {/* Control de Cantidad */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleDecreaseQuantity(item.id, item.product.id, item.quantity, item.product.name)}
                                                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleIncreaseQuantity(item.product.id, item.product.name)}
                                                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                </div>

                                                {/* Botón Eliminar */}
                                                <button
                                                    onClick={() => handleRemoveItem(item.id, item.product.name)}
                                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                    <span className="hidden sm:inline">Eliminar</span>
                                                </button>
                                            </div>

                                            {/* Subtotal del Item */}
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    Subtotal: <span className="font-bold text-gray-900 text-lg">{formatPrice(getItemSubtotal(item.product.price, item.quantity))}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen del Pedido */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatPrice(getCartTotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span className="font-medium text-green-600">Gratis</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>{formatPrice(getCartTotal())}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-full text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                    Proceder al Pago
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Envío gratis en todos los pedidos
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
