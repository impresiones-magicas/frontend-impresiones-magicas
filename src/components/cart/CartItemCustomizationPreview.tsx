'use client';

import React from 'react';
import ProductCanvas from '@/components/customize/ProductCanvas';
import { Customization, Product } from '@/types';

interface CartItemCustomizationPreviewProps {
    product: Product;
    customization: Customization;
}

export default function CartItemCustomizationPreview({
    product,
    customization,
}: CartItemCustomizationPreviewProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl overflow-hidden">
                <ProductCanvas
                    productImage={product.images?.[0]?.url || '/placeholder.png'}
                    customImage={customization.imageDataUrl || customization.imageUrl}
                    position={customization.position}
                    scale={customization.scale}
                />
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-2">Detalles de Personalización</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                        <span className="block text-blue-600 font-medium lowercase">Escala</span>
                        <span className="text-lg font-bold">{Math.round(customization.scale * 100)}%</span>
                    </div>
                    <div>
                        <span className="block text-blue-600 font-medium lowercase">Posición</span>
                        <span className="text-lg font-bold">X: {Math.round(customization.position.x)}%, Y: {Math.round(customization.position.y)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
