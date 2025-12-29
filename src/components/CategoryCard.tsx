
import React from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  image: string;
  description: string;
  id?: number;
  featured?: boolean;
  productCount?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image,
  id
}) => {
  return (
    <Link href={`/categories/${id}`} className="flex flex-col items-center group">
      <div className="relative mb-3">
        {/* Círculo con imagen de fondo */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full overflow-hidden transition-transform group-hover:scale-105 duration-300 shadow-lg hover:shadow-xl">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
      </div>

      <h3 className="text-sm font-medium text-center text-gray-900 group-hover:text-blue-600 transition-colors px-2">
        {name}
      </h3>
    </Link>
  );
};

export default CategoryCard;
