'use client';

import { useState, useEffect } from 'react';
import { X, Star, BookOpen, Calendar, User, Building, Heart, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

export default function BookDetailsModal({
    book,
    isOpen,
    onClose,
    onAddToLibrary,
    onLike,
    onDislike
}) {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);

    // Cerrar modal con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !book) return null;

    // Función para obtener la URL de la imagen con fallback
    const getImageUrl = () => {
        if (book?.coverUrl) {
            return book.coverUrl;
        }
        return `https://via.placeholder.com/300x450/e5e7eb/6b7280?text=${encodeURIComponent(book?.title?.substring(0, 30) || 'Libro')}`;
    };

    // Función para obtener el autor principal
    const getMainAuthor = () => {
        if (book?.authors && book.authors.length > 0) {
            return typeof book.authors[0] === 'string'
                ? book.authors[0]
                : book.authors[0]?.name || 'Autor desconocido';
        }
        return 'Autor desconocido';
    };

    // Función para obtener todos los autores
    const getAllAuthors = () => {
        if (book?.authors && book.authors.length > 0) {
            return book.authors.map(author =>
                typeof author === 'string' ? author : author?.name || 'Autor desconocido'
            ).join(', ');
        }
        return 'Autor desconocido';
    };

    const handleLike = async () => {
        if (isDisliked) return;

        setActionLoading('like');
        try {
            await onLike?.(book);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error al dar like:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDislike = async () => {
        if (isLiked) return;

        setActionLoading('dislike');
        try {
            await onDislike?.(book);
            setIsDisliked(!isDisliked);
        } catch (error) {
            console.error('Error al dar dislike:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddToLibrary = async () => {
        setActionLoading('add');
        try {
            await onAddToLibrary?.(book, selectedRating);
            // Mostrar mensaje de éxito y cerrar modal
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Error al añadir a biblioteca:', error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <CardContent className="p-0">
                    {/* Header con botón de cerrar */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <h2 className="text-xl font-bold text-gray-900">Detalles del libro</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="rounded-full p-2"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Contenido principal */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Imagen del libro */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <img
                                        src={getImageUrl()}
                                        alt={book.title}
                                        className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                                        onError={(e) => {
                                            e.target.src = `https://via.placeholder.com/300x450/e5e7eb/6b7280?text=${encodeURIComponent(book?.title?.substring(0, 30) || 'Libro')}`;
                                        }}
                                    />

                                    {/* Badge de recomendación */}
                                    <div className="mt-4 flex justify-center">
                                        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                            ⭐ Recomendado para ti
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información del libro */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Título y autor */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {book.title}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-4">
                                        por {getAllAuthors()}
                                    </p>

                                    {/* Rating promedio */}
                                    {book.averageRating && (
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(book.averageRating)
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {book.averageRating} ({book.ratingsCount || 0} valoraciones)
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Información adicional */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                                    {book.publishedYear && (
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm text-gray-600">Publicado</div>
                                                <div className="font-medium">{book.publishedYear}</div>
                                            </div>
                                        </div>
                                    )}

                                    {book.pages && (
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm text-gray-600">Páginas</div>
                                                <div className="font-medium">{book.pages}</div>
                                            </div>
                                        </div>
                                    )}

                                    {book.publisher && (
                                        <div className="flex items-center space-x-2">
                                            <Building className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm text-gray-600">Editorial</div>
                                                <div className="font-medium">{book.publisher}</div>
                                            </div>
                                        </div>
                                    )}

                                    {(book.isbn10 || book.isbn13) && (
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm text-gray-600">ISBN</div>
                                                <div className="font-medium">{book.isbn13 || book.isbn10}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sinopsis */}
                                {book.synopsis && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sinopsis</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {book.synopsis}
                                        </p>
                                    </div>
                                )}

                                {/* Sección de añadir a biblioteca */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Añadir a mi biblioteca
                                    </h3>

                                    {/* Rating selector */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ¿Cómo calificarías este libro? (opcional)
                                        </label>
                                        <StarRating
                                            rating={selectedRating}
                                            onRatingChange={setSelectedRating}
                                            size="lg"
                                        />
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex space-x-3">
                                        <Button
                                            onClick={handleAddToLibrary}
                                            disabled={actionLoading === 'add'}
                                            className="flex-1"
                                        >
                                            {actionLoading === 'add' ? (
                                                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            ) : (
                                                <Plus className="w-4 h-4 mr-2" />
                                            )}
                                            Añadir a biblioteca
                                        </Button>

                                        <Button
                                            variant={isLiked ? "default" : "outline"}
                                            onClick={handleLike}
                                            disabled={isDisliked || actionLoading === 'like'}
                                            className={isLiked ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-600'}
                                        >
                                            {actionLoading === 'like' ? (
                                                <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                            )}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={handleDislike}
                                            disabled={isLiked || actionLoading === 'dislike'}
                                            className={isDisliked ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:bg-red-50 hover:text-red-600'}
                                        >
                                            {actionLoading === 'dislike' ? (
                                                <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <X className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 