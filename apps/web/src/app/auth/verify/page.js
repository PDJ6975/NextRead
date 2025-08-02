'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { useValidation } from '../../../hooks/useValidation';
import { verifySchema } from '../../../lib/validationSchemas';
import { authService } from '../../../services/authService';

function VerifyContent() {
    const [formData, setFormData] = useState({
        email: '',
        verificationCode: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { verify, login } = useAuth();
    const { errors, validate, setErrors } = useValidation(verifySchema);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            setFormData(prev => ({ ...prev, email }));
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

        try {
            const response = await verify(formData);

            // Si hubo auto-login tras verificación, redirigir al dashboard
            // El ProtectedRoute se encargará de redirigir a /survey si es firstTime
            if (response && response.autoLogin) {
                router.push('/home');
            } else {
                // Redirigir a login con mensaje de verificación exitosa
                router.push('/auth/login?verified=true');
            }
        } catch (error) {
            console.error('Error en verificación:', error);

            // Manejar errores específicos del backend
            if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Código de verificación inválido. Inténtalo de nuevo.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!formData.email) {
            setErrors({ email: 'Email es requerido para reenviar el código' });
            return;
        }

        setIsResending(true);

        try {
            await authService.resendCode(formData.email);
            setErrors({ general: 'Código reenviado exitosamente. Revisa tu email.' });
        } catch (error) {
            console.error('Error al reenviar código:', error);
            setErrors({ general: 'Error al reenviar el código. Inténtalo de nuevo.' });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificar Email</h1>
                    <p className="text-gray-600">
                        Hemos enviado un código de verificación a tu email
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.general && (
                            <div className={`border rounded-md p-3 ${errors.general.includes('exitosamente')
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                                }`}>
                                <p className={`text-sm ${errors.general.includes('exitosamente')
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}>
                                    {errors.general}
                                </p>
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
                            label="Código de verificación"
                            name="verificationCode"
                            type="text"
                            value={formData.verificationCode}
                            onChange={handleChange}
                            error={errors.verificationCode}
                            placeholder="Ingresa el código de 6 dígitos"
                            maxLength={6}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verificando...' : 'Verificar Código'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            ¿No recibiste el código?
                        </p>
                        <button
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
                        >
                            {isResending ? 'Reenviando...' : 'Reenviar código'}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="text-sm text-gray-600 hover:text-gray-700"
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
} 