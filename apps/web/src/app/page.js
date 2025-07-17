'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NextRead</h1>
          <p className="text-gray-600">Descubre tu próximo libro favorito</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-gray-500">
              Obtén recomendaciones personalizadas basadas en tus gustos y preferencias de lectura
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => router.push('/auth/login')}
            >
              Iniciar Sesión
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/auth/register')}
            >
              Crear Cuenta
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              ¿Primera vez aquí? Regístrate para comenzar tu viaje de lectura
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
