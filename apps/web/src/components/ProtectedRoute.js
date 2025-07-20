'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiresFirstTime = false }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/auth/login');
                return;
            }

            if (requiresFirstTime && !user.firstTime) {
                router.push('/home');
                return;
            }

            if (!requiresFirstTime && user.firstTime) {
                router.push('/survey');
                return;
            }
        }
    }, [user, isLoading, router, requiresFirstTime]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (requiresFirstTime && !user.firstTime) {
        return null;
    }

    if (!requiresFirstTime && user.firstTime) {
        return null;
    }

    return children;
} 