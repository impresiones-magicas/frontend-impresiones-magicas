
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductsCard';
import { fetchProducts } from '@/services/api';
import { getMediaUrl } from '@/services/media';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q: query } = await searchParams;
    
    // Fetch products based on query
    const results = query ? await fetchProducts(query) : [];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow pt-4 pb-12 lg:pt-8 lg:pb-16">
                <div className="max-w-8xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="px-4 text-sm mb-6 lg:mb-8 text-gray-500">
                        <Link href="/" className="hover:text-gray-900 transition-colors">
                            Inicio
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">Búsqueda</span>
                    </nav>

                    {/* Search Header */}
                    <div className="px-4 mb-8 lg:mb-12">
                        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 lg:mb-4">
                            Resultados para "{query || ''}"
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                        </p>
                    </div>

                    {/* Results Grid */}
                    {results.length > 0 ? (
                        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {results.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    slug={product.slug}
                                    title={product.name}
                                    description={product.description || ''}
                                    price={product.price}
                                    image={getMediaUrl(product.images?.[0]?.url) || '/taza.png'}
                                    featured={product.isFeatured}
                                    rating={product.avgRating || 0}
                                    reviews={product.reviewCount || 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 mx-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-10 h-10 text-gray-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No encontramos lo que buscas
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                No hay productos que coincidan exactamente con "{query}". 
                                Intenta con palabras más generales o revisa nuestras categorías.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors"
                                >
                                    Volver al inicio
                                </Link>
                                <Link
                                    href="/categories"
                                    className="inline-block bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-8 rounded-full transition-colors"
                                >
                                    Ver categorías
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
