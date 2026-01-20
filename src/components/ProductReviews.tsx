'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types';
import { fetchProductReviews, createReview } from '@/services/reviews';
import { Star, MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProductReviewsProps {
    productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        try {
            const data = await fetchProductReviews(productId);
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Debes iniciar sesión para valorar');
            return;
        }

        if (comment.length < 3) {
            toast.error('El comentario debe tener al menos 3 caracteres');
            return;
        }

        setSubmitting(true);
        try {
            await createReview(productId, rating, comment);
            toast.success('¡Gracias por tu valoración!');
            setComment('');
            setRating(5);
            loadReviews(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || 'Error al enviar la valoración');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <section className="mt-16 border-t pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Review List */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        Opiniones de clientes ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center text-gray-500">
                            Nadie ha valorado este producto todavía. ¡Sé el primero!
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                            {review.user.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{review.user.name}</p>
                                            <div className="flex text-yellow-400">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="ml-auto text-xs text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed italic">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Review Form */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Deja tu valoración</h3>
                    
                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Puntuación</label>
                                <div className="flex gap-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onMouseEnter={() => setHoveredRating(i + 1)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setRating(i + 1)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${
                                                    (hoveredRating || rating) > i 
                                                        ? 'fill-yellow-400 text-yellow-400' 
                                                        : 'text-gray-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Tu comentario</label>
                                <textarea
                                    id="comment"
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="¿Qué te ha parecido el producto?"
                                    className="w-full rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-4"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Publicar Valoración
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-6">Inicia sesión para compartir tu experiencia con este producto.</p>
                            <a 
                                href="/login" 
                                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                            >
                                Iniciar Sesión
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductReviews;
