
import React from 'react';
import Link from 'next/link';
import categoriesData from '@/data/categories.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCardSquare from '@/components/CategoryCardSquare';

export default function CategoriesPage() {
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
                        <span className="text-gray-900 font-medium">Categorías</span>
                    </nav>

                    {/* Page Header */}
                    <div className="px-4 mb-8 lg:mb-12">
                        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 lg:mb-4">
                            Todas las Categorías
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl">
                            Explora nuestra amplia gama de productos personalizables para tu negocio o evento.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {categoriesData.length} {categoriesData.length === 1 ? 'categoría' : 'categorías'} disponibles
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className="px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {categoriesData.map((category) => (
                            <CategoryCardSquare key={category.id} {...category} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
