import apiClient from '../lib/apiClient';

/**
 * Servicio para manejar los libros del usuario
 */
class UserBookService {
    /**
     * Obtiene todos los libros del usuario
     * @returns {Promise<Array>} Lista de UserBookDTO
     */
    async getUserBooks() {
        try {
            const response = await apiClient.get('/userbooks');
            return response.data;
        } catch (error) {
            console.error('Error al obtener libros del usuario:', error);
            throw error;
        }
    }

    /**
     * Añade un libro a la biblioteca del usuario
     * @param {Object} bookData - Datos del libro
     * @param {Object} userBookData - Datos de la relación usuario-libro (rating, status, etc.)
     * @returns {Promise<Object>} UserBookDTO creado
     */
    async addBook(bookData, userBookData) {
        try {
            // El backend espera el formato AddBookRequestDTO
            const requestData = {
                book: bookData,
                userBookDTO: userBookData
            };

            const response = await apiClient.post('/userbooks', requestData);
            return response.data;
        } catch (error) {
            console.error('Error al añadir libro:', error);
            throw error;
        }
    }

    /**
     * Actualiza un libro del usuario
     * @param {number} id - ID del UserBook
     * @param {Object} userBookData - Datos a actualizar
     * @returns {Promise<Object>} UserBookDTO actualizado
     */
    async updateBook(id, userBookData) {
        try {
            const response = await apiClient.put(`/userbooks/${id}`, userBookData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            throw error;
        }
    }

    /**
     * Elimina un libro de la biblioteca del usuario
     * @param {number} id - ID del UserBook
     * @returns {Promise<string>} Mensaje de confirmación
     */
    async deleteBook(id) {
        try {
            const response = await apiClient.delete(`/userbooks/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            throw error;
        }
    }

    /**
     * Obtiene un libro específico del usuario
     * @param {number} id - ID del UserBook
     * @returns {Promise<Object>} UserBookDTO
     */
    async getUserBook(id) {
        try {
            const response = await apiClient.get(`/userbooks/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener libro del usuario:', error);
            throw error;
        }
    }
}

const userBookService = new UserBookService();
export default userBookService; 