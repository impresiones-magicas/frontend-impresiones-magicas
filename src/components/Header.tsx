"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
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
import { LogOut, User as UserIcon, Package, AlertTriangle, ShoppingCart, Search, Loader2 } from 'lucide-react';
import { fetchCategories, fetchProducts } from '@/services/api';
import { Category, Product } from '@/types';
import { getMediaUrl } from '@/services/media';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 2) {
                setIsSearching(true);
                try {
                    const products = await fetchProducts(searchTerm);
                    setSearchResults(products.slice(0, 5)); // Limit to 5 results
                    setShowResults(true);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleResultClick = (productId: string) => {
        setSearchTerm('');
        setShowResults(false);
        router.push(`/products/${productId}`);
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim().length > 0) {
            setShowResults(false);
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // Filter featured and normal categories
    const featuredCategories = categories.filter(c => c.isFeatured && !c.parent); // Top level featured
    const productCategories = categories.filter(c => !c.isFeatured && !c.parent); // Top level normal (for "Productos" dropdown)

    return (
        <header className="w-full relative z-50 transition-colors" style={{ backgroundColor: 'white !important', color: 'var(--brand-text-primary) !important' }}>
            {/* Top Bar */}
            <div className="border-b">
                <div className="w-full px-4 md:px-12 flex items-center justify-between py-4 gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="hidden md:flex w-10 h-10 bg-blue-600 rounded-full items-center justify-center text-white font-bold shrink-0">
                            IM
                        </div>
                        <span className="font-bold text-lg md:text-xl tracking-tight block" style={{ color: 'var(--brand-text-primary)' }}>
                            Impresiones Mágicas
                        </span>
                    </Link>

                    {/* Large Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl justify-center mx-auto relative group">
                        <div className="w-full relative">
                            <input
                                type="text"
                                className="w-full border rounded-full py-3 pl-5 pr-12 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                style={{ color: 'var(--brand-text-primary)', borderColor: 'var(--brand-border)' }}
                                placeholder="¿Qué estás buscando hoy?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            />
                            <button 
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
                                onClick={handleSearchSubmit}
                            >
                                {isSearching ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Search className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                {searchResults.length > 0 ? (
                                    <div className="py-2">
                                        {searchResults.map((product) => (
                                            <button
                                                key={product.id}
                                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                                onClick={() => handleResultClick(product.id)}
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    <img
                                                        src={getMediaUrl(product.images?.[0]?.url) || '/taza.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--brand-text-primary)' }}>
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {product.category?.name || 'Producto'}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-bold text-blue-600">
                                                    {product.price}€
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No se han encontrado resultados para "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-1 md:gap-4 shrink-0">
                        <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                            <ShoppingCart className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

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
                                <DropdownMenuContent align="end" className="w-64 border shadow-2xl z-[60] p-1.5 backdrop-blur-md" style={{ backgroundColor: 'var(--brand-dropdown-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-text-primary)' }}>
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none" style={{ color: 'var(--brand-text-primary)' }}>{user.name || "Usuario"}</p>
                                            <p className="text-xs leading-none font-medium" style={{ color: 'var(--brand-text-secondary)' }}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer transition-colors focus:bg-gray-100 py-2.5" style={{ color: 'var(--brand-text-primary)' }}>
                                        <UserIcon className="mr-2 h-4 w-4" style={{ color: 'var(--brand-text-secondary)' }} />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer transition-colors focus:bg-gray-100 py-2.5" style={{ color: 'var(--brand-text-primary)' }}>
                                        <Package className="mr-2 h-4 w-4" style={{ color: 'var(--brand-text-secondary)' }} />
                                        <span>Mis Pedidos</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator style={{ backgroundColor: 'var(--brand-border)' }} />
                                    <DropdownMenuSeparator style={{ backgroundColor: 'var(--brand-border)' }} />

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
                                                <AlertDialogDescription style={{ color: 'var(--brand-text-secondary)' }}>
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
                            <Link key={cat.id} href={`/categories/${cat.id}`} className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium" style={{ color: 'var(--brand-text-primary)' }}>
                                {cat.name} (Destacado)
                            </Link>
                        ))}
                        <div className="py-2 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Productos</div>
                        {productCategories.map(cat => (
                            <div key={cat.id}>
                                <Link href={`/categories/${cat.id}`} className="block py-2 px-4 hover:bg-gray-100 rounded-lg font-medium" style={{ color: 'var(--brand-text-primary)' }}>
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
            <div className="md:hidden border-b bg-white p-4 relative">
                <div className="relative w-full">
                    <input
                        type="text"
                        className="w-full border rounded-full py-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ color: 'var(--brand-text-primary)', borderColor: 'var(--brand-border)' }}
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    />
                    <button 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={handleSearchSubmit}
                    >
                        {isSearching ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Search Results */}
                {showResults && (
                    <div className="absolute top-full left-0 w-full bg-white border-b shadow-2xl z-[100] max-h-[60vh] overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <div className="py-2">
                                {searchResults.map((product) => (
                                    <button
                                        key={product.id}
                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                                        onClick={() => handleResultClick(product.id)}
                                    >
                                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                                            <img
                                                src={getMediaUrl(product.images?.[0]?.url) || '/taza.png'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold truncate">
                                                {product.name}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {product.price}€
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
