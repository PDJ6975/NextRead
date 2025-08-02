'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStats from '../../components/dashboard/DashboardStats';
import GenerateRecommendationsButton from '../../components/dashboard/GenerateRecommendationsButton';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import UserLibrarySection from '../../components/dashboard/UserLibrarySection';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function HomePage() {
    const { user, logout } = useAuth();
    const [recommendations, setRecommendations] = useState([]);

    const handleBookAdded = (book) => {
        console.log('Libro añadido desde recomendaciones:', book.title);
        // TODO: Actualizar lista de libros del usuario
        // TODO: Mostrar toast de confirmación
    };

    const handleRecommendationsGenerated = (newRecommendations) => {
        setRecommendations(newRecommendations);
        console.log('Nuevas recomendaciones generadas:', newRecommendations);
    };

    // Callback para eliminar recomendación tras añadir a biblioteca
    const handleRecommendationAdded = (recommendation) => {
        setRecommendations(prev => prev.filter(rec => rec !== recommendation));
    };

    return (
        <ProtectedRoute requiresFirstTime={false} allowAnonymous={true}>
            <DashboardLayout>
                <DashboardHeader user={user} onLogout={logout} />
                <div className="flex-1 p-6 space-y-6">
                    {/* Estadísticas del Usuario - Solo mostrar si está autenticado */}
                    {user ? (
                        <section>
                            <DashboardStats />
                        </section>
                    ) : (
                        /* Mensaje de bienvenida para usuarios anónimos */
                        <section className="text-center py-8">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    ¡Bienvenido a NextRead! 📚
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Descubre tu próximo libro favorito con recomendaciones personalizadas. 
                                    Regístrate para comenzar tu viaje de lectura y guardar tu progreso.
                                </p>
                            </div>
                        </section>
                    )}
                    
                    {/* Botón Central de Generar Recomendaciones */}
                    <section className="py-12">
                        <GenerateRecommendationsButton 
                            onRecommendationsGenerated={handleRecommendationsGenerated}
                            className="px-6"
                        />
                    </section>

                    {/* Biblioteca del usuario - Solo mostrar si está autenticado */}
                    {user && (
                        <section>
                            <UserLibrarySection 
                                recommendations={recommendations} 
                                onRecommendationAdded={handleRecommendationAdded}
                            />
                        </section>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
} 