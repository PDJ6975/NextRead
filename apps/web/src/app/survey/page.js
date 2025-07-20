'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SurveyWizard } from '../../components/survey/SurveyWizard';
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
            // No mostrar error, la encuesta se creará automáticamente
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando encuesta...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute requiresFirstTime={true}>
            <SurveyWizard
                initialSurvey={initialSurvey}
                isFirstTime={user?.firstTime !== false}
            />
        </ProtectedRoute>
    );
} 