'use client';

import { useState, useEffect } from 'react';
import { X, Star, BookOpen, Calendar, User, Building, Plus, Hash, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

export default function BookDetailsModal({
    book,
    isOpen,
    onClose,
    onAddToLibrary,
    isRecommendation = false // Nueva prop para identificar si es una recomendación
}) {
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

    const handleAddToLibrary = async (rating) => {
        setActionLoading('add');
        try {
            await onAddToLibrary?.(book, rating);
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

                                {/* Motivo de recomendación (solo para recomendaciones) */}
                                {isRecommendation && book.reason && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 text-sm font-semibold">💡</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-blue-900 mb-1">
                                                    ¿Por qué te lo recomendamos?
                                                </h4>
                                                <p className="text-sm text-blue-700 leading-relaxed">
                                                    {book.reason}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Detalles técnicos */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {book.isbn13 && (
                                        <div className="flex items-center space-x-2">
                                            <Hash className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">ISBN:</span>
                                            <span className="text-gray-900">{book.isbn13}</span>
                                        </div>
                                    )}

                                    {book.publisher && (
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">Editorial:</span>
                                            <span className="text-gray-900">{book.publisher}</span>
                                        </div>
                                    )}

                                    {book.publishedYear && (
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">Año:</span>
                                            <span className="text-gray-900">{book.publishedYear}</span>
                                        </div>
                                    )}

                                    {book.pages && book.pages > 0 && (
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">Páginas:</span>
                                            <span className="text-gray-900">{book.pages}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Sección de acciones - Solo para recomendaciones */}
                                {isRecommendation && (
                                    <div className="border-t pt-6">
                                        <div className="flex items-center justify-between space-x-4">
                                            {/* Información de que ya está guardado */}
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Recomendación guardada automáticamente</span>
                                            </div>

                                            {/* Botón principal de añadir */}
                                            <Button
                                                onClick={() => handleAddToLibrary(0)}
                                                disabled={actionLoading === 'add'}
                                                className="flex items-center space-x-2"
                                            >
                                                {actionLoading === 'add' ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                                <span>{actionLoading === 'add' ? 'Añadiendo...' : 'Añadir a mi biblioteca'}</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Sección de rating y añadir - Solo para libros normales */}
                                {!isRecommendation && (
                                    <div className="border-t pt-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ¿Qué te parece este libro?
                                                </label>
                                                <StarRating
                                                    rating={selectedRating}
                                                    onChange={setSelectedRating}
                                                    size="lg"
                                                    showValue={true}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between space-x-4">
                                                {/* Botón principal de añadir */}
                                                <Button
                                                    onClick={() => handleAddToLibrary(selectedRating)}
                                                    disabled={actionLoading === 'add'}
                                                    className="flex items-center space-x-2"
                                                >
                                                    {actionLoading === 'add' ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Plus className="w-4 h-4" />
                                                    )}
                                                    <span>{actionLoading === 'add' ? 'Añadiendo...' : 'Añadir a mi biblioteca'}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 