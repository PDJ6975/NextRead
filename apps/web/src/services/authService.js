import apiClient from '../lib/apiClient';

export const authService = {
    register: (userData) => apiClient.post('/auth/signup', userData),
    verify: (verificationData) => apiClient.post('/auth/verify', verificationData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    resendCode: (email) => apiClient.post('/auth/resend', { email }),
}; 