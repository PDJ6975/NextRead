import apiClient from '../lib/apiClient';

/**
 * Servicio para calcular estadísticas del usuario
 */
class UserStatsService {
    /**
     * Obtiene estadísticas calculadas del usuario basadas en sus libros
     * @returns {Promise<Object>} Estadísticas del usuario
     */
    async getUserStats() {
        try {
            // Obtener todos los libros del usuario
            const response = await apiClient.get('/userbooks');
            const userBooks = response.data;

            return this.calculateStats(userBooks);
        } catch (error) {
            console.error('Error al obtener estadísticas del usuario:', error);

            // Si hay error, devolver estadísticas por defecto
            return this.getDefaultStats();
        }
    }

    /**
     * Calcula estadísticas basadas en los libros del usuario
     * @param {Array} userBooks - Lista de libros del usuario
     * @returns {Object} Estadísticas calculadas
     */
    calculateStats(userBooks) {
        const stats = {
            booksRead: 0,
            booksReading: 0,
            booksWantToRead: 0,
            booksAbandoned: 0,
            pagesRead: 0,
            averageRating: 0,
            totalBooks: userBooks.length
        };

        let totalRating = 0;
        let booksWithRating = 0;

        userBooks.forEach(userBook => {
            // Contar por estado
            switch (userBook.status) {
                case 'READ':
                case 'READ_COMPLETELY':
                    stats.booksRead++;
                    // Solo contar páginas de libros completamente leídos
                    if (userBook.book?.pages) {
                        stats.pagesRead += userBook.book.pages;
                    }
                    break;
                case 'reading':
                case 'READING':
                    stats.booksReading++;
                    break;
                case 'want_to_read':
                case 'WANT_TO_READ':
                case 'TO_READ':
                    stats.booksWantToRead++;
                    break;
                case 'abandoned':
                case 'ABANDONED':
                    stats.booksAbandoned++;
                    break;
            }

            // Calcular rating promedio
            if (userBook.rating && userBook.rating > 0) {
                totalRating += userBook.rating;
                booksWithRating++;
            }
        });

        // Calcular rating promedio
        if (booksWithRating > 0) {
            stats.averageRating = (totalRating / booksWithRating).toFixed(1);
        }

        return stats;
    }

    /**
     * Estadísticas por defecto cuando no hay datos o hay error
     * @returns {Object} Estadísticas por defecto
     */
    getDefaultStats() {
        return {
            booksRead: 0,
            booksReading: 0,
            booksWantToRead: 0,
            booksAbandoned: 0,
            pagesRead: 0,
            averageRating: 0,
            totalBooks: 0
        };
    }

    /**
     * Obtiene estadísticas mock para desarrollo
     * @returns {Object} Estadísticas mock realistas
     */
    getMockStats() {
        return {
            booksRead: Math.floor(Math.random() * 50) + 10,
            booksReading: Math.floor(Math.random() * 5) + 1,
            booksWantToRead: Math.floor(Math.random() * 20) + 5,
            booksAbandoned: Math.floor(Math.random() * 8) + 2,
            pagesRead: Math.floor(Math.random() * 5000) + 1000,
            averageRating: (Math.random() * 2 + 3).toFixed(1),
            totalBooks: 0
        };
    }

    /**
     * Simula delay de API para testing
     * @param {number} ms - Milisegundos de delay
     * @returns {Promise}
     */
    async simulateDelay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const userStatsService = new UserStatsService();
export default userStatsService; 