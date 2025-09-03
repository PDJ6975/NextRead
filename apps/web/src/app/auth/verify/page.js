'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { ButtonCozy } from '../../../components/ui/cozy/ButtonCozy';
import { InputCozy } from '../../../components/ui/cozy/InputCozy';
import { CardCozy } from '../../../components/ui/cozy/CardCozy';
import { IconCozy } from '../../../components/ui/cozy/IconCozy';
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
        <div className="min-h-screen bg-gradient-to-br from-cozy-cream to-cozy-mint flex items-center justify-center p-4">
            <CardCozy variant="vintage" className="w-full max-w-md cozy-animate-float p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <IconCozy 
                            name="star" 
                            size="lg" 
                            className="text-cozy-soft-yellow"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-cozy-dark-gray mb-2 font-comfortaa">
                        Verificar Email
                    </h1>
                    <p className="text-cozy-medium-gray font-nunito">
                        Hemos enviado un código mágico a tu email
                    </p>
                </div>

                <div className="space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className={`border rounded-lg p-3 ${errors.general.includes('exitosamente')
                                ? 'bg-cozy-sage/10 border-cozy-sage/30'
                                : 'bg-cozy-terracotta/10 border-cozy-terracotta/30'
                                }`}>
                                <div className="flex items-center space-x-2">
                                    <IconCozy 
                                        name={errors.general.includes('exitosamente') ? 'star' : 'heart'} 
                                        size="sm" 
                                        className={errors.general.includes('exitosamente') 
                                            ? 'text-cozy-sage' 
                                            : 'text-cozy-terracotta'
                                        } 
                                    />
                                    <p className={`text-sm font-nunito ${errors.general.includes('exitosamente')
                                        ? 'text-cozy-forest'
                                        : 'text-cozy-terracotta'
                                        }`}>
                                        {errors.general}
                                    </p>
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
                            label="Código de verificación"
                            name="verificationCode"
                            type="text"
                            value={formData.verificationCode}
                            onChange={handleChange}
                            error={errors.verificationCode}
                            placeholder="Ingresa el código de 6 dígitos"
                            maxLength={6}
                            icon="star"
                            required
                        />

                        <ButtonCozy
                            variant="warm"
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verificando...' : 'Verificar Código'}
                        </ButtonCozy>
                    </form>

                    {/* Sección de reenvío*/}
                    <div className="text-center space-y-3">
                        <p className="text-sm text-cozy-medium-gray font-nunito">
                            ¿No recibiste el código?
                        </p>
                        <ButtonCozy
                            variant="ghost"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="text-sm"
                        >
                            <div className="flex items-center space-x-1">
                                <IconCozy name="magic" size="sm" />
                                <span>{isResending ? 'Reenviando...' : 'Reenviar código'}</span>
                            </div>
                        </ButtonCozy>
                    </div>

                    {/* Enlace de navegación */}
                    <div className="text-center pt-2">
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="text-sm text-cozy-medium-gray hover:text-cozy-dark-gray transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                            <IconCozy name="plant" size="sm" />
                            <span>Volver al inicio de sesión</span>
                        </button>
                    </div>
                </div>
            </CardCozy>
        </div>
    );
}

export default function VerifyPage() {
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
            <VerifyContent />
        </Suspense>
    );
} 