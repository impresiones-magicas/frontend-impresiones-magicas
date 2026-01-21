'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { validateImageFile, fileToDataUrl } from '@/lib/imageUtils';

interface ImageUploaderProps {
    onImageUpload: (dataUrl: string) => void;
    currentImage?: string;
    onClear?: () => void;
}

export default function ImageUploader({ onImageUpload, currentImage, onClear }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback(
        async (file: File) => {
            setError(null);

            const validation = validateImageFile(file);
            if (!validation.valid) {
                setError(validation.error || 'Error al validar la imagen');
                return;
            }

            try {
                const dataUrl = await fileToDataUrl(file);
                onImageUpload(dataUrl);
            } catch (err) {
                setError('Error al cargar la imagen');
            }
        },
        [onImageUpload]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                handleFile(files[0]);
            }
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                handleFile(files[0]);
            }
        },
        [handleFile]
    );

    if (currentImage) {
        return (
            <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
                    <img
                        src={currentImage}
                        alt="Imagen cargada"
                        className="w-full h-full object-contain"
                    />
                </div>
                {onClear && (
                    <button
                        onClick={onClear}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        aria-label="Eliminar imagen"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    relative border-2 border-dashed rounded-2xl p-8 lg:p-12 transition-all duration-300
                    ${isDragging
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                    }
                `}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="image-upload"
                />
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'} transition-colors`}>
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                            {isDragging ? '¡Suelta la imagen aquí!' : 'Arrastra tu imagen aquí'}
                        </p>
                        <p className="text-sm text-gray-500">
                            o haz clic para seleccionar un archivo
                        </p>
                    </div>
                    <p className="text-xs text-gray-400">
                        JPG, PNG, GIF o WebP (máx. 5MB)
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
}
