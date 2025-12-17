"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white border-b relative z-50">
            {/* Top Bar */}
            <div className="border-b">
                <div className="w-full px-6 md:px-12 flex items-center justify-between py-4 gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            IM
                        </div>
                        <span className="font-bold text-xl text-gray-900 tracking-tight">
                            Impresiones Mágicas
                        </span>
                    </Link>

                    {/* Large Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl justify-center mx-auto">
                        <div className="relative w-full group">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-12 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
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

                        <button className="hidden md:block px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">
                            Iniciar Sesión
                        </button>

                        {/* Mobile User Icon */}
                        <button className="md:hidden p-2 text-gray-700 cursor-pointer">
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
                        </button>

                        <button className="hidden md:block bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                            Registrarse
                        </button>

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
            <nav className="bg-gray-50 border-b hidden md:block">
                <div className="w-full px-6 md:px-12">
                    <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
                        {/* Dropdown 1 */}
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
                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-2">
                                    <Link href="#" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                        Tazas Personalizadas
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                        Remeras Estampadas
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                        Llaveros y Pins
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                        Papelería
                                    </Link>
                                </div>
                            </div>
                        </li>

                        {/* Dropdown 2 */}
                        <li className="relative group py-3">
                            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer">
                                Ocasiones
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
                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-2">
                                    <Link href="#" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                        Cumpleaños
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                        Empresariales
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                        Fechas Especiales
                                    </Link>
                                </div>
                            </div>
                        </li>

                        <li className="hover:text-blue-600 transition-colors">
                            <Link href="#">Novedades</Link>
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
                    <nav className="flex flex-col p-4 bg-gray-50">
                        <Link href="#" className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium text-gray-700">
                            Productos
                        </Link>
                        <Link href="#" className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium text-gray-700">
                            Ocasiones
                        </Link>
                        <Link href="#" className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium text-gray-700">
                            Novedades
                        </Link>
                        <Link href="#" className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium text-gray-700">
                            Ofertas
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <Link href="#" className="py-3 px-4 hover:bg-gray-100 rounded-lg font-medium text-blue-600">
                            Iniciar Sesión
                        </Link>
                        <Link href="#" className="py-3 px-4 bg-black text-white rounded-lg font-medium text-center mt-2">
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
                        className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
