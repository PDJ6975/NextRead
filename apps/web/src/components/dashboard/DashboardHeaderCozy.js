'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileEditModalCozy from '../profile/ProfileEditModalCozy';
import { useAuth } from '../../contexts/AuthContext';
import userProfileService from '../../services/userProfileService';
import { ChevronDown, User, Settings, LogOut, Bell, BookOpen, Home, Sparkles } from 'lucide-react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import IconCozy, { BookCozyIcon, HeartCozyIcon, MagicCozyIcon } from '../ui/cozy/IconCozy';

export default function DashboardHeaderCozy({ user, onLogout }) {
    const { refreshUser } = useAuth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        const name = user?.fullName || user?.email?.split('@')[0] || 'Lector';

        let emoji = '🌅';
        let greeting = '';

        if (hour < 6) {
            emoji = '🌙';
            greeting = `¡Buenas noches, ${name}!`;
        } else if (hour < 12) {
            emoji = '🌅';
            greeting = `¡Buenos días, ${name}!`;
        } else if (hour < 18) {
            emoji = '☀️';
            greeting = `¡Buenas tardes, ${name}!`;
        } else {
            emoji = '🌇';
            greeting = `¡Buenas noches, ${name}!`;
        }

        return { greeting, emoji };
    };

    const getInitials = () => {
        if (user?.nickname) {
            return user.nickname
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }
        return user?.email?.[0]?.toUpperCase() || 'L';
    };

    // Renderiza el avatar cozy con marco decorativo
    const renderAvatar = (size = 12) => {
        if (!user) {
            return (
                <div className={`w-${size} h-${size} relative group cursor-pointer`}>
                    {/* Marco decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cozy-sage/20 to-cozy-terracotta/20 rounded-full p-0.5">
                        <div className="w-full h-full bg-cozy-light-gray text-cozy-dark-gray rounded-full flex items-center justify-center border-2 border-white/80 shadow-md">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                    {/* Brillo sutil */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            );
        }
        
        return (
            <div className={`w-${size} h-${size} relative group cursor-pointer`}>
                {/* Marco decorativo con gradiente cozy */}
                <div className="absolute inset-0 bg-gradient-to-br from-cozy-terracotta/30 via-cozy-sage/30 to-cozy-lavender/30 rounded-full p-0.5 shadow-lg">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover border-2 border-white/90"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cozy-sage to-cozy-terracotta text-white rounded-full flex items-center justify-center text-sm font-medium border-2 border-white/90 shadow-inner font-cozy">
                            {getInitials()}
                        </div>
                    )}
                </div>
                
                {/* Brillo mágico al hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Pequeña decoración de estado "en línea" */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-cozy-sage border-2 border-white rounded-full shadow-sm" />
            </div>
        );
    };

    const { greeting, emoji } = getGreeting();

    return (
        <>
            {/* Header principal con diseño cozy */}
            <header className="relative bg-white/80 backdrop-blur-md border-b-2 border-cozy-sage/20 shadow-lg">
                {/* Textura sutil de fondo */}
                <div className="absolute inset-0 cozy-texture-linen opacity-30" />
                
                <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-4">
                    <div className="flex items-center justify-between">
                        
                        {/* Logo y título cozy */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => router.push('/home')}>
                                {/* Logo NextRead cozy */}
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-cozy-terracotta to-cozy-sage rounded-lg p-2 shadow-md group-hover:shadow-lg transition-all duration-300 cozy-animate-float">
                                        <BookCozyIcon className="w-full h-full text-white" />
                                    </div>
                                </div>
                                
                                {/* Título con tipografía cozy */}
                                <div>
                                    <h1 className="text-2xl font-bold font-cozy-display text-cozy-warm-brown group-hover:text-cozy-terracotta transition-colors duration-300">
                                        NextRead
                                    </h1>
                                    <p className="text-xs text-cozy-medium-gray font-cozy">Tu pequeña biblioteca personal</p>
                                </div>
                            </div>
                        </div>

                        {/* Área central con saludo personalizado */}
                        <div className="hidden md:flex items-center space-x-2 bg-cozy-cream/60 px-4 py-2 rounded-full border border-cozy-sage/20 shadow-sm">
                            <span className="text-lg">{emoji}</span>
                            <span className="text-cozy-warm-brown font-medium font-cozy">{greeting}</span>
                            <HeartCozyIcon className="w-4 h-4 text-cozy-terracotta/70" />
                        </div>

                        {/* Área de usuario */}
                        <div className="flex items-center space-x-4">
                            
                            {/* Botón de notificaciones cozy */}
                            <div className="relative">
                                <ButtonCozy
                                    variant="ghost"
                                    size="sm"
                                    className="relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    {/* Badge de notificación */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cozy-terracotta rounded-full border border-white shadow-sm" />
                                </ButtonCozy>
                            </div>

                            {/* Dropdown de usuario */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-3 hover:bg-cozy-sage/10 rounded-full p-2 transition-all duration-300 group"
                                >
                                    {renderAvatar()}
                                    
                                    {user && (
                                        <>
                                            <div className="hidden lg:block text-left">
                                                <p className="text-sm font-medium text-cozy-warm-brown font-cozy">
                                                    {user?.nickname || user?.email?.split('@')[0] || 'Usuario'}
                                                </p>
                                                <p className="text-xs text-cozy-medium-gray">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-cozy-medium-gray transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {/* Dropdown menu cozy */}
                                {dropdownOpen && user && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-cozy-sage/20 py-2 z-[100] cozy-texture-linen">
                                        {/* Opciones del menú */}
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    setProfileModalOpen(true);
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-cozy-dark-gray hover:bg-cozy-sage/10 transition-colors font-cozy"
                                            >
                                                <Settings className="w-4 h-4 text-cozy-sage" />
                                                <span>Mi Perfil</span>
                                            </button>
                                        </div>

                                        {/* Separador */}
                                        <div className="border-t border-cozy-sage/10 my-2" />

                                        {/* Logout */}
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                onLogout();
                                            }}
                                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-cozy-terracotta hover:bg-cozy-terracotta/10 transition-colors font-cozy"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Borde decorativo inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cozy-sage/30 to-transparent" />
            </header>

            {/* Modal de edición de perfil */}
            {profileModalOpen && (
                <ProfileEditModalCozy
                    isOpen={profileModalOpen}
                    onClose={() => setProfileModalOpen(false)}
                    user={user}
                    onSave={async (data) => {
                        if (data.fullName && data.fullName !== user.nickname) {
                            await userProfileService.updateNickname(data.fullName);
                        }
                        if (data.avatar && data.avatar !== user.avatarUrl) {
                            await userProfileService.updateAvatar(data.avatar);
                        }
                        await refreshUser();
                        setProfileModalOpen(false);
                    }}
                />
            )}
        </>
    );
}
