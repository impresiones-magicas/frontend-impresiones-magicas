
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import productsData from '@/data/products.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Generate static params for all products (SSG)
export async function generateStaticParams() {
    return productsData.map((product) => ({
        id: product.id.toString(),
    }));
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = productsData.find((p) => p.id.toString() === id);

    if (!product) {
        notFound();
    }

    // Find related products (simple logic: same items excluding current one, take 4)
    const relatedProducts = productsData
        .filter((p) => p.id.toString() !== id)
        .slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow pt-4 pb-12 lg:pt-8 lg:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="text-sm mb-6 lg:mb-8 text-gray-500 overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-gray-900 transition-colors">
                            Inicio
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{product.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                        {/* Left Column: Image */}
                        <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex items-center justify-center">
                            <div className="relative w-full aspect-square max-w-[300px] lg:max-w-md mx-auto">
                                {/* Using standard img for simplicity matching original, ideally Next/Image */}
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Right Column: details */}
                        <div className="flex flex-col">
                            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 mb-2 lg:mb-4 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.326 1.163l-4.304 3.86a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.811.613L12 18.202l-4.605 2.682a.562.562 0 01-.811-.613l1.285-5.385a.562.562 0 00-.182-.557l-4.304-3.86a.562.562 0 01.326-1.163l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                            />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    ({product.reviews || 0} valoraciones)
                                </span>
                            </div>

                            <p className="text-3xl font-bold text-gray-900 mb-8">
                                ${product.price}
                            </p>

                            <div className="prose prose-lg text-gray-600 mb-8 leading-relaxed">
                                <p>{product.description}</p>
                                <p className="mt-4">
                                    Producto de alta calidad, diseñado para durar. Ideal para regalar o para darte un capricho personal.
                                    Personalización disponible bajo pedido.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 text-center cursor-pointer">
                                    Añadir al Carrito
                                </button>
                                <button className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-bold py-4 px-8 rounded-full hover:bg-gray-900 hover:text-white transition-colors text-center cursor-pointer">
                                    Comprar Ahora
                                </button>
                            </div>

                            <div className="border-t pt-8">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    Envío Gratis en pedidos superiores a $50
                                </h4>
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 12 2s10 4.477 10 10z" />
                                    </svg>
                                    Garantía de satisfacción 100%
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <section className="mt-20">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">
                            También te podría gustar
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <Link href={`/products/${p.id}`} key={p.id} className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col">
                                    <div className="aspect-square rounded-lg bg-gray-50 mb-4 overflow-hidden relative">
                                        <img src={p.image} alt={p.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{p.title}</h3>
                                    <p className="font-bold text-gray-900 mt-auto">${p.price}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
