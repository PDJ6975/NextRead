'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';

export default function SurveyPage() {
    return (
        <ProtectedRoute requiresFirstTime={true}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Encuesta de Preferencias</h1>
                        <p className="text-gray-600">Esta página será desarrollada en la siguiente fase</p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-500 mb-4">
                            Aquí implementaremos el wizard de encuestas para usuarios nuevos
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <p className="text-sm text-yellow-800">
                                🚧 Página en desarrollo - Fase 3 del plan de acción
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
} 