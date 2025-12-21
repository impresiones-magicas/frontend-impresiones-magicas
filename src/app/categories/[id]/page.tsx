
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductsCard';

// Generate static params for all categories (SSG)
export async function generateStaticParams() {
    return categoriesData.map((category) => ({
        id: category.id.toString(),
    }));
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const category = categoriesData.find((c) => c.id.toString() === id);

    if (!category) {
        notFound();
    }

    // Filter products by category
    const categoryProducts = productsData.filter(
        (p) => p.categoryId?.toString() === id
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow pt-4 pb-12 lg:pt-8 lg:pb-16">
                <div className="max-w-8xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="px-4 text-sm mb-6 lg:mb-8 text-gray-500 overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-gray-900 transition-colors">
                            Inicio
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href="/categories" className="hover:text-gray-900 transition-colors">
                            Categorías
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </nav>

                    {/* Category Header */}
                    <div className="px-4 mb-8 lg:mb-12">
                        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 lg:mb-4">
                            {category.name}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl">
                            {category.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {categoryProducts.length} {categoryProducts.length === 1 ? 'producto' : 'productos'} disponibles
                        </p>
                    </div>

                    {/* Products Grid */}
                    {categoryProducts.length > 0 ? (
                        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categoryProducts.map((product) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No hay productos disponibles
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Actualmente no tenemos productos en esta categoría.
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
                            >
                                Volver al inicio
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
