'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function AdminModal({ isOpen, onClose, title, children, className }: AdminModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={cn(
                "relative bg-background border border-border rounded-3xl w-full flex flex-col shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden",
                "max-w-xl max-h-[90vh]",
                className
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <h3 className="text-xl font-bold text-foreground">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-all shadow-inner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {children}
                </div>
            </div>
        </div>
    );
}
