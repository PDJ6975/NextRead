'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function HomePage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute requiresFirstTime={false}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido!</h1>
                            <p className="text-gray-600">Tu dashboard de NextRead</p>
                        </div>
                        <Button variant="outline" onClick={logout}>
                            Cerrar Sesión
                        </Button>
                    </div>

                    <Card className="w-full">
                        <CardHeader className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Principal</h2>
                            <p className="text-gray-600">Esta página será desarrollada en la siguiente fase</p>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-500 mb-4">
                                Aquí implementaremos el dashboard principal con recomendaciones y gestión de libros
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <p className="text-sm text-yellow-800">
                                    🚧 Página en desarrollo - Fase 4 del plan de acción
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
} 