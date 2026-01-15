'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Tag,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const menuItems = [
    { name: 'Panel de Control', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Gestión de Usuarios', href: '/admin/users', icon: Users },
    { name: 'Inventario', href: '/admin/products', icon: ShoppingBag },
    { name: 'Categorías', href: '/admin/categories', icon: Tag },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const MenuContent = () => (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase">Admin Control</span>
                    </div>
                    <ThemeToggle className="lg:hidden" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                    Impresiones<br /><span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Mágicas</span>
                </h2>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
                                isActive
                                    ? "bg-emerald-600/15 text-emerald-500 border border-emerald-500/30"
                                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-500" : "text-muted-foreground group-hover:text-emerald-400")} />
                                <span className="text-sm font-bold tracking-tight">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-border/50">
                <div className="hidden lg:flex justify-between items-center mb-6 px-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Apariencia</span>
                    <ThemeToggle />
                </div>
                <div className="bg-accent/30 dark:bg-card/50 rounded-2xl p-4 mb-4 border border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Operador</p>
                    <p className="text-sm font-bold text-foreground truncate">{user?.name || user?.email}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-4 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Terminar Sesión</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 z-40">
                <h2 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent uppercase tracking-wider">
                    IM Admin
                </h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-foreground/70 hover:text-foreground"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col h-full bg-background text-foreground w-64 fixed left-0 top-0 border-r border-border z-50">
                <MenuContent />
            </aside>

            {/* Mobile/Tablet Sidebar Drawer */}
            <aside className={cn(
                "lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-background text-foreground z-50 transition-transform duration-500 ease-in-out border-r border-border flex flex-col shadow-2xl",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <MenuContent />
            </aside>

            {/* Spacer for desktop layout */}
            <div className="hidden lg:block w-64 shrink-0" />

            {/* Spacer for mobile layout top bar */}
            <div className="lg:hidden h-16 w-full" />
        </>
    );
}
