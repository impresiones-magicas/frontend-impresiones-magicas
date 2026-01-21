'use client';

import React, { useState, useRef, useEffect } from 'react';

import { PrintArea } from '@/constants/print-areas';

interface ProductCanvasProps {
    productImage: string;
    customImage?: string;
    position: { x: number; y: number };
    scale: number;
    onPositionChange?: (position: { x: number; y: number }) => void;
    printArea?: PrintArea;
}

export default function ProductCanvas({
    productImage,
    customImage,
    position,
    scale,
    onPositionChange,
    printArea,
}: ProductCanvasProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const isReadOnly = !onPositionChange;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!customImage || isReadOnly || !canvasRef.current) return;
        setIsDragging(true);

        const rect = canvasRef.current.getBoundingClientRect();
        // Calculate initial offset in percentages
        const xPercent = ( (e.clientX - rect.left) / rect.width ) * 100;
        const yPercent = ( (e.clientY - rect.top) / rect.height ) * 100;

        setDragStart({
            x: xPercent - position.x,
            y: yPercent - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !canvasRef.current || isReadOnly) return;

        const rect = canvasRef.current.getBoundingClientRect();
        
        // Calculate current mouse position in percentages relative to canvas
        const currentXPercent = ( (e.clientX - rect.left) / rect.width ) * 100;
        const currentYPercent = ( (e.clientY - rect.top) / rect.height ) * 100;

        let newX = currentXPercent - dragStart.x;
        let newY = currentYPercent - dragStart.y;

        // Apply movement constraints based on printArea or default bounds
        const area = printArea || { top: 0, left: 0, width: 100, height: 100 };
        
        // Approximate image size in percentages for better constraints
        // Since image is w-32 (128px) and canvas is max-w-2xl (approx 672px responsive)
        // 128/672 ≈ 19% at default scale. 
        const imgWidthPercent = 19 * scale;
        const imgHeightPercent = 19 * scale;

        const minX = area.left;
        const maxX = area.left + area.width - imgWidthPercent;
        const minY = area.top;
        const maxY = area.top + area.height - imgHeightPercent;

        onPositionChange?.({
            x: Math.max(minX, Math.min(newX, maxX)),
            y: Math.max(minY, Math.min(newY, maxY)),
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
                style={{ cursor: customImage && !isReadOnly ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
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
                            left: `${position.x}%`,
                            top: `${position.y}%`,
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

                {/* Printable zone indicator */}
                {isDragging && printArea && (
                    <div
                        className="absolute border-2 border-dashed border-blue-400/30 rounded-lg pointer-events-none"
                        style={{
                            top: `${printArea.top}%`,
                            left: `${printArea.left}%`,
                            width: `${printArea.width}%`,
                            height: `${printArea.height}%`,
                        }}
                    >
                        <div className="absolute -top-6 left-0 text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">
                            Zona de impresión segura
                        </div>
                    </div>
                )}

                {/* Grid overlay when dragging */}
                {isDragging && (
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
                            `,
                            backgroundSize: '25px 25px',
                        }}
                    />
                )}
            </div>

            {customImage && !isReadOnly && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        💡 Arrastra la imagen para posicionarla en el producto
                    </p>
                </div>
            )}
        </div>
    );
}
