'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { ButtonCozy } from '../../../components/ui/cozy/ButtonCozy';
import { InputCozy } from '../../../components/ui/cozy/InputCozy';
import { CardCozy } from '../../../components/ui/cozy/CardCozy';
import { IconCozy } from '../../../components/ui/cozy/IconCozy';
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
            console.log('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            // Manejar errores específicos del backend
            let errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
            
            if (error.response?.status === 401) {
                errorMessage = error.response.data?.message || 'Email o contraseña incorrectos.';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data?.message || 'Los datos ingresados no son válidos.';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Error en el servidor. Por favor, inténtalo más tarde.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (!error.response) {
                errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
            }

            setErrors({ general: errorMessage });
            
            // NO limpiar el formulario en caso de error
            // El formData se mantiene para que el usuario no tenga que volver a escribir
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cozy-cream to-cozy-mint flex items-center justify-center p-4">
            <CardCozy variant="vintage" className="w-full max-w-md cozy-animate-float p-8">
                {/* Header con icono cozy */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <IconCozy 
                            name="book" 
                            size="lg" 
                            className="text-cozy-sage"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-cozy-dark-gray mb-2 font-comfortaa">
                        Bienvenido de vuelta
                    </h1>
                    <p className="text-cozy-medium-gray font-nunito">
                        Continúa tu aventura de lectura en NextRead
                    </p>
                </div>

                <div className="space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {successMessage && (
                            <div className="bg-cozy-sage/10 border border-cozy-sage/30 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <IconCozy name="star" size="sm" className="text-cozy-sage" />
                                    <p className="text-sm text-cozy-forest font-nunito">{successMessage}</p>
                                </div>
                            </div>
                        )}

                        {errors.general && (
                            <div className="bg-cozy-terracotta/10 border border-cozy-terracotta/30 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <IconCozy name="heart" size="sm" className="text-cozy-terracotta" />
                                    <p className="text-sm text-cozy-terracotta font-nunito">{errors.general}</p>
                                </div>
                            </div>
                        )}

                        <InputCozy
                            variant="warm"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="tu@email.com"
                            icon="book"
                            required
                        />

                        <InputCozy
                            variant="warm"
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Tu contraseña"
                            icon="heart"
                            required
                        />

                        <ButtonCozy
                            variant="warm"
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </ButtonCozy>
                    </form>

                    {/* Enlaces de navegación*/}
                    <div className="space-y-3 text-center">
                        <p className="text-sm text-cozy-medium-gray font-nunito">
                            ¿No tienes una cuenta?{' '}
                            <button
                                onClick={() => router.push('/auth/register')}
                                className="text-cozy-sage hover:text-cozy-forest font-medium transition-colors duration-200"
                            >
                                Regístrate aquí
                            </button>
                        </p>

                        <button
                            onClick={() => router.push('/')}
                            className="text-sm text-cozy-medium-gray hover:text-cozy-dark-gray transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                            <IconCozy name="plant" size="sm" />
                            <span>Volver al inicio</span>
                        </button>
                    </div>
                </div>
            </CardCozy>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-cozy-cream to-cozy-mint flex items-center justify-center">
                <CardCozy variant="dreamy" className="p-12">
                    <div className="flex flex-col items-center space-y-4">
                        <IconCozy name="loading" size="lg" className="text-cozy-sage animate-spin" />
                        <p className="text-cozy-medium-gray font-nunito">Cargando...</p>
                    </div>
                </CardCozy>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
} 