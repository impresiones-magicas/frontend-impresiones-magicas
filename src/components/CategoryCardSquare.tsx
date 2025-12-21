
import React from 'react';
import Link from 'next/link';

interface CategoryCardSquareProps {
  name: string;
  image: string;
  description: string;
  id?: number;
  productCount?: number;
}

const CategoryCardSquare: React.FC<CategoryCardSquareProps> = ({
  name,
  image,
  description,
  id,
  productCount = 0
}) => {
  return (
    <Link 
      href={`/categories/${id}`} 
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image Container */}
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
          {description}
        </p>
        
        {/* Product Count */}
        <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 mr-1.5"
          >
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
          <span>{productCount} productos</span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCardSquare;
