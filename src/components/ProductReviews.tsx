'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types';
import { fetchProductReviews, createReview, updateReview, deleteReview } from '@/services/reviews';
import { Star, MessageSquare, Send, Loader2, Pencil, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProductReviewsProps {
    productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Modal form state
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    
    // Deletion modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);

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

    const openCreateForm = () => {
        setFormMode('create');
        setEditingReviewId(null);
        setRating(5);
        setComment('');
        setShowForm(true);
    };

    const openEditForm = (review: Review) => {
        setFormMode('edit');
        setEditingReviewId(review.id);
        setRating(review.rating);
        setComment(review.comment);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingReviewId(null);
        setRating(5);
        setComment('');
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
            if (formMode === 'create') {
                await createReview(productId, rating, comment);
                toast.success('¡Gracias por tu valoración!');
            } else {
                await updateReview(editingReviewId!, rating, comment);
                toast.success('Valoración actualizada');
            }
            setComment('');
            setRating(5);
            setShowForm(false);
            loadReviews();
        } catch (error: any) {
            toast.error(error.message || `Error al ${formMode === 'create' ? 'enviar' : 'actualizar'} la valoración`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (reviewId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setReviewToDeleteId(reviewId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!reviewToDeleteId) return;

        setSubmitting(true);
        try {
            await deleteReview(reviewToDeleteId);
            toast.success('Valoración eliminada');
            setShowDeleteModal(false);
            setReviewToDeleteId(null);
            loadReviews();
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar la valoración');
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
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    Opiniones de clientes ({reviews.length})
                </h2>
                
                <button
                    onClick={openCreateForm}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2"
                >
                    <Pencil className="w-5 h-5" />
                    Valorar producto
                </button>
            </div>

            <div>
                {/* Review Form Modal - Unificado para crear y editar */}
                {showForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop with blur effect */}
                        <div 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={closeForm}
                        ></div>
                        
                        {/* Modal Content Card */}
                        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-50">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {formMode === 'create' ? 'Tu opinión importa' : 'Editando tu valoración'}
                                </h3>
                                <button 
                                    onClick={closeForm}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8">
                                {user ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">¿Qué puntuación le darías?</label>
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
                                                            className={`w-10 h-10 ${
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
                                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-3">Tu comentario</label>
                                            <textarea
                                                id="comment"
                                                rows={4}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Cuéntanos tu experiencia con el producto..."
                                                className="w-full rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-4 text-sm"
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                                {formMode === 'create' ? 'Publicar Valoración' : 'Guardar cambios'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeForm}
                                                className="px-6 py-4 border border-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Star className="w-8 h-8" />
                                        </div>
                                        <p className="text-gray-600 mb-8">Inicia sesión para compartir tu experiencia con este producto.</p>
                                        <div className="flex flex-col gap-3">
                                            <a 
                                                href="/login" 
                                                className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
                                            >
                                                Iniciar Sesión
                                            </a>
                                            <button 
                                                onClick={closeForm}
                                                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                            >
                                                Quizás más tarde
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop with blur effect */}
                        <div 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setShowDeleteModal(false)}
                        ></div>
                        
                        {/* Modal Content Card */}
                        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                            {/* Modal Header */}
                            <div className="flex flex-col items-center justify-center p-8">
                                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                                    <Trash2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar valoración?</h3>
                                <p className="text-gray-500 text-center mb-8">
                                    Esta acción no se puede deshacer. La valoración será eliminada permanentemente.
                                </p>
                                
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={confirmDelete}
                                        disabled={submitting}
                                        className="flex-grow bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Eliminar'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setReviewToDeleteId(null);
                                        }}
                                        className="flex-grow px-6 py-3 border border-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Review List */}
                {reviews.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center text-gray-500">
                        Nadie ha valorado este producto todavía. ¡Sé el primero!
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div 
                                key={review.id} 
                                onClick={() => user?.id === review.user.id && openEditForm(review)}
                                className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all relative ${
                                    user?.id === review.user.id
                                        ? 'cursor-pointer hover:shadow-md hover:border-blue-100 group' 
                                        : ''
                                }`}
                            >
                                {user?.id === review.user.id && (
                                    <>
                                        <button
                                            onClick={(e) => handleDelete(review.id, e)}
                                            className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                            title="Borrar valoración"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        
                                        <div className="mt-4 flex items-center gap-1 text-blue-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Pencil className="w-3 h-3" />
                                            Click para editar
                                        </div>
                                    </>
                                )}
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                        {review.user.name.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900">{review.user.name}</p>
                                            {user?.id === review.user.id && (
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                                                    Tu opinión
                                                </span>
                                            )}
                                        </div>
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
        </section>
    );
};

export default ProductReviews;

