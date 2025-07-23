'use client';

import { useState } from 'react';
import { Plus, Eye, Star, BookOpen, Calendar, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export default function RecommendationCard({
    book,
    onAddToLibrary,
    onViewDetails,
    loading = false
}) {
    const [actionLoading, setActionLoading] = useState(null);

    // Skeleton loading para cuando se están cargando las recomendaciones
    if (loading) {
        return (
            <Card className="w-full max-w-sm animate-pulse">
                <CardContent className="p-0">
                    {/* Imagen skeleton */}
                    <div className="aspect-[2/3] bg-gray-200 rounded-t-lg"></div>

                    {/* Contenido skeleton */}
                    <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>

                        {/* Botones skeleton */}
                        <div className="flex space-x-2 mb-3">
                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                            <div className="h-8 bg-gray-200 rounded w-8"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const handleAddToLibrary = async () => {
        setActionLoading('add');
        try {
            await onAddToLibrary?.(book);
        } catch (error) {
            console.error('Error al añadir a biblioteca:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleViewDetails = () => {
        onViewDetails?.(book);
    };

    // Función para obtener la URL de la imagen con fallback
    const getImageUrl = () => {
        if (book?.coverUrl) {
            return book.coverUrl;
        }
        // Fallback a una imagen placeholder
        return `https://via.placeholder.com/200x300/e5e7eb/6b7280?text=${encodeURIComponent(book?.title?.substring(0, 20) || 'Libro')}`;
    };

    // Generar URL de placeholder más confiable
    const getPlaceholderUrl = (title) => {
        const cleanTitle = encodeURIComponent(title.substring(0, 20));
        // Usar un servicio más confiable para placeholders
        return `https://placehold.co/200x300/e5e7eb/6b7280?text=${cleanTitle}`;
    };

    const coverUrl = book.coverUrl || getPlaceholderUrl(book.title);

    // Función para obtener el autor principal
    const getMainAuthor = () => {
        if (book?.authors && book.authors.length > 0) {
            return typeof book.authors[0] === 'string'
                ? book.authors[0]
                : book.authors[0]?.name || 'Autor desconocido';
        }
        return 'Autor desconocido';
    };

    // Función para formatear el año de publicación
    const getPublishedYear = () => {
        if (book?.publishedYear) {
            return book.publishedYear;
        }
        return '';
    };

    return (
        <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 group">
            <CardContent className="p-0">
                {/* Imagen del libro con overlay de acciones */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                        src={coverUrl}
                        alt={book?.title || 'Portada del libro'}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = `https://via.placeholder.com/200x300/e5e7eb/6b7280?text=${encodeURIComponent(book?.title?.substring(0, 20) || 'Libro')}`;
                        }}
                    />

                    {/* Overlay con botón de ver detalles */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleViewDetails}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 hover:bg-gray-100"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalles
                        </Button>
                    </div>

                    {/* Badge de recomendación en la esquina */}
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Recomendado
                    </div>
                </div>

                {/* Información del libro */}
                <div className="p-4">
                    {/* Título */}
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
                        {book?.title || 'Título no disponible'}
                    </h3>

                    {/* Autor */}
                    <div className="flex items-center text-xs text-gray-600 mb-2">
                        <User className="w-3 h-3 mr-1" />
                        <span className="truncate">{getMainAuthor()}</span>
                    </div>

                    {/* Información adicional */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-3">
                            {getPublishedYear() && (
                                <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    <span>{getPublishedYear()}</span>
                                </div>
                            )}
                            {book?.pages && (
                                <div className="flex items-center">
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    <span>{book.pages}p</span>
                                </div>
                            )}
                        </div>

                        {/* Rating promedio si está disponible */}
                        {book?.averageRating && (
                            <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                <span>{book.averageRating}</span>
                            </div>
                        )}
                    </div>

                    {/* Descripción corta */}
                    {book?.synopsis && (
                        <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {book.synopsis}
                        </p>
                    )}

                    {/* Acciones */}
                    <div className="flex space-x-2">
                        {/* Botón principal - Añadir a biblioteca */}
                        <Button
                            onClick={handleAddToLibrary}
                            disabled={actionLoading === 'add'}
                            className="flex-1 text-xs py-2 px-3"
                        >
                            {actionLoading === 'add' ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Plus className="w-3 h-3 mr-2" />
                            )}
                            Añadir
                        </Button>

                        {/* Botón Ver detalles */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleViewDetails}
                            className="p-2 hover:bg-gray-50"
                            title="Ver detalles del libro"
                        >
                            <Eye className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 