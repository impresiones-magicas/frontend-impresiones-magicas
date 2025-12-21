'use client';

import React, { useRef } from 'react';
import CategoryCard from './CategoryCard';
import categoriesData from '@/data/categories.json';

const FeaturedCategories = () => {
    const featuredCategories = categoriesData.filter(c => c.featured);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + 
                (direction === 'left' ? -scrollAmount : scrollAmount);
            
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="max-w-8xl mx-4 py-6 bg-white">
            <div className="flex justify-between items-center mb-6 px-8">
                <h2 className="text-xl font-semibold">Compra el regalo perfecto</h2>
                
                <div className="flex gap-2">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="bg-white shadow-md border border-gray-100 rounded-full px-2 py-3 hover:bg-gray-50 hover:scale-105 transition-all duration-300"
                        aria-label="Scroll left"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-700"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="bg-white shadow-md border border-gray-100 rounded-full px-2 py-3 hover:bg-gray-50 hover:scale-105 transition-all duration-300"
                        aria-label="Scroll right"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-700"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative px-4">
                {/* Scrollable Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                >
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
