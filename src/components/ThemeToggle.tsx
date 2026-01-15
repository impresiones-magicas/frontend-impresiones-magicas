'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className={cn("w-10 h-10 rounded-2xl bg-accent animate-pulse", className)} />;

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
                "relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90 overflow-hidden",
                "bg-white border border-border shadow-sm",
                "dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-500 dark:border-emerald-500/30 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                className
            )}
            title={isDark ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 dark:opacity-100 transition-opacity" />
            <div className="relative w-5 h-5">
                <Sun className={cn(
                    "absolute inset-0 transition-all duration-500 transform",
                    isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )} />
                <Moon className={cn(
                    "absolute inset-0 transition-all duration-500 transform",
                    isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                )} />
            </div>
        </button>
    );
}
