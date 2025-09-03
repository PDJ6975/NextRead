import apiClient from '../lib/apiClient';

const bookService = {
    searchBooks: (query) => apiClient.get(`/books/search?title=${encodeURIComponent(query)}`),
    searchForSurvey: (query) => apiClient.get(`/books/search/survey?title=${encodeURIComponent(query)}`),
    getUserBooks: () => apiClient.get('/userbooks'),
    addBook: (bookData) => apiClient.post('/userbooks', bookData),
    updateBook: (id, bookData) => apiClient.put(`/userbooks/${id}`, bookData),
    deleteBook: (id) => apiClient.delete(`/userbooks/${id}`),
    /**
     * Obtiene los detalles de un libro por su ID
     * @param {number} id - ID del libro
     * @returns {Promise<Object>} Book
     */
    async getBook(id) {
        try {
            const response = await apiClient.get(`/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener detalles del libro:', error);
            throw error;
        }
    }
};

export { bookService };