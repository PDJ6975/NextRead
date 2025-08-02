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
        <div className="min-h-screen relative overflow-hidden">
            {/* Fondo ambiente cozy con gradiente y texturas */}
            <div className="fixed inset-0 -z-10">
                {/* Gradiente base cozy */}
                <div className="absolute inset-0 bg-gradient-to-br from-cozy-cream via-cozy-white to-cozy-mint/30" />
                
                {/* Textura de papel sutil */}
                <div className="absolute inset-0 opacity-20 cozy-texture-linen" />
                
                {/* Overlay de textura vintage */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-cozy-sage/5 via-transparent to-cozy-terracotta/5" />
            </div>

            {/* Elementos decorativos flotantes */}
            <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
                {/* Hojas flotantes */}
                <div className="absolute top-20 left-10 w-4 h-4 text-cozy-sage/20 cozy-animate-float" style={{ animationDelay: '0s' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.15 0-.29.04-.42.11-.87.31-1.8.47-2.7.47-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.48-.41 2.86-1.12 4.06-.71 1.19-1.88 1.94-3.38 1.94-.79 0-1.5-.71-1.5-1.5V9c0-.83-.67-1.5-1.5-1.5S11 8.17 11 9v6.5c0 1.93 1.57 3.5 3.5 3.5 2.45 0 4.35-1.26 5.49-2.95C21.18 14.64 22 12.89 22 12c0-5.52-4.48-10-10-10z"/>
                    </svg>
                </div>
                
                <div className="absolute top-40 right-20 w-3 h-3 text-cozy-terracotta/15 cozy-animate-float" style={{ animationDelay: '2s' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>

                <div className="absolute bottom-32 left-16 w-5 h-5 text-cozy-lavender/20 cozy-animate-float" style={{ animationDelay: '4s' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6z"/>
                        <path d="M13 2v6h6l-6-6z" opacity="0.5"/>
                    </svg>
                </div>

                {/* Partículas sutiles */}
                <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cozy-sage/30 rounded-full cozy-animate-sparkle" style={{ animationDelay: '1s' }} />
                <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-cozy-terracotta/25 rounded-full cozy-animate-sparkle" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-1/4 left-2/3 w-0.5 h-0.5 bg-cozy-lavender/40 rounded-full cozy-animate-sparkle" style={{ animationDelay: '5s' }} />
            </div>

            {/* Plantas decorativas en las esquinas */}
            <div className="fixed bottom-0 left-0 pointer-events-none -z-5">
                <div className="w-24 h-32 opacity-15 text-cozy-forest">
                    <svg viewBox="0 0 100 120" fill="currentColor" className="w-full h-full">
                        {/* Maceta */}
                        <ellipse cx="50" cy="110" rx="20" ry="8" opacity="0.8"/>
                        <path d="M30 110 L35 95 L65 95 L70 110 Z" opacity="0.7"/>
                        
                        {/* Tallo */}
                        <rect x="48" y="60" width="4" height="35" rx="2" opacity="0.6"/>
                        
                        {/* Hojas */}
                        <ellipse cx="35" cy="70" rx="12" ry="8" transform="rotate(-20 35 70)" opacity="0.8"/>
                        <ellipse cx="65" cy="65" rx="10" ry="6" transform="rotate(30 65 65)" opacity="0.7"/>
                        <ellipse cx="40" cy="50" rx="8" ry="5" transform="rotate(-45 40 50)" opacity="0.6"/>
                        <ellipse cx="60" cy="55" rx="9" ry="6" transform="rotate(15 60 55)" opacity="0.8"/>
                    </svg>
                </div>
            </div>

            <div className="fixed bottom-0 right-0 pointer-events-none -z-5">
                <div className="w-20 h-28 opacity-12 text-cozy-sage">
                    <svg viewBox="0 0 80 100" fill="currentColor" className="w-full h-full">
                        {/* Maceta pequeña */}
                        <ellipse cx="40" cy="90" rx="15" ry="6" opacity="0.8"/>
                        <path d="M25 90 L28 78 L52 78 L55 90 Z" opacity="0.7"/>
                        
                        {/* Planta pequeña */}
                        <path d="M40 78 Q35 60 30 45 Q40 50 40 78" opacity="0.6"/>
                        <path d="M40 78 Q45 55 50 40 Q40 48 40 78" opacity="0.7"/>
                        <circle cx="32" cy="48" r="3" opacity="0.5"/>
                        <circle cx="48" cy="43" r="2.5" opacity="0.6"/>
                    </svg>
                </div>
            </div>

            {/* Container principal con márgenes orgánicos */}
            <div className="relative min-h-screen">
                <main className="flex-1 flex flex-col">
                    {/* Wrapper con padding orgánico y asimétrico */}
                    <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Overlay sutil para profundidad */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent via-transparent to-cozy-sage/5" />
        </div>
    );
}
