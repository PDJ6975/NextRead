'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import userStatsService from '../../services/userStatsService';

// Componente de Skeleton para loading
function StatCardSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardContent className="p-6">
                <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gray-200 w-10 h-10"></div>
                    <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Componente individual de estadística
function StatCard({ title, value, icon: Icon, color, description, loading }) {
    if (loading) {
        return <StatCardSkeleton />;
    }

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {description && (
                            <p className="text-xs text-gray-500 mt-1">{description}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardStats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userStats, setUserStats] = useState({
        booksRead: 0,
        booksReading: 0,
        pagesRead: 0,
        averageRating: 0
    });

    // Cargar estadísticas del usuario
    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simular delay para mostrar skeleton loading
                await userStatsService.simulateDelay(800);

                const stats = await userStatsService.getUserStats();
                setUserStats(stats);
            } catch (err) {
                setError('Error al cargar estadísticas');
                console.error('Error loading user stats:', err);

                // En caso de error, usar estadísticas por defecto
                setUserStats(userStatsService.getDefaultStats());
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    // Configuración de las cards de estadísticas
    const statsConfig = [
        {
            title: 'Libros Leídos',
            value: loading ? '-' : userStats.booksRead,
            icon: BookOpen,
            color: 'blue',
            description: loading ? '' : `${userStats.totalBooks} libros en total`
        },
        {
            title: 'Leyendo Ahora',
            value: loading ? '-' : userStats.booksReading,
            icon: Clock,
            color: 'orange',
            description: loading ? '' : 'En progreso'
        },
        {
            title: 'Páginas Leídas',
            value: loading ? '-' : userStats.pagesRead.toLocaleString(),
            icon: Target,
            color: 'green',
            description: loading ? '' : 'Total acumulado'
        },
        {
            title: 'Rating Promedio',
            value: loading ? '-' : userStats.averageRating > 0 ? `${userStats.averageRating}⭐` : 'Sin valorar',
            icon: TrendingUp,
            color: 'purple',
            description: loading ? '' : 'De tus libros valorados'
        }
    ];

    if (error) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <Card key={index} className="border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center h-20">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsConfig.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    description={stat.description}
                    loading={loading}
                />
            ))}
        </div>
    );
} 