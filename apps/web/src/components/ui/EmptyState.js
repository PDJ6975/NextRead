'use client';

import { BookOpen, Search, Wifi, AlertCircle } from 'lucide-react';
import { Button } from './Button';

// Configuraciones predefinidas para diferentes tipos de estados vacíos
const emptyStateConfigs = {
    'no-books': {
        icon: BookOpen,
        title: '¡Tu biblioteca está esperando!',
        description: 'Comienza tu viaje literario añadiendo tu primer libro.',
        actionLabel: 'Añadir primer libro',
        illustration: '📚'
    },
    'no-recommendations': {
        icon: Search,
        title: 'Recomendaciones en camino',
        description: 'Completa tu perfil de lectura para obtener recomendaciones personalizadas.',
        actionLabel: 'Actualizar preferencias',
        illustration: '🎯'
    },
    'connection-error': {
        icon: Wifi,
        title: 'Problema de conexión',
        description: 'No pudimos cargar la información. Verifica tu conexión e intenta nuevamente.',
        actionLabel: 'Reintentar',
        illustration: '🌐'
    },
    'generic-error': {
        icon: AlertCircle,
        title: 'Algo salió mal',
        description: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
        actionLabel: 'Reintentar',
        illustration: '⚠️'
    },
    'search-no-results': {
        icon: Search,
        title: 'Sin resultados',
        description: 'No encontramos libros que coincidan con tu búsqueda.',
        actionLabel: 'Limpiar búsqueda',
        illustration: '🔍'
    }
};

export default function EmptyState({
    type = 'generic-error',
    title,
    description,
    actionLabel,
    onAction,
    illustration,
    icon: CustomIcon,
    className = ''
}) {
    const config = emptyStateConfigs[type] || emptyStateConfigs['generic-error'];

    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalActionLabel = actionLabel || config.actionLabel;
    const finalIllustration = illustration || config.illustration;
    const Icon = CustomIcon || config.icon;

    return (
        <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
            {/* Ilustración grande */}
            <div className="mb-6">
                <div className="text-6xl mb-4" role="img" aria-label="Ilustración">
                    {finalIllustration}
                </div>
                <div className="p-4 bg-gray-100 rounded-full">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
            </div>

            {/* Contenido */}
            <div className="max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {finalTitle}
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {finalDescription}
                </p>

                {/* Acción */}
                {onAction && (
                    <Button
                        onClick={onAction}
                        className="inline-flex items-center"
                    >
                        {finalActionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}

// Componente específico para cuando no hay libros
export function EmptyLibrary({ onAddBook }) {
    return (
        <EmptyState
            type="no-books"
            onAction={onAddBook}
        />
    );
}

// Componente específico para cuando no hay recomendaciones
export function EmptyRecommendations({ onUpdatePreferences }) {
    return (
        <EmptyState
            type="no-recommendations"
            onAction={onUpdatePreferences}
        />
    );
}

// Componente específico para errores de conexión
export function ConnectionError({ onRetry }) {
    return (
        <EmptyState
            type="connection-error"
            onAction={onRetry}
        />
    );
}

// Componente específico para resultados de búsqueda vacíos
export function SearchNoResults({ searchQuery, onClearSearch }) {
    return (
        <EmptyState
            type="search-no-results"
            title="Sin resultados para tu búsqueda"
            description={`No encontramos libros que coincidan con "${searchQuery}". Intenta con otros términos o navega por nuestras recomendaciones.`}
            actionLabel="Limpiar búsqueda"
            onAction={onClearSearch}
        />
    );
} 