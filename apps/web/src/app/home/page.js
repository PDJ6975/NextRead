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
                <DashboardHeader user={user} onLogout={logout} />
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
                        {/* Sidebar vacío para MVP, sin 'Tu progreso' */}
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
} 