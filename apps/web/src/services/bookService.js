import apiClient from '../lib/apiClient';

export const bookService = {
    searchBooks: (query) => apiClient.get(`/books/search/basic?title=${encodeURIComponent(query)}`),
    searchForSurvey: (query) => apiClient.get(`/books/search/survey?title=${encodeURIComponent(query)}`),
    getUserBooks: () => apiClient.get('/userbooks'),
    addBook: (bookData) => apiClient.post('/userbooks/add', bookData),
    updateBook: (id, bookData) => apiClient.put(`/userbooks/${id}`, bookData),
    deleteBook: (id) => apiClient.delete(`/userbooks/${id}`),
}; 