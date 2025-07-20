import apiClient from '../lib/apiClient';

export const userBookService = {
    getUserBooks: () => apiClient.get('/userbooks'),
    addBook: (bookData) => apiClient.post('/userbooks', bookData),
    updateBook: (id, bookData) => apiClient.put(`/userbooks/${id}`, bookData),
    deleteBook: (id) => apiClient.delete(`/userbooks/${id}`),
}; 