'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductsCard';
import { fetchProducts, Product } from '@/services/api';

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
        <section className="max-w-8xl px-4 pt-6">
            <h2 className="m-4 text-2xl font-semibold mb-6">Productos Destacados</h2>

            <div
                className="
          px-4                /* espacio igual a izquierda y derecha */
          grid
          gap-6               /* mismo espacio en todas las direcciones */
          gap-6               /* mismo espacio en todas direcciones */
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
                        image={product.images && product.images.length > 0 ? product.images[0].url : '/taza.png'} // Fallback image
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
