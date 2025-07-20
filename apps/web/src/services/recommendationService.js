import apiClient from '../lib/apiClient';

export const recommendationService = {
    generate: () => apiClient.post('/recommendations/generate'),
    getRecommendations: () => apiClient.get('/recommendations'),
    save: (recommendation) => apiClient.post('/recommendations', recommendation),
    delete: (id) => apiClient.delete(`/recommendations/${id}`),
}; 