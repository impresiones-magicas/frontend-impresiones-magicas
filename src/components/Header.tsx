"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, User as UserIcon, Package, AlertTriangle } from 'lucide-react';
import { fetchCategories } from '@/services/api';
import { Category } from '@/types';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);

    React.useEffect(() => {
        const loadCategories = async () => {
            // Dynamically import to avoid server-side issues if any, or just standard import
            const data = await fetchCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    // Filter featured and normal categories
    const featuredCategories = categories.filter(c => c.isFeatured && !c.parent); // Top level featured
    const productCategories = categories.filter(c => !c.isFeatured && !c.parent); // Top level normal (for "Productos" dropdown)

    return (
        <header className="w-full bg-white border-b relative z-50">
            {/* Top Bar */}
            <div className="border-b">
                <div className="w-full px-4 md:px-12 flex items-center justify-between py-4 gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="hidden md:flex w-10 h-10 bg-blue-600 rounded-full items-center justify-center text-white font-bold shrink-0">
                            IM
                        </div>
                        <span className="font-bold text-lg md:text-xl text-gray-900 tracking-tight block">
                            Impresiones Mágicas
                        </span>
                    </Link>

                    {/* Large Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl justify-center mx-auto">
                        <div className="relative w-full group">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-12 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                placeholder="¿Qué estás buscando hoy?"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-1 md:gap-4 shrink-0">
                        <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                ></path>
                            </svg>
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                0
                            </span>
                        </button>

                        <div className="hidden md:block h-6 w-px bg-gray-200"></div>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                                        <AvatarImage src={user.avatarUrl} alt={user.email} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                                            {user.name ? user.name.substring(0, 2).toUpperCase() : user.email.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-2xl z-[60] p-1.5 ring-1 ring-black/5 backdrop-blur-sm">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name || "Usuario"}</p>
                                            <p className="text-xs leading-none text-muted-foreground font-normal">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer transition-colors focus:bg-gray-100 py-2.5">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer transition-colors focus:bg-gray-100 py-2.5">
                                        <Package className="mr-2 h-4 w-4" />
                                        <span>Mis Pedidos</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuSeparator />

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5" onSelect={(e) => e.preventDefault()}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Cerrar Sesión</span>
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="border-gray-200 bg-white">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    ¿Cerrar sesión?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    ¿Estás seguro de que quieres cerrar tu sesión actual? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600">
                                                    Cerrar Sesión
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href="/login" className="hidden md:block px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">
                                    Iniciar Sesión
                                </Link>

                                {/* Mobile User Icon (Link to login if not logged in) */}
                                <Link href="/login" className="md:hidden p-2 text-gray-700 cursor-pointer">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        ></path>
                                    </svg>
                                </Link>

                                <Link href="/register" className="hidden md:block bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                                    Registrarse
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-700 cursor-pointer"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav (Desktop) */}
            <nav className="bg-white/80 backdrop-blur-md border-b hidden md:block border-gray-100 sticky top-0">
                <div className="w-full px-6 md:px-12">
                    <ul className="flex items-center gap-8 text-sm font-medium text-gray-600">
                        {/* Featured Categories (Top Level) */}
                        {featuredCategories.map(cat => (
                            <li key={cat.id} className="hover:text-blue-600 transition-colors">
                                <Link href={`/categories/${cat.id}`}>{cat.name}</Link>
                            </li>
                        ))}

                        {/* Dropdown for Products (Normal Categories) */}
                        <li className="relative group py-3">
                            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer">
                                Productos
                                <svg
                                    className="w-4 h-4 group-hover:rotate-180 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </button>

                            <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50">
                                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden p-2">
                                    {productCategories.length > 0 ? (
                                        productCategories.map(cat => (
                                            <div key={cat.id}>
                                                <Link href={`/categories/${cat.id}`} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium">
                                                    {cat.name}
                                                </Link>
                                                {/* Subcategories */}
                                                {cat.children && cat.children.length > 0 && (
                                                    <div className="pl-6">
                                                        {cat.children.map((child: Category) => (
                                                            <Link key={child.id} href={`/categories/${child.id}`} className="block px-4 py-1.5 text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                                                                {child.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-400">Cargando...</div>
                                    )}
                                </div>
                            </div>
                        </li>

                        <li className="hover:text-blue-600 transition-colors">
                            <Link href="#">Ofertas</Link>
                        </li>
                        <li className="hover:text-blue-600 transition-colors">
                            <Link href="#">Ayuda</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile Menu (Overlay) */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg z-50">
                    <nav className="flex flex-col p-4 bg-white max-h-[80vh] overflow-y-auto">
                        {featuredCategories.map(cat => (
                            <Link key={cat.id} href={`/categories/${cat.id}`} className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium text-gray-700">
                                {cat.name} (Destacado)
                            </Link>
                        ))}
                        <div className="py-2 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Productos</div>
                        {productCategories.map(cat => (
                            <div key={cat.id}>
                                <Link href={`/categories/${cat.id}`} className="block py-2 px-4 hover:bg-gray-100 rounded-lg font-medium text-gray-700">
                                    {cat.name}
                                </Link>
                                {cat.children && cat.children.map((child: Category) => (
                                    <Link key={child.id} href={`/categories/${child.id}`} className="block py-2 pl-8 pr-4 text-sm text-gray-600 hover:text-blue-600">
                                        {child.name}
                                    </Link>
                                ))}
                            </div>
                        ))}

                        <hr className="my-2 border-gray-200" />
                        <Link href="/login" className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium text-blue-600">
                            Iniciar Sesión
                        </Link>
                        <Link href="/register" className="py-3 px-4 bg-black text-white rounded-lg font-medium text-center mt-2">
                            Registrarse
                        </Link>
                    </nav>
                </div>
            )}

            {/* Mobile Search (Visible only on small screens) */}
            <div className="md:hidden border-b bg-white p-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar..."
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
