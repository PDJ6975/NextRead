'use client';

import { useState } from 'react';
import { Plus, Eye, Star, BookOpen, Calendar, User, Heart } from 'lucide-react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { BookCozyIcon, HeartCozyIcon, StarCozyIcon } from '../ui/cozy/IconCozy';

export default function RecommendationCardCozy({
    book,
    onAddToLibrary,
    onViewDetails,
    loading = false
}) {
    const [actionLoading, setActionLoading] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Skeleton loading cozy para cuando se están cargando las recomendaciones
    if (loading) {
        return (
            <CardCozy variant="vintage" className="w-full max-w-sm animate-pulse">
                <div className="p-0">
                    {/* Imagen skeleton con marco decorativo */}
                    <div className="relative">
                        <div className="aspect-[2/3] bg-cozy-light-gray rounded-t-xl cozy-animate-float"></div>
                        {/* Marco decorativo skeleton */}
                        <div className="absolute inset-2 border-2 border-cozy-sage/30 rounded-lg"></div>
                    </div>

                    {/* Contenido skeleton */}
                    <div className="p-6">
                        <div className="h-6 bg-cozy-medium-gray/50 rounded-lg mb-3"></div>
                        <div className="h-4 bg-cozy-light-gray rounded-lg w-3/4 mb-3"></div>
                        <div className="h-3 bg-cozy-light-gray rounded-lg w-1/2 mb-4"></div>

                        {/* Botones skeleton */}
                        <div className="flex space-x-3 mb-3">
                            <div className="h-10 bg-cozy-sage/20 rounded-xl flex-1"></div>
                            <div className="h-10 bg-cozy-terracotta/20 rounded-xl w-12"></div>
                        </div>
                    </div>
                </div>
            </CardCozy>
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
        if (book?.coverUrl && book.coverUrl.trim() !== '' && !imageError) {
            return book.coverUrl;
        }
        return null;
    };

    // Generar placeholder cozy con SVG decorativo
    const getCozyPlaceholderDataUri = (title) => {
        const cleanTitle = (title || 'Libro Recomendado').substring(0, 15);
        const svg = `
            <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="paper" patternUnits="userSpaceOnUse" width="20" height="20">
                        <rect width="20" height="20" fill="#F7F5F3"/>
                        <circle cx="10" cy="10" r="1" fill="#E8E5E1" opacity="0.3"/>
                    </pattern>
                </defs>
                <rect width="200" height="300" fill="url(#paper)"/>
                <rect x="10" y="10" width="180" height="280" fill="none" stroke="#9CAF88" stroke-width="2" opacity="0.6"/>
                <circle cx="100" cy="80" r="20" fill="#E07A5F" opacity="0.7"/>
                <text x="100" y="140" font-family="serif" font-size="14" font-weight="bold"
                      text-anchor="middle" fill="#8D5524" dominant-baseline="middle">
                    📚
                </text>
                <text x="100" y="170" font-family="serif" font-size="10" 
                      text-anchor="middle" fill="#6B6560" dominant-baseline="middle">
                    ${cleanTitle}
                </text>
                <text x="100" y="250" font-family="serif" font-size="8" 
                      text-anchor="middle" fill="#B8B3AE" dominant-baseline="middle">
                    Recomendado para ti
                </text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    return (
        <CardCozy 
            variant="dreamy" 
            interactive={true}
            className="w-full max-w-sm group hover:scale-105 transition-all duration-500 relative overflow-hidden"
        >
            {/* Badge "Recomendado" con estilo banner */}
            <div className="absolute top-4 -right-8 bg-gradient-to-r from-cozy-terracotta to-cozy-warm-brown text-white px-8 py-1 text-xs font-cozy font-medium rotate-12 z-10 shadow-md">
                ✨ Recomendado
            </div>

            <div className="p-0">
                {/* Portada con marco decorativo */}
                <div className="relative">
                    <div className="aspect-[2/3] overflow-hidden rounded-t-xl bg-cozy-cream">
                        {getImageUrl() ? (
                            <img
                                src={getImageUrl()}
                                alt={`Portada de ${book?.title || 'libro'}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <img
                                src={getCozyPlaceholderDataUri(book?.title)}
                                alt={`Portada de ${book?.title || 'libro'}`}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    
                    {/* Marco decorativo con esquinas ornamentales */}
                    <div className="absolute inset-3 border-2 border-white/80 rounded-lg shadow-inner pointer-events-none">
                        {/* Esquinas decorativas */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cozy-sage/60"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-cozy-sage/60"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-cozy-sage/60"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-cozy-sage/60"></div>
                    </div>

                    {/* Sombra proyectada realista */}
                    <div className="absolute -bottom-2 left-4 right-4 h-2 bg-cozy-dark-gray/20 blur-sm rounded-full"></div>
                </div>

                {/* Información del libro con tipografía cálida */}
                <div className="p-6 space-y-4">
                    {/* Título */}
                    <h3 className="font-bold text-lg text-cozy-warm-brown font-cozy-display leading-tight line-clamp-2 group-hover:text-cozy-terracotta transition-colors duration-300">
                        {book?.title || 'Título no disponible'}
                    </h3>

                    {/* Autor con icono dibujado */}
                    <div className="flex items-center space-x-2 text-cozy-dark-gray">
                        <User className="w-4 h-4 text-cozy-sage" />
                        <span className="text-sm font-cozy line-clamp-1">
                            {book?.author || 'Autor desconocido'}
                        </span>
                    </div>

                    {/* Páginas y año */}
                    <div className="flex items-center justify-between text-xs text-cozy-medium-gray font-cozy">
                        {book?.pages && (
                            <div className="flex items-center space-x-1">
                                <BookCozyIcon className="w-3 h-3" />
                                <span>{book.pages} páginas</span>
                            </div>
                        )}
                        {book?.publishedYear && (
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{book.publishedYear}</span>
                            </div>
                        )}
                    </div>

                    {/* Descripción truncada */}
                    {book?.description && (
                        <p className="text-sm text-cozy-dark-gray font-cozy line-clamp-3 leading-relaxed">
                            {book.description}
                        </p>
                    )}

                    {/* Botones de acción estilo pergamino */}
                    <div className="flex space-x-3 pt-2">
                        <ButtonCozy
                            variant="warm"
                            size="sm"
                            onClick={handleAddToLibrary}
                            disabled={actionLoading === 'add'}
                            loading={actionLoading === 'add'}
                            className="flex-1 group/btn"
                        >
                            <HeartCozyIcon className="w-4 h-4 mr-2 group-hover/btn:text-red-400 transition-colors" />
                            {actionLoading === 'add' ? 'Añadiendo...' : 'Añadir'}
                        </ButtonCozy>

                        <ButtonCozy
                            variant="ghost"
                            size="sm"
                            onClick={handleViewDetails}
                            className="px-3 group/eye"
                        >
                            <Eye className="w-4 h-4 group-hover/eye:scale-110 transition-transform" />
                        </ButtonCozy>
                    </div>

                    {/* Elemento decorativo inferior */}
                    <div className="flex items-center justify-center pt-2">
                        <div className="flex space-x-1">
                            <StarCozyIcon className="w-3 h-3 text-cozy-soft-yellow/60" />
                            <StarCozyIcon className="w-3 h-3 text-cozy-soft-yellow/40" />
                            <StarCozyIcon className="w-3 h-3 text-cozy-soft-yellow/60" />
                        </div>
                    </div>
                </div>
            </div>
        </CardCozy>
    );
}
