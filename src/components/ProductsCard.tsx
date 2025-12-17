
import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  description: string;
  id?: number;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  rating = 0,
  reviews = 0,
  description,
  id
}) => {
  return (
    <article className="bg-white mb-4 border border-gray-200 rounded-xl p-4 w-full flex flex-col justify-between transition-transform hover:scale-105 duration-300">
      <div className="flex flex-col items-center text-center">
        <Link href={`/products/${id}`} className="w-full flex flex-col items-center group">
          <img
            src={image}
            alt={title}
            className="rounded-lg object-cover h-60 w-auto aspect-square mb-3 group-hover:opacity-90 transition-opacity"
          />

          <h3 className="text-lg font-medium mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        {/* Estrellas de valoración estilo Amazon */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.326 1.163l-4.304 3.86a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.811.613L12 18.202l-4.605 2.682a.562.562 0 01-.811-.613l1.285-5.385a.562.562 0 00-.182-.557l-4.304-3.86a.562.562 0 01.326-1.163l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-blue-600 hover:underline cursor-pointer">{reviews}</span>
        </div>

        <p className="text-gray-900 font-bold text-xl mb-4">
          ${price}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2 w-full">
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-full text-sm shadow-sm transition-colors cursor-pointer">
          Añadir al carrito
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
