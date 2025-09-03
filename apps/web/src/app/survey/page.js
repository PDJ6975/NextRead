'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SurveyWizardCozy } from '../../components/survey/SurveyWizardCozy';
import { LoadingCozyIcon } from '../../components/ui/cozy/IconCozy';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function SurveyPage() {
    const { user } = useAuth();
    const [initialSurvey, setInitialSurvey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInitialSurvey();
    }, []);

    const loadInitialSurvey = async () => {
        try {
            const { surveyService } = await import('../../services/surveyService');
            const response = await surveyService.getSurvey();
            setInitialSurvey(response.data);
        } catch (error) {
            console.error('Error al cargar encuesta inicial:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cozy-cream via-cozy-white to-cozy-mint relative overflow-hidden">
                {/* Fondo decorativo*/}
                <div className="absolute inset-0 cozy-texture-paper opacity-30" />
                
                <div className="text-center relative z-10">
                    <LoadingCozyIcon size="2xl" className="text-cozy-sage mx-auto mb-4" />
                    <p className="text-cozy-medium-gray font-cozy text-lg">Preparando tu cuestionario...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute requiresFirstTime={true}>
            <SurveyWizardCozy
                initialSurvey={initialSurvey}
                isFirstTime={user?.firstTime !== false}
            />
        </ProtectedRoute>
    );
} 