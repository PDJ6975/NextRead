'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayoutCozy({ children }) {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Evitar hydration issues
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-white to-cozy-mint/30 relative">
            {/* Textura de fondo */}
            <div className="absolute inset-0 cozy-texture-paper opacity-20 pointer-events-none" />
            
            {/* Container principal con márgenes*/}
            <div className="relative min-h-screen">
                <main className="flex-1 flex flex-col">
                    {/* Wrapper */}
                    <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
