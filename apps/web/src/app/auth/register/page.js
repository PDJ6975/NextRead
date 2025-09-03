'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { ButtonCozy } from '../../../components/ui/cozy/ButtonCozy';
import { InputCozy } from '../../../components/ui/cozy/InputCozy';
import { CardCozy } from '../../../components/ui/cozy/CardCozy';
import { IconCozy } from '../../../components/ui/cozy/IconCozy';
import { useValidation } from '../../../hooks/useValidation';
import { registerSchema } from '../../../lib/validationSchemas';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
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
                username: formData.username,
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
        <div className="min-h-screen bg-gradient-to-br from-cozy-cream to-cozy-mint flex items-center justify-center p-4">
            <CardCozy variant="vintage" className="w-full max-w-md cozy-animate-float p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <IconCozy 
                            name="magic" 
                            size="lg" 
                            className="text-cozy-terracotta"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-cozy-dark-gray mb-2 font-comfortaa">
                        Únete a NextRead
                    </h1>
                    <p className="text-cozy-medium-gray font-nunito">
                        Descubre tu próximo libro favorito y comienza tu aventura
                    </p>
                </div>

                <div className="space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            label="Nombre de usuario"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            placeholder="Tu nombre de usuario"
                            icon="plant"
                            required
                        />

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
                            placeholder="Mínimo 6 caracteres"
                            icon="star"
                            required
                        />

                        <InputCozy
                            variant="warm"
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="Repite tu contraseña"
                            icon="heart"
                            required
                        />

                        <ButtonCozy
                            variant="nature"
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </ButtonCozy>
                    </form>

                    {/* Enlaces de navegación*/}
                    <div className="text-center">
                        <p className="text-sm text-cozy-medium-gray font-nunito">
                            ¿Ya tienes una cuenta?{' '}
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="text-cozy-sage hover:text-cozy-forest font-medium transition-colors duration-200"
                            >
                                Inicia sesión aquí
                            </button>
                        </p>
                    </div>
                </div>
            </CardCozy>
        </div>
    );
} 