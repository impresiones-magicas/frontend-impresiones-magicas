
import React from 'react';
import ProductCard from './ProductsCard';
import productsData from '@/data/products.json';

const FeaturedProducts = () => {
    const featuredProducts = productsData.filter(p => p.featured);

    return (
        <section className="max-w-8xl px-4 pt-6">
            <h2 className="m-4 text-2xl font-semibold mb-6">Productos Destacados</h2>

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
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
