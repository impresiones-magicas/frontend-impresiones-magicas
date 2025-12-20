
import React from 'react';
import CategoryCard from './CategoryCard';
import categoriesData from '@/data/categories.json';

const FeaturedCategories = () => {
    const featuredCategories = categoriesData.filter(c => c.featured);

    return (
        <section className="max-w-8xl mx-4 py-6 bg-white">
            <h2 className="px-8 text-xl font-semibold mb-4">Compra el regalo perfecto</h2>

            <div className="relative px-4">
                {/* Contenedor con scroll horizontal */}
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {featuredCategories.map(category => (
                        <div key={category.id} className="flex-shrink-0 snap-start">
                            <CategoryCard {...category} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
