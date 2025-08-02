'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayoutCozy from '../../components/layout/DashboardLayoutCozy';
import DashboardHeaderCozy from '../../components/dashboard/DashboardHeaderCozy';
import DashboardStats from '../../components/dashboard/DashboardStats';
import GenerateRecommendationsButton from '../../components/dashboard/GenerateRecommendationsButton';
import { CardCozy } from '../../components/ui/cozy/CardCozy';
import UserLibrarySection from '../../components/dashboard/UserLibrarySection';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function HomePage() {
    const { user, logout } = useAuth();
    const [recommendations, setRecommendations] = useState([]);

    const handleRecommendationsGenerated = (newRecommendations) => {
        setRecommendations(newRecommendations);
    };

    // Callback para eliminar recomendación tras añadir a biblioteca
    const handleRecommendationAdded = (recommendation) => {
        setRecommendations(prev => prev.filter(rec => rec !== recommendation));
    };

    return (
        <ProtectedRoute requiresFirstTime={false} allowAnonymous={true}>
            <DashboardLayoutCozy>
                <DashboardHeaderCozy user={user} onLogout={logout} />
                <div className="flex-1 space-y-8">
                    {/* Estadísticas del Usuario - Solo mostrar si está autenticado */}
                    {user ? (
                        <section>
                            <DashboardStats />
                        </section>
                    ) : (
                        /* Mensaje de bienvenida cozy para usuarios anónimos */
                        <section className="text-center py-12">
                            <CardCozy variant="magical" className="max-w-4xl mx-auto p-12">
                                <div className="space-y-6">
                                    <div className="text-6xl mb-4">📚✨</div>
                                    <h2 className="text-4xl font-bold font-cozy-display text-cozy-warm-brown mb-4">
                                        ¡Bienvenido a tu refugio literario!
                                    </h2>
                                    <p className="text-lg text-cozy-dark-gray max-w-3xl mx-auto font-cozy leading-relaxed">
                                        Descubre tu próximo libro favorito en este acogedor rincón de lectura. 
                                        Aquí encontrarás recomendaciones personalizadas, un lugar para guardar tus libros 
                                        y un espacio cálido para que tu amor por la lectura crezca día a día.
                                    </p>
                                    <div className="flex items-center justify-center space-x-3 text-cozy-sage pt-4">
                                        <span className="text-2xl">🌿</span>
                                        <span className="font-cozy text-cozy-medium-gray">Regístrate para comenzar tu viaje literario</span>
                                        <span className="text-2xl">🌿</span>
                                    </div>
                                </div>
                            </CardCozy>
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
            </DashboardLayoutCozy>
        </ProtectedRoute>
    );
} 