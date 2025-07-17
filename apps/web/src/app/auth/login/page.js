'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { useValidation } from '../../../hooks/useValidation';
import { loginSchema } from '../../../lib/validationSchemas';

function LoginContent() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { login } = useAuth();
    const { errors, validate, setErrors } = useValidation(loginSchema);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const verified = searchParams.get('verified');
        if (verified === 'true') {
            setSuccessMessage('¡Email verificado exitosamente! Ahora puedes iniciar sesión.');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate(formData)) {
            return;
        }

        setIsLoading(true);
        setSuccessMessage('');

        try {
            const userData = await login(formData);

            // Redirigir según el estado del usuario
            if (userData.firstTime) {
                router.push('/survey');
            } else {
                router.push('/home');
            }
        } catch (error) {
            console.error('Error en login:', error);

            // Manejar errores específicos del backend
            if (error.response?.status === 401) {
                setErrors({ general: 'Email o contraseña incorrectos.' });
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Error al iniciar sesión. Inténtalo de nuevo.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
                    <p className="text-gray-600">Bienvenido de vuelta a NextRead</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                <p className="text-sm text-green-600">{successMessage}</p>
                            </div>
                        )}

                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="tu@email.com"
                            required
                        />

                        <Input
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Tu contraseña"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <button
                                onClick={() => router.push('/auth/register')}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Regístrate
                            </button>
                        </p>

                        <button
                            onClick={() => router.push('/')}
                            className="text-sm text-gray-500 hover:text-gray-600"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
} 