'use client';

import React, { useRef, useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import { fetchCategories, Category } from '@/services/api';

const FeaturedCategories = () => {
    const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false); // Default to false until data loads

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                // Filter only featured categories that are top-level (if logic dictates) or just any featured
                // Based on header logic, featured ones were top level. Let's stick to that or just isFeatured.
                setFeaturedCategories(data.filter(c => c.isFeatured));
            } catch (error) {
                console.error("Failed to load categories", error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Tolerance of 5px to handle potential fractional pixel issues
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            // Check immediately after data update often helpful
            setTimeout(checkScroll, 100);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [featuredCategories]); // Re-run when categories change

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Scroll by clientWidth (viewport width of the container)
            // ensuring we move roughly "one visible page" (which we will configure to be ~6 items)
            const scrollAmount = scrollContainerRef.current.clientWidth;

            const newScrollPosition = scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando categorías...</div>;
    if (featuredCategories.length === 0) return null;

    return (
        <section className="w-full max-w-[100vw] py-8 bg-white overflow-hidden">
            <div className="flex justify-between items-center mb-6 px-4 md:px-8 max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900">Compra el regalo perfecto</h2>

                <div className="flex gap-2">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`bg-white shadow-sm border border-gray-100 rounded-full p-2.5 transition-all duration-300 flex items-center justify-center ${!canScrollLeft
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:bg-gray-50 hover:scale-105 hover:shadow-md cursor-pointer'
                            }`}
                        aria-label="Scroll left"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 text-gray-700"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`bg-white shadow-sm border border-gray-100 rounded-full p-2.5 transition-all duration-300 flex items-center justify-center ${!canScrollRight
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:bg-gray-50 hover:scale-105 hover:shadow-md cursor-pointer'
                            }`}
                        aria-label="Scroll right"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 text-gray-700"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative w-full">
                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth max-w-7xl mx-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {featuredCategories.map(category => (
                        // Precise widths to avoid partial items:
                        // Mobile: 50% (2 items)
                        // Tablet: 33.33% (3 items)
                        // Desktop: 16.66% (6 items)
                        <div
                            key={category.id}
                            className="flex-shrink-0 snap-start w-1/2 sm:w-1/3 lg:w-1/6 px-2"
                        >
                            <CategoryCard
                                id={category.id}
                                name={category.name}
                                description={category.description || ''}
                                image={category.imageUrl || '/placeholder-category.png'} // Fallback
                                featured={category.isFeatured}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
