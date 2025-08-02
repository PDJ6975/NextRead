'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileEditModal from '../profile/ProfileEditModal';
import { useAuth } from '../../contexts/AuthContext';
import userProfileService from '../../services/userProfileService';
import { ChevronDown, User, Settings, LogOut, Bell } from 'lucide-react';
import { Button } from '../ui/Button';

export default function DashboardHeader({ user, onLogout }) {
    const { refreshUser } = useAuth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
        const name = user?.fullName || user?.email?.split('@')[0] || 'Usuario';

        if (hour < 12) {
            return `¡Buenos días, ${name}!`;
        } else if (hour < 18) {
            return `¡Buenas tardes, ${name}!`;
        } else {
            return `¡Buenas noches, ${name}!`;
        }
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
        return user?.email?.[0]?.toUpperCase() || 'U';
    };

    // Renderiza el avatar real si existe, si no las iniciales
    const renderAvatar = (size = 8) => {
        if (!user) {
            // Usuario anónimo - mostrar avatar por defecto
            return (
                <div className={`w-${size} h-${size} bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium`}>
                    <User className="w-4 h-4" />
                </div>
            );
        }
        
        if (user?.avatarUrl) {
            return (
                <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className={`w-${size} h-${size} rounded-full object-cover border border-gray-200 bg-white`}
                />
            );
        }
        return (
            <div className={`w-${size} h-${size} bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium`}>
                {getInitials()}
            </div>
        );
    };

    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const dropdownItems = [
        {
            id: 'profile',
            label: 'Mi Perfil',
            icon: User,
            action: () => {
                setProfileModalOpen(true);
                setDropdownOpen(false);
            }
        },
        {
            id: 'divider',
            type: 'divider'
        },
        {
            id: 'logout',
            label: 'Cerrar Sesión',
            icon: LogOut,
            action: () => {
                onLogout();
                setDropdownOpen(false);
            },
            danger: true
        }
    ];

    return (
        <>
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <h1 className="text-xl font-bold text-indigo-600 whitespace-nowrap">NextRead</h1>
                    
                    {/* Acciones del header */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            /* Usuario autenticado - Mostrar dropdown */
                            <div className="relative" ref={dropdownRef}>
                                <Button
                                    variant="ghost"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg"
                                >
                                    {/* Avatar real o iniciales */}
                                    {renderAvatar(8)}
                                    {/* Información del usuario */}
                                    <div className="hidden sm:block text-left">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                            {user?.nickname || user?.email?.split('@')[0] || 'Usuario'}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate max-w-32">
                                            {user?.email}
                                        </div>
                                    </div>
                                    {/* Chevron */}
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </Button>
                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        {/* Header del dropdown */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                {renderAvatar(10)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {user?.nickname || 'Usuario'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Items del dropdown */}
                                        <div className="py-1">
                                            {dropdownItems.map((item) => {
                                                if (item.type === 'divider') {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="h-px bg-gray-100 mx-2 my-1"
                                                        />
                                                    );
                                                }
                                                const Icon = item.icon;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={item.action}
                                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-3 transition-colors ${item.danger
                                                            ? 'text-red-600 hover:bg-red-50'
                                                            : 'text-gray-700'
                                                            }`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                        <span>{item.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Usuario anónimo - Mostrar botones de login/registro */
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push('/auth/login')}
                                    className="text-sm"
                                >
                                    Iniciar Sesión
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => router.push('/auth/register')}
                                    className="text-sm"
                                >
                                    Registrarse
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal de edición de perfil - Solo mostrar si hay usuario */}
            {user && (
                <ProfileEditModal
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