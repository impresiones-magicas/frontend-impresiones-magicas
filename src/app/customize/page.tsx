'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/customize/ImageUploader';
import ProductCanvas from '@/components/customize/ProductCanvas';
import CustomizationControls from '@/components/customize/CustomizationControls';
import { Product } from '@/types';
import { fetchProducts } from '@/services/api';
import { getMediaUrl } from '@/services/media';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { getPrintArea } from '@/constants/print-areas';

export default function CustomizePage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [customImage, setCustomImage] = useState<string | undefined>(undefined);
    const [position, setPosition] = useState({ x: 35, y: 30 });
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const allProducts = await fetchProducts();
                // Filter only customizable products
                const customizableProducts = allProducts.filter((p) => p.isCustomizable);
                setProducts(customizableProducts);

                // Auto-select first product if available
                if (customizableProducts.length > 0) {
                    setSelectedProduct(customizableProducts[0]);
                }
            } catch (error) {
                console.error('Error loading products:', error);
                toast.error('Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const handleImageUpload = (dataUrl: string) => {
        setCustomImage(dataUrl);
        // Reset position when new image is uploaded (centered approximately)
        setPosition({ x: 35, y: 30 });
        setScale(1);
    };

    const handleClearImage = () => {
        setCustomImage(undefined);
        setPosition({ x: 35, y: 30 });
        setScale(1);
    };

    const handleReset = () => {
        handleClearImage();
    };

    const handleAddToCart = async () => {
        if (!selectedProduct) {
            toast.error('Por favor, selecciona un producto');
            return;
        }

        if (!customImage) {
            toast.error('Por favor, sube una imagen para personalizar el producto');
            return;
        }

        try {
            await addToCart(selectedProduct.id, 1, {
                imageDataUrl: customImage,
                position: position,
                scale: scale
            });
            
            toast.success(`¡${selectedProduct.name} personalizado añadido al carrito!`);
            
            // Optional: Redirect to cart after success
            router.push('/cart');
        } catch (error) {
            console.error('Error adding custom product to cart:', error);
            toast.error('Error al añadir el producto al carrito');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando productos personalizables...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No hay productos personalizables disponibles
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Actualmente no tenemos productos que se puedan personalizar. Vuelve pronto para ver nuestras novedades.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
            <Header />

            <main className="flex-grow py-8 lg:py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 lg:mb-12">
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                            <Sparkles className="w-10 h-10 text-blue-600" />
                            Personaliza tu Producto
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Crea diseños únicos subiendo tu propia imagen. Ajusta el tamaño y la posición para que quede perfecto.
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Left Column - Image Upload */}
                        <div className="lg:col-span-1 space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    1. Sube tu diseño
                                </h2>
                                <ImageUploader
                                    onImageUpload={handleImageUpload}
                                    currentImage={customImage}
                                    onClear={handleClearImage}
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    2. Ajusta el producto
                                </h2>
                                <CustomizationControls
                                    products={products}
                                    selectedProduct={selectedProduct}
                                    onProductSelect={setSelectedProduct}
                                    scale={scale}
                                    onScaleChange={setScale}
                                    onPositionChange={setPosition}
                                    onReset={handleReset}
                                    hasCustomImage={!!customImage}
                                />
                            </div>
                        </div>

                        {/* Right Column - Canvas Preview */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                3. Vista previa
                            </h2>
                            {selectedProduct ? (
                                <ProductCanvas
                                    productImage={getMediaUrl(selectedProduct.images?.[0]?.url) || '/taza.png'}
                                    customImage={customImage}
                                    position={position}
                                    scale={scale}
                                    onPositionChange={setPosition}
                                    printArea={selectedProduct ? getPrintArea(selectedProduct.name) : undefined}
                                />
                            ) : (
                                <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
                                    <p className="text-gray-500">Selecciona un producto para comenzar</p>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <div className="mt-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedProduct || !customImage}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    Añadir al Carrito
                                </button>
                                {(!selectedProduct || !customImage) && (
                                    <p className="text-sm text-gray-500 text-center mt-2">
                                        {!selectedProduct
                                            ? 'Selecciona un producto para continuar'
                                            : 'Sube una imagen para continuar'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
