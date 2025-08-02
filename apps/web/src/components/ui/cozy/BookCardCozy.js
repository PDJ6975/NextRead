'use client';

import { useState } from 'react';
import { Star, Edit3, Trash2, Eye, BookOpen, Calendar } from 'lucide-react';
import { ButtonCozy } from './ButtonCozy';
import { CardCozy } from './CardCozy';
import { StarCozyIcon, BookCozyIcon, HeartCozyIcon } from './IconCozy';

export default function BookCardCozy({
    book,
    variant = 'default', // compact, default, detailed
    onEdit,
    onDelete,
    onView,
    onRatingChange,
    className = ''
}) {
    const [imageError, setImageError] = useState(false);
    const [currentRating, setCurrentRating] = useState(book?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);

    // Configuración de variantes visuales
    const variantConfig = {
        compact: {
            cardVariant: 'vintage',
            showDescription: false,
            showFullActions: false,
            imageHeight: 'h-24',
            titleSize: 'text-sm',
            layout: 'horizontal'
        },
        default: {
            cardVariant: 'default',
            showDescription: true,
            showFullActions: true,
            imageHeight: 'h-48',
            titleSize: 'text-base',
            layout: 'vertical'
        },
        detailed: {
            cardVariant: 'dreamy',
            showDescription: true,
            showFullActions: true,
            imageHeight: 'h-56',
            titleSize: 'text-lg',
            layout: 'vertical'
        }
    };

    const config = variantConfig[variant] || variantConfig.default;

    // Estados visuales diferenciados por color
    const statusConfig = {
        'TO_READ': {
            borderColor: 'border-cozy-sage/30',
            bgAccent: 'bg-cozy-sage/10',
            badge: '📚 Por leer',
            badgeColor: 'bg-cozy-sage text-white'
        },
        'READ': {
            borderColor: 'border-cozy-forest/30',
            bgAccent: 'bg-cozy-forest/10',
            badge: '✅ Leído',
            badgeColor: 'bg-cozy-forest text-white'
        },
        'ABANDONED': {
            borderColor: 'border-cozy-medium-gray/30',
            bgAccent: 'bg-cozy-medium-gray/10',
            badge: '💤 Pausado',
            badgeColor: 'bg-cozy-medium-gray text-white'
        }
    };

    const statusStyle = statusConfig[book?.status] || statusConfig['TO_READ'];

    // Generar placeholder cozy específico para biblioteca
    const getLibraryPlaceholderDataUri = (title, status) => {
        const cleanTitle = (title || 'Mi Libro').substring(0, 12);
        const emoji = status === 'read' ? '✅' : status === 'ABANDONED' ? '�' : '📚';
        
        const svg = `
            <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="bookshelf" patternUnits="userSpaceOnUse" width="15" height="15">
                        <rect width="15" height="15" fill="#F7F5F3"/>
                        <circle cx="7.5" cy="7.5" r="0.5" fill="#9CAF88" opacity="0.3"/>
                    </pattern>
                </defs>
                <rect width="200" height="300" fill="url(#bookshelf)"/>
                <rect x="5" y="5" width="190" height="290" fill="none" stroke="#8D5524" stroke-width="3" opacity="0.8"/>
                <text x="100" y="100" font-family="serif" font-size="24" 
                      text-anchor="middle" fill="#8D5524" dominant-baseline="middle">
                    ${emoji}
                </text>
                <text x="100" y="150" font-family="serif" font-size="12" font-weight="bold"
                      text-anchor="middle" fill="#6B6560" dominant-baseline="middle">
                    ${cleanTitle}
                </text>
                <text x="100" y="220" font-family="serif" font-size="10" 
                      text-anchor="middle" fill="#B8B3AE" dominant-baseline="middle">
                    Mi biblioteca personal
                </text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    const handleRatingClick = (rating) => {
        setCurrentRating(rating);
        onRatingChange?.(book, rating);
    };

    // Layout compacto (estilo marcapáginas)
    if (config.layout === 'horizontal') {
        return (
            <CardCozy 
                variant={config.cardVariant}
                interactive={true}
                className={`${statusStyle.borderColor} ${statusStyle.bgAccent} ${className} group`}
            >
                <div className="p-4">
                    <div className="flex items-center space-x-4">
                        {/* Imagen pequeña */}
                        <div className="flex-shrink-0">
                            <div className={`w-16 ${config.imageHeight} overflow-hidden rounded-lg bg-cozy-cream shadow-md`}>
                                {!imageError && book?.coverUrl ? (
                                    <img
                                        src={book.coverUrl}
                                        alt={`Portada de ${book?.title}`}
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <img
                                        src={getLibraryPlaceholderDataUri(book?.title, book?.status)}
                                        alt={`Portada de ${book?.title}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-bold ${config.titleSize} text-cozy-warm-brown font-cozy-display line-clamp-1`}>
                                        {book?.title || 'Título no disponible'}
                                    </h3>
                                    <p className="text-sm text-cozy-dark-gray font-cozy line-clamp-1">
                                        {book?.author || 'Autor desconocido'}
                                    </p>
                                </div>
                                
                                {/* Badge de estado */}
                                <span className={`px-2 py-1 text-xs font-cozy font-medium rounded-lg ${statusStyle.badgeColor} ml-2`}>
                                    {statusStyle.badge}
                                </span>
                            </div>

                            {/* Rating compacto */}
                            {book?.status === 'READ' && (
                                <div className="flex items-center space-x-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarCozyIcon
                                            key={star}
                                            className={`w-3 h-3 cursor-pointer transition-colors ${
                                                star <= (hoverRating || currentRating)
                                                    ? 'text-cozy-soft-yellow'
                                                    : 'text-cozy-light-gray'
                                            }`}
                                            filled={star <= (hoverRating || currentRating)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => handleRatingClick(star)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardCozy>
        );
    }

    // Layout vertical (ficha de catálogo)
    return (
        <CardCozy 
            variant={config.cardVariant}
            interactive={true}
            className={`${statusStyle.borderColor} ${statusStyle.bgAccent} ${className} group relative overflow-hidden`}
        >
            {/* Badge de estado flotante */}
            <div className="absolute top-3 right-3 z-10">
                <span className={`px-3 py-1 text-xs font-cozy font-medium rounded-full ${statusStyle.badgeColor} shadow-md`}>
                    {statusStyle.badge}
                </span>
            </div>

            <div className="p-0">
                {/* Portada */}
                <div className="relative">
                    <div className={`${config.imageHeight} overflow-hidden rounded-t-xl bg-cozy-cream`}>
                        {!imageError && book?.coverUrl ? (
                            <img
                                src={book.coverUrl}
                                alt={`Portada de ${book?.title}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <img
                                src={getLibraryPlaceholderDataUri(book?.title, book?.status)}
                                alt={`Portada de ${book?.title}`}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Información */}
                <div className="p-4 space-y-3">
                    <div>
                        <h3 className={`font-bold ${config.titleSize} text-cozy-warm-brown font-cozy-display line-clamp-2 group-hover:text-cozy-terracotta transition-colors`}>
                            {book?.title || 'Título no disponible'}
                        </h3>
                        <p className="text-sm text-cozy-dark-gray font-cozy line-clamp-1">
                            {book?.author || 'Autor desconocido'}
                        </p>
                    </div>

                    {/* Descripción si está habilitada */}
                    {config.showDescription && book?.description && (
                        <p className="text-xs text-cozy-medium-gray font-cozy line-clamp-2 leading-relaxed">
                            {book.description}
                        </p>
                    )}

                    {/* Rating para libros leídos */}
                    {book?.status === 'READ' && (
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarCozyIcon
                                    key={star}
                                    className={`w-4 h-4 cursor-pointer transition-all duration-200 hover:scale-110 ${
                                        star <= (hoverRating || currentRating)
                                            ? 'text-cozy-soft-yellow'
                                            : 'text-cozy-light-gray'
                                    }`}
                                    filled={star <= (hoverRating || currentRating)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => handleRatingClick(star)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Botones de acción */}
                    {config.showFullActions && (
                        <div className="flex space-x-2 pt-2">
                            <ButtonCozy
                                variant="ghost"
                                size="sm"
                                onClick={() => onView?.(book)}
                                className="flex-1"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                            </ButtonCozy>
                            
                            <ButtonCozy
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit?.(book)}
                                className="px-3"
                            >
                                <Edit3 className="w-4 h-4" />
                            </ButtonCozy>

                            <ButtonCozy
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete?.(book)}
                                className="px-3 text-cozy-terracotta hover:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </ButtonCozy>
                        </div>
                    )}
                </div>
            </div>
        </CardCozy>
    );
}
