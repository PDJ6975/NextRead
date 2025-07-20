import apiClient from '../lib/apiClient';

export const genreService = {
    getAllGenres: () => apiClient.get('/genres'),
}; 