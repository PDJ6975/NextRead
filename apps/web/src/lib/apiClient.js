import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor para añadir el token JWT
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Solo redireccionar si NO estamos ya en páginas de autenticación
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath.startsWith('/auth/');
            
            localStorage.removeItem('token');
            
            // Solo redireccionar si no estamos en una página de auth
            if (!isAuthPage) {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient; 