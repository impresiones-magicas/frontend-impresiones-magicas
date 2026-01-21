'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { getMediaUrl } from '@/services/media';
import { Star, StarHalf } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  description: string;
  id?: string | number;
  featured?: boolean;
  slug?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  rating = 0,
  reviews = 0,
  description,
  id,
  slug
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!id) return;
    
    setIsAdding(true);
    try {
      await addToCart(id.toString(), 1);
      toast.success('Producto añadido al carrito', {
        description: `${title} se ha añadido correctamente`,
      });
    } catch (error) {
      toast.error('Error al añadir al carrito', {
        description: 'Por favor, inténtalo de nuevo',
      });
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <article className="bg-white mb-4 border border-gray-200 rounded-xl p-4 w-full flex flex-col justify-between transition-transform hover:scale-105 duration-300">
      <div className="flex flex-col items-center text-center">
        <Link href={`/products/${slug || id}`} className="w-full flex flex-col items-center group">
          <img
            src={getMediaUrl(image)}
            alt={title}
            className="rounded-lg object-cover h-60 w-auto aspect-square mb-3 group-hover:opacity-90 transition-opacity"
          />

          <h3 className="text-lg font-medium mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        {/* Estrellas de valoración estilo Amazon */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => {
              const fullStar = rating >= i + 1;
              const halfStar = !fullStar && rating >= i + 0.5;
              
              if (fullStar) {
                return <Star key={i} className="w-4 h-4 fill-current" strokeWidth={1.5} />;
              } else if (halfStar) {
                return (
                  <div key={i} className="relative">
                    <Star className="w-4 h-4 text-gray-200" strokeWidth={1.5} />
                    <div className="absolute inset-0 overflow-hidden w-[50%]">
                      <Star className="w-4 h-4 fill-current text-yellow-400" strokeWidth={1.5} />
                    </div>
                  </div>
                );
              } else {
                return <Star key={i} className="w-4 h-4 text-gray-200" strokeWidth={1.5} />;
              }
            })}
          </div>
          <span className="text-xs text-blue-600 hover:underline cursor-pointer">
            {reviews}
          </span>
        </div>

        <p className="text-gray-900 font-bold text-xl mb-4">
          {formatPrice(price)}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2 w-full">
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium py-2 px-4 rounded-full text-sm shadow-sm transition-colors cursor-pointer"
        >
          {isAdding ? 'Añadiendo...' : 'Añadir al carrito'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
