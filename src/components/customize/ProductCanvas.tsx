'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ProductCanvasProps {
    productImage: string;
    customImage?: string;
    position: { x: number; y: number };
    scale: number;
    onPositionChange: (position: { x: number; y: number }) => void;
}

export default function ProductCanvas({
    productImage,
    customImage,
    position,
    scale,
    onPositionChange,
}: ProductCanvasProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!customImage) return;
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Constrain to canvas bounds
        const maxX = rect.width - 100 * scale;
        const maxY = rect.height - 100 * scale;

        onPositionChange({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mouseup', handleMouseUp);
            return () => document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging]);

    return (
        <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div
                ref={canvasRef}
                className="relative aspect-square w-full max-w-2xl mx-auto bg-gray-50 rounded-xl overflow-hidden"
                onMouseMove={handleMouseMove}
                style={{ cursor: customImage ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
                {/* Product Background */}
                <img
                    src={productImage}
                    alt="Producto"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Custom Image Overlay */}
                {customImage && (
                    <div
                        className="absolute transition-opacity duration-200"
                        style={{
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            opacity: isDragging ? 0.8 : 1,
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        <img
                            src={customImage}
                            alt="Diseño personalizado"
                            className="w-32 h-32 object-contain select-none"
                            draggable={false}
                        />
                    </div>
                )}

                {/* Grid overlay when dragging */}
                {isDragging && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px',
                        }}
                    />
                )}
            </div>

            {customImage && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        💡 Arrastra la imagen para posicionarla en el producto
                    </p>
                </div>
            )}
        </div>
    );
}
