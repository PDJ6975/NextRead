'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

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

export default function DashboardStats({ stats }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userStats, setUserStats] = useState({
        booksRead: 0,
        booksReading: 0,
        pagesRead: 0,
        averageRating: 0
    });

    // Simular carga de estadísticas (en el futuro será una API call real)
    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 1500));

                // En el futuro, esto será:
                // const response = await fetch('/api/userbooks/stats');
                // const data = await response.json();

                // Por ahora, datos de ejemplo
                const mockStats = {
                    booksRead: stats?.booksRead || Math.floor(Math.random() * 50) + 10,
                    booksReading: stats?.booksReading || Math.floor(Math.random() * 5) + 1,
                    pagesRead: stats?.pagesRead || Math.floor(Math.random() * 5000) + 1000,
                    averageRating: stats?.averageRating || (Math.random() * 2 + 3).toFixed(1)
                };

                setUserStats(mockStats);
            } catch (err) {
                setError('Error al cargar estadísticas');
                console.error('Error loading stats:', err);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [stats]);

    // Configuración de las cards de estadísticas
    const statsConfig = [
        {
            title: 'Libros Leídos',
            value: loading ? '-' : userStats.booksRead,
            icon: BookOpen,
            color: 'blue',
            description: loading ? '' : 'Este año'
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
            value: loading ? '-' : `${userStats.averageRating}⭐`,
            icon: TrendingUp,
            color: 'purple',
            description: loading ? '' : 'De tus libros'
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