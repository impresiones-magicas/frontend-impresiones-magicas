
import React from 'react';
import CategoryCard from './CategoryCard';
import categoriesData from '@/data/categories.json';

const FeaturedCategories = () => {
    const featuredCategories = categoriesData.filter(c => c.featured);

    return (
        <section className="max-w-8xl px-4 py-6">
            <h2 className="mb-4 mx-4 text-2xl font-semibold mb-6">Categorías Destacadas</h2>

            <div
                className="
          px-4                /* espacio igual a izquierda y derecha */
          grid
          gap-6               /* mismo espacio en todas las direcciones */
          sm:grid-cols-2
          lg:grid-cols-4
        "
            >
                {featuredCategories.map(category => (
                    <CategoryCard key={category.id} {...category} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedCategories;
