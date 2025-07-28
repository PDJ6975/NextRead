'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStats from '../../components/dashboard/DashboardStats';
import RecommendationsSection from '../../components/dashboard/RecommendationsSection';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import UserLibrarySection from '../../components/dashboard/UserLibrarySection';
import { useAuth } from '../../contexts/AuthContext';

export default function HomePage() {
    const { user, logout } = useAuth();

    const handleBookAdded = (book) => {
        console.log('Libro añadido desde recomendaciones:', book.title);
        // TODO: Actualizar lista de libros del usuario
        // TODO: Mostrar toast de confirmación
    };

    return (
        <ProtectedRoute requiresFirstTime={false}>
            <DashboardLayout>
                <div className="flex flex-col min-h-full">
                    {/* Header del Dashboard */}
                    <DashboardHeader user={user} onLogout={logout} />

                    {/* Contenido Principal */}
                    <div className="flex-1 p-6 space-y-6">
                        {/* Estadísticas del Usuario */}
                        <section>
                            <DashboardStats />
                        </section>

                        {/* Grid de Contenido Principal */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Columna Principal - Recomendaciones */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Sección de Recomendaciones */}
                                <RecommendationsSection
                                    maxRecommendations={6}
                                    onBookAdded={handleBookAdded}
                                />

                                {/* Sección de Historial de Libros */}
                                {/* Biblioteca del usuario */}
                                <UserLibrarySection />
                            </div>

                            {/* Sidebar - Acciones Rápidas */}
                            <div className="space-y-6">
                                {/* Acciones Rápidas */}
                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Acciones rápidas
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                            <h4 className="text-sm font-medium text-blue-900 mb-2">
                                                🔍 Buscar libros
                                            </h4>
                                            <p className="text-xs text-blue-700 mb-3">
                                                Encuentra y añade nuevos libros a tu biblioteca
                                            </p>
                                            <div className="bg-white border border-blue-200 rounded px-3 py-2 text-sm text-gray-500">
                                                🚧 Próximamente
                                            </div>
                                        </div>

                                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                            <h4 className="text-sm font-medium text-green-900 mb-2">
                                                ⭐ Calificar libros
                                            </h4>
                                            <p className="text-xs text-green-700 mb-3">
                                                Mejora tus recomendaciones calificando lecturas
                                            </p>
                                            <div className="bg-white border border-green-200 rounded px-3 py-2 text-sm text-gray-500">
                                                🚧 Próximamente
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                                            <h4 className="text-sm font-medium text-purple-900 mb-2">
                                                🎯 Generar recomendaciones
                                            </h4>
                                            <p className="text-xs text-purple-700 mb-3">
                                                Obtén nuevas sugerencias personalizadas
                                            </p>
                                            <div className="bg-white border border-purple-200 rounded px-3 py-2 text-sm text-gray-500">
                                                ✅ Disponible arriba
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Progreso del Usuario */}
                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Tu progreso
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-600">Meta de lectura anual</span>
                                                    <span className="font-medium text-gray-900">24 libros</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: '42%' }}
                                                    />
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    10 de 24 libros (42%)
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100">
                                                <div className="text-sm text-gray-600 mb-2">
                                                    Racha de lectura
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl font-bold text-orange-600">7</span>
                                                    <span className="text-sm text-gray-600">días consecutivos</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
} 