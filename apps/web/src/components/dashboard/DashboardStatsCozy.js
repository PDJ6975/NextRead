'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { CardCozy } from '../ui/cozy/CardCozy';
import { BookCozyIcon, StarCozyIcon, HeartCozyIcon, PlantCozyIcon } from '../ui/cozy/IconCozy';
import userStatsService from '../../services/userStatsService';

// Componente de Skeleton cozy para loading
function StatCardSkeletonCozy() {
    return (
        <CardCozy variant="default" className="animate-pulse">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-cozy-sage/20 w-12 h-12"></div>
                    <div className="ml-4 flex-1">
                        <div className="h-4 bg-cozy-light-gray rounded-lg w-24 mb-3"></div>
                        <div className="h-8 bg-cozy-medium-gray/50 rounded-lg w-16"></div>
                    </div>
                </div>
            </div>
        </CardCozy>
    );
}

// Componente individual de estadística cozy
function StatCardCozy({ title, value, icon: Icon, variant, description, loading, animated = true }) {
    const [isVisible, setIsVisible] = useState(false);
    const [currentValue, setCurrentValue] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!loading && value !== undefined) {
            setIsVisible(true);
            
            if (typeof value === 'number') {
                const targetValue = value;
                const previousValue = currentValue;
                
                // Si es la primera carga o el valor cambió significativamente, animar
                if (previousValue === 0 || Math.abs(targetValue - previousValue) > 0) {
                    setIsUpdating(true);
                    
                    if (animated && previousValue > 0) {
                        // Animación suave para actualizaciones
                        const duration = 1000; // 1 segundo
                        const stepTime = 50;
                        const steps = duration / stepTime;
                        const increment = (targetValue - previousValue) / steps;
                        let current = previousValue;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if ((increment > 0 && current >= targetValue) || 
                                (increment < 0 && current <= targetValue)) {
                                setCurrentValue(targetValue);
                                setIsUpdating(false);
                                clearInterval(timer);
                            } else {
                                setCurrentValue(Math.round(current * 10) / 10); // Redondear para decimales
                            }
                        }, stepTime);

                        return () => clearInterval(timer);
                    } else {
                        // Carga inicial con animación más dramática
                        const duration = 2000; // 2 segundos
                        const increment = targetValue / (duration / 50);
                        let current = 0;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= targetValue) {
                                setCurrentValue(targetValue);
                                setIsUpdating(false);
                                clearInterval(timer);
                            } else {
                                setCurrentValue(Math.floor(current));
                            }
                        }, 50);

                        return () => clearInterval(timer);
                    }
                } else {
                    setCurrentValue(targetValue);
                    setIsUpdating(false);
                }
            } else {
                setCurrentValue(value);
                setIsUpdating(false);
            }
        }
    }, [loading, value, animated]);

    if (loading) {
        return <StatCardSkeletonCozy />;
    }

    // Configuración de colores y efectos por variante
    const variantConfig = {
        books: {
            iconBg: 'bg-gradient-to-br from-cozy-sage/80 to-cozy-forest/80',
            iconColor: 'text-white',
            cardVariant: 'nature',
            sparkleColor: 'text-cozy-sage'
        },
        pages: {
            iconBg: 'bg-gradient-to-br from-cozy-terracotta/80 to-cozy-warm-brown/80',
            iconColor: 'text-white',
            cardVariant: 'warm',
            sparkleColor: 'text-cozy-terracotta'
        },
        rating: {
            iconBg: 'bg-gradient-to-br from-cozy-soft-yellow/80 to-cozy-peach/80',
            iconColor: 'text-cozy-warm-brown',
            cardVariant: 'dreamy',
            sparkleColor: 'text-cozy-soft-yellow'
        },
        reading: {
            iconBg: 'bg-gradient-to-br from-cozy-lavender/80 to-cozy-mint/80',
            iconColor: 'text-cozy-warm-brown',
            cardVariant: 'vintage',
            sparkleColor: 'text-cozy-lavender'
        }
    };

    const config = variantConfig[variant] || variantConfig.books;
    const displayValue = typeof value === 'number' && animated ? currentValue : value;

    return (
        <CardCozy 
            variant={config.cardVariant} 
            interactive={true}
            className={`group relative overflow-hidden ${isVisible ? 'cozy-animate-scale-in' : ''}`}
        >
            <div className="p-6 relative">
                {/* Partículas decorativas */}
                <div className="absolute top-2 right-2 opacity-60">
                    <div className={`w-1 h-1 ${config.sparkleColor} rounded-full cozy-animate-sparkle`} 
                         style={{ animationDelay: '0s' }} />
                    <div className={`w-0.5 h-0.5 ${config.sparkleColor} rounded-full cozy-animate-sparkle absolute top-2 left-2`} 
                         style={{ animationDelay: '1s' }} />
                </div>

                <div className="flex items-center">
                    {/* Icono con estilo "ficha de madera" */}
                    <div className={`p-3 rounded-xl ${config.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    
                    <div className="ml-4 flex-1">
                        {/* Título con tipografía cozy */}
                        <p className="text-sm font-medium text-cozy-dark-gray font-cozy mb-1">
                            {title}
                        </p>
                        
                        {/* Valor con tipografía destacada */}
                        <p className={`text-3xl font-bold text-cozy-warm-brown font-cozy-display tracking-tight transition-all duration-300 ${
                            isUpdating ? 'scale-105 text-cozy-sage' : ''
                        }`}>
                            {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
                        </p>
                        
                        {/* Descripción */}
                        {description && (
                            <p className="text-xs text-cozy-medium-gray mt-2 font-cozy">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Elemento decorativo inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cozy-sage/20 to-transparent opacity-50"></div>
            </div>
        </CardCozy>
    );
}

const DashboardStatsCozy = forwardRef(function DashboardStatsCozy({ refreshTrigger = 0 }, ref) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userStats, setUserStats] = useState({
        booksRead: 0,
        booksReading: 0,
        pagesRead: 0,
        averageRating: 0,
        totalBooks: 0
    });

    // Función de recarga que se puede llamar externamente
    const loadStats = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);

            // Simular delay solo si se muestra loading
            if (showLoading) {
                await userStatsService.simulateDelay(800);
            }

            const stats = await userStatsService.getUserStats();
            setUserStats(stats);
        } catch (err) {
            setError('Error al cargar estadísticas');
            console.error('Error loading user stats:', err);

            // En caso de error, usar estadísticas por defecto
            setUserStats(userStatsService.getDefaultStats());
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    // Función optimizada para actualizar solo los valores
    const updateStatsQuietly = async () => {
        try {
            const stats = await userStatsService.getUserStats();
            setUserStats(stats);
        } catch (err) {
            console.error('Error updating stats quietly:', err);
        }
    };

    // Exponer las funciones al componente padre
    useImperativeHandle(ref, () => ({
        refresh: loadStats,
        updateQuietly: updateStatsQuietly
    }));

    // Cargar estadísticas del usuario
    useEffect(() => {
        loadStats();
    }, [refreshTrigger]); // Dependencia del refreshTrigger para recargar cuando cambie

    // Configuración de las cards de estadísticas cozy
    const statsConfigCozy = [
        {
            title: 'Libros Completados',
            value: loading ? 0 : userStats.booksRead,
            icon: BookCozyIcon,
            variant: 'books',
            description: loading ? 'Cargando...' : `${userStats.totalBooks} libros en tu biblioteca`
        },
        {
            title: 'Páginas Leídas',
            value: loading ? 0 : userStats.pagesRead,
            icon: BookOpen,
            variant: 'pages',
            description: loading ? 'Cargando...' : 'Total de páginas leídas'
        },
        {
            title: 'Valoración Promedio',
            value: loading ? 0 : userStats.averageRating > 0 ? userStats.averageRating : 0,
            icon: StarCozyIcon,
            variant: 'rating',
            description: loading ? 'Cargando...' : userStats.averageRating > 0 ? 'De tus libros favoritos' : 'Aún no has valorado libros'
        }
    ];

    // Estado de error con estilo cozy
    if (error) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                    <CardCozy key={index} variant="default" className="border-cozy-terracotta/30">
                        <div className="p-6">
                            <div className="flex items-center justify-center h-20">
                                <div className="text-center">
                                    <div className="text-2xl mb-2">😔</div>
                                    <p className="text-cozy-terracotta text-sm font-cozy">
                                        No pudimos cargar tus estadísticas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardCozy>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Título de sección con estilo cozy */}
            <div className="text-center">
                <h2 className="text-2xl font-bold font-cozy-display text-cozy-warm-brown mb-2">
                    Tu Progreso Literario
                </h2>
                <p className="text-cozy-medium-gray font-cozy">
                    Echa un vistazo a tu viaje en el mundo de los libros
                </p>
            </div>

            {/* Grid de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsConfigCozy.map((stat, index) => (
                    <div 
                        key={index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <StatCardCozy
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            variant={stat.variant}
                            description={stat.description}
                            loading={loading}
                            animated={false}
                        />
                    </div>
                ))}
            </div>

            {/* Mensaje motivacional */}
            {!loading && userStats.booksRead > 0 && (
                <div className="text-center mt-8">
                    <CardCozy variant="magical" className="max-w-md mx-auto p-4">
                        <div className="flex items-center justify-center space-x-2 text-cozy-warm-brown">
                            <HeartCozyIcon className="w-5 h-5 text-cozy-terracotta" />
                            <span className="font-cozy text-sm">
                                ¡Sigue así! Cada página es un paso en tu viaje literario
                            </span>
                            <HeartCozyIcon className="w-5 h-5 text-cozy-terracotta" />
                        </div>
                    </CardCozy>
                </div>
            )}
        </div>
    );
});

export default DashboardStatsCozy;
