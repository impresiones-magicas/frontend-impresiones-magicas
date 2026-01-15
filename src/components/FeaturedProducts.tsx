'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductsCard';
import { fetchProducts } from '@/services/api';
import { Product } from '@/types';
import { getMediaUrl } from '@/services/media';

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                // Filter only featured products
                setFeaturedProducts(data.filter(p => p.isFeatured));
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando productos destacados...</div>;
    if (featuredProducts.length === 0) return null;

    return (
        <section className="w-full max-w-8xl mx-auto px-4 py-12 bg-white">
            <h2 className="m-4 text-2xl font-semibold mb-6 text-gray-900">Productos Destacados</h2>

            <div
                className="
          px-4                /* espacio igual a izquierda y derecha */
          grid
          gap-6               /* mismo espacio en todas las direcciones */
          sm:grid-cols-2
          lg:grid-cols-4
        "
            >
                {featuredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        title={product.name}
                        description={product.description || ''}
                        price={product.price}
                        image={getMediaUrl(product.images?.[0]?.url) || '/taza.png'}
                        featured={product.isFeatured}
                        rating={5} // Default rating for now
                        reviews={0}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
