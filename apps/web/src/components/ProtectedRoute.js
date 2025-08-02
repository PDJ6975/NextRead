'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiresFirstTime = false, allowAnonymous = false }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Si permite acceso anónimo, no redirigir por falta de usuario
            if (!user && !allowAnonymous) {
                router.push('/auth/login');
                return;
            }

            // Solo aplicar validaciones de firstTime si el usuario está autenticado
            if (user) {
                if (requiresFirstTime && !user.firstTime) {
                    router.push('/home');
                    return;
                }

                if (!requiresFirstTime && user.firstTime) {
                    router.push('/survey');
                    return;
                }
            }
        }
    }, [user, isLoading, router, requiresFirstTime, allowAnonymous]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Si permite acceso anónimo, mostrar contenido incluso sin usuario
    if (!user && !allowAnonymous) {
        return null;
    }

    // Si requiere firstTime pero el usuario no lo cumple (y está autenticado)
    if (user && requiresFirstTime && !user.firstTime) {
        return null;
    }

    // Si no requiere firstTime pero el usuario sí tiene firstTime (y está autenticado)
    if (user && !requiresFirstTime && user.firstTime) {
        return null;
    }

    return children;
} 