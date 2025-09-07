'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import userProfileService from '../services/userProfileService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar token al cargar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verificar token y obtener usuario
            verifyToken(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Obtener nickname, avatarUrl y firstTime del backend
            const profile = await userProfileService.getProfile();
            setUser({
                id: payload.sub,
                email: payload.email,
                nickname: profile.nickname,
                avatarUrl: profile.avatarUrl,
                // Usar el valor real de firstTime del backend si existe, si no, fallback al del token
                firstTime: typeof profile.firstTime !== 'undefined' ? profile.firstTime : (payload.firstTime !== false)
            });
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, firstTime } = response.data;
            localStorage.setItem('token', token);
            await verifyToken(token);
            return { firstTime };
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const verify = async (verificationData) => {
        try {
            const response = await authService.verify(verificationData);
            
            // Si el backend devuelve un token tras la verificación, hacer login automático
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                await verifyToken(response.data.token);
                return { 
                    autoLogin: true, 
                    firstTime: response.data.firstTime 
                };
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = (updates) => {
        setUser(prev => ({
            ...prev,
            ...updates
        }));
    };

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await verifyToken(token);
            }
        } catch (error) {
            console.error('Error al refrescar usuario:', error);
        }
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        verify,
        logout,
        updateUser,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}; 