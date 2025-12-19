
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
  description,
  id,
  productCount = 0
}) => {
  return (
    <article className="bg-white mb-4 border border-gray-200 rounded-xl p-4 w-full flex flex-col justify-between transition-transform hover:scale-105 duration-300">
      <div className="flex flex-col items-center text-center">
        <Link href={`/categories/${id}`} className="w-full flex flex-col items-center group">
          <img
            src={image}
            alt={name}
            className="rounded-lg object-cover h-60 w-auto aspect-square mb-3 group-hover:opacity-90 transition-opacity"
          />

          <h3 className="text-lg font-medium mb-1 group-hover:text-blue-600 transition-colors">{name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        {/* Contador de productos */}
        <div className="flex items-center gap-1 mb-4">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg> */}
          {/* <span className="text-sm text-gray-600">{productCount} productos</span> */}
        </div>
      </div>

      {/* Botón de acción */}
      <div className="flex flex-col gap-2 w-full">
        <Link href={`/categories/${id}`}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full text-sm shadow-sm transition-colors cursor-pointer">
            Ver categoría
          </button>
        </Link>
      </div>
    </article>
  );
};

export default CategoryCard;
