'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  productId: string;
  productName: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({ productId, productName }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(productId, 1);
      toast.success('Producto añadido al carrito', {
        description: `${productName} se ha añadido correctamente`,
      });
    } catch (error) {
      toast.error('Error al añadir al carrito', {
        description: 'Por favor, inténtalo de nuevo',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAdding(true);
    try {
      await addToCart(productId, 1);
      router.push('/cart'); // Assuming /cart exists and is the checkout entrance
    } catch (error) {
      toast.error('Error al procesar la compra', {
        description: 'Por favor, inténtalo de nuevo',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-10">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 text-center cursor-pointer"
      >
        {isAdding ? 'Añadiendo...' : 'Añadir al Carrito'}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={isAdding}
        className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-bold py-4 px-8 rounded-full hover:bg-gray-900 hover:text-white disabled:opacity-50 transition-colors text-center cursor-pointer"
      >
        Comprar Ahora
      </button>
    </div>
  );
};

export default ProductActions;
