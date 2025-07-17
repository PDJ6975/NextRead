'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { useValidation } from '../../../hooks/useValidation';
import { registerSchema } from '../../../lib/validationSchemas';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const { errors, validate, setErrors } = useValidation(registerSchema);
    const router = useRouter();

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
            await register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            // Redirigir a página de verificación
            router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
        } catch (error) {
            console.error('Error en registro:', error);

            // Manejar errores específicos del backend
            if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Error al crear la cuenta. Inténtalo de nuevo.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
                    <p className="text-gray-600">Únete a NextRead y descubre tu próximo libro favorito</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        <Input
                            label="Nombre completo"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            placeholder="Tu nombre completo"
                            required
                        />

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
                            placeholder="Mínimo 6 caracteres"
                            required
                        />

                        <Input
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="Repite tu contraseña"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 