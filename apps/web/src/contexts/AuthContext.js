'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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
            // Aquí podrías hacer una llamada al backend para verificar el token
            // Por ahora, simplemente decodificamos el token para obtener info básica
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
                id: payload.sub,
                email: payload.email,
                userName: payload.userName,
                firstTime: payload.firstTime || false
            });
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, firstTime } = response.data;

            localStorage.setItem('token', token);

            // Crear objeto usuario con la información necesaria
            const userData = { firstTime };
            setUser(userData);

            return userData;
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
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        verify,
        logout
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