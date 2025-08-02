'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import recommendationService from '../../services/recommendationService';

export default function GenerateRecommendationsButton({ onRecommendationsGenerated, className = '' }) {
    const { user } = useAuth();
    const router = useRouter();
    const [generating, setGenerating] = useState(false);

    const handleClick = async () => {
        // Si el usuario no está autenticado, redirigir a login
        if (!user) {
            router.push('/auth/login');
            return;
        }

        // Si está autenticado, generar recomendaciones
        setGenerating(true);
        try {
            const newRecommendations = await recommendationService.generateNewRecommendations();
            if (onRecommendationsGenerated) {
                onRecommendationsGenerated(newRecommendations);
            }
        } catch (error) {
            console.error('Error al generar recomendaciones:', error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center text-center space-y-6 ${className}`}>
            {/* Título principal */}
            <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Descubre tu próximo libro favorito
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {user 
                        ? 'Obtén recomendaciones personalizadas basadas en tus gustos y preferencias de lectura'
                        : 'Regístrate para obtener recomendaciones personalizadas basadas en tus gustos de lectura'
                    }
                </p>
            </div>

            {/* Botón principal */}
            <Button
                onClick={handleClick}
                disabled={generating}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
                {generating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Generando recomendaciones...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        {user ? 'Generar Recomendaciones' : 'Comenzar ahora'}
                        <ArrowRight className="w-5 h-5 ml-3" />
                    </>
                )}
            </Button>

            {/* Información adicional para usuarios anónimos */}
            {!user && (
                <div className="mt-4 text-sm text-gray-500 space-y-2">
                    <p>✨ Recomendaciones personalizadas con IA</p>
                    <p>📚 Gestiona tu biblioteca personal</p>
                    <p>📊 Estadísticas de tu progreso de lectura</p>
                </div>
            )}

            {/* Información adicional para usuarios autenticados */}
            {user && (
                <div className="mt-4 text-sm text-gray-500">
                    <p>Basado en tus géneros favoritos y libros leídos</p>
                </div>
            )}
        </div>
    );
}
