'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import RecommendationCard from './RecommendationCard';

export default function RecommendationCarousel({
    recommendations = [],
    loading = false,
    onLike,
    onDislike,
    onAddToLibrary,
    onViewDetails
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carouselRef = useRef(null);
    const startXRef = useRef(0);
    const isDraggingRef = useRef(false);

    // Configuración responsive del carrusel
    const [itemsPerView, setItemsPerView] = useState(1);

    useEffect(() => {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            if (width >= 1024) { // lg
                setItemsPerView(3);
            } else if (width >= 768) { // md
                setItemsPerView(2);
            } else { // sm
                setItemsPerView(1);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    // Datos para mostrar (incluyendo loading states)
    const displayData = loading
        ? Array(6).fill(null).map((_, index) => ({ id: `loading-${index}`, loading: true }))
        : recommendations;

    const totalItems = displayData.length;
    const maxIndex = Math.max(0, totalItems - itemsPerView);

    // Navegación del carrusel
    const goToNext = () => {
        if (currentIndex < maxIndex && !isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev + 1);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0 && !isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev - 1);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    const goToIndex = (index) => {
        if (index !== currentIndex && !isTransitioning && index >= 0 && index <= maxIndex) {
            setIsTransitioning(true);
            setCurrentIndex(index);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    // Manejo de eventos touch para móvil
    const handleTouchStart = (e) => {
        startXRef.current = e.touches[0].clientX;
        isDraggingRef.current = false;
    };

    const handleTouchMove = (e) => {
        if (!startXRef.current) return;

        const currentX = e.touches[0].clientX;
        const diffX = startXRef.current - currentX;

        if (Math.abs(diffX) > 10) {
            isDraggingRef.current = true;
        }
    };

    const handleTouchEnd = (e) => {
        if (!startXRef.current || !isDraggingRef.current) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startXRef.current - endX;

        // Umbral mínimo para considerar un swipe
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                goToNext(); // Swipe left - next
            } else {
                goToPrevious(); // Swipe right - previous
            }
        }

        startXRef.current = 0;
        isDraggingRef.current = false;
    };

    // Evitar click cuando se está haciendo swipe
    const handleCardClick = (e, callback) => {
        if (isDraggingRef.current) {
            e.preventDefault();
            return;
        }
        callback?.();
    };

    if (totalItems === 0 && !loading) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500">
                <p>No hay recomendaciones disponibles</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Carrusel principal */}
            <div
                ref={carouselRef}
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                        width: `${(totalItems / itemsPerView) * 100}%`
                    }}
                >
                    {displayData.map((item, index) => (
                        <div
                            key={item.id || item.isbn13 || index}
                            className="flex-shrink-0 px-2"
                            style={{ width: `${100 / totalItems}%` }}
                        >
                            <RecommendationCard
                                book={item}
                                loading={item.loading}
                                onLike={(book) => handleCardClick(null, () => onLike?.(book))}
                                onDislike={(book) => handleCardClick(null, () => onDislike?.(book))}
                                onAddToLibrary={(book) => handleCardClick(null, () => onAddToLibrary?.(book))}
                                onViewDetails={(book) => handleCardClick(null, () => onViewDetails?.(book))}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Botones de navegación - Solo mostrar si hay más items que los visibles */}
            {totalItems > itemsPerView && !loading && (
                <>
                    {/* Botón anterior */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevious}
                        disabled={currentIndex === 0 || isTransitioning}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-2"
                        aria-label="Recomendación anterior"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Botón siguiente */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNext}
                        disabled={currentIndex === maxIndex || isTransitioning}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-2"
                        aria-label="Siguiente recomendación"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </>
            )}

            {/* Indicadores de posición - Solo mostrar si hay múltiples páginas */}
            {totalItems > itemsPerView && !loading && (
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: maxIndex + 1 }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            disabled={isTransitioning}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                ? 'bg-indigo-600 scale-125'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Ir a página ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Información de navegación para lectores de pantalla */}
            <div className="sr-only" aria-live="polite">
                Mostrando {Math.min(itemsPerView, totalItems)} de {totalItems} recomendaciones.
                Página {currentIndex + 1} de {maxIndex + 1}.
            </div>
        </div>
    );
} 