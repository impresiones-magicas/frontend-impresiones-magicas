'use client';

import React from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface CustomizationControlsProps {
    products: Product[];
    selectedProduct: Product | null;
    onProductSelect: (product: Product) => void;
    scale: number;
    onScaleChange: (scale: number) => void;
    onReset: () => void;
    hasCustomImage: boolean;
}

export default function CustomizationControls({
    products,
    selectedProduct,
    onProductSelect,
    scale,
    onScaleChange,
    onReset,
    hasCustomImage,
}: CustomizationControlsProps) {
    const handleScaleIncrease = () => {
        onScaleChange(Math.min(scale + 0.1, 3));
    };

    const handleScaleDecrease = () => {
        onScaleChange(Math.max(scale - 0.1, 0.5));
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 space-y-6">
            {/* Product Selector */}
            <div>
                <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona un producto
                </label>
                <select
                    id="product-select"
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                        const product = products.find((p) => p.id === e.target.value);
                        if (product) onProductSelect(product);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                    <option value="">-- Elige un producto --</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} - {formatPrice(product.price)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Display */}
            {selectedProduct && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Precio del producto</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(selectedProduct.price)}</p>
                </div>
            )}

            {/* Scale Controls */}
            {hasCustomImage && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tamaño del diseño
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleScaleDecrease}
                            disabled={scale <= 0.5}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Reducir tamaño"
                        >
                            <ZoomOut className="w-5 h-5 text-gray-700" />
                        </button>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={scale}
                            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <button
                            onClick={handleScaleIncrease}
                            disabled={scale >= 3}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Aumentar tamaño"
                        >
                            <ZoomIn className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                    <div className="mt-2 text-center">
                        <span className="text-sm text-gray-500">{Math.round(scale * 100)}%</span>
                    </div>
                </div>
            )}

            {/* Reset Button */}
            {hasCustomImage && (
                <button
                    onClick={onReset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                    <RotateCcw className="w-5 h-5" />
                    Reiniciar diseño
                </button>
            )}
        </div>
    );
}
