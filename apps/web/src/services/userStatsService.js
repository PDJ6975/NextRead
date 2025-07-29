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

            // Obtener páginas de cada libro leído
            const booksRead = userBooks.filter(ub => ub.status === 'READ');
            let pagesRead = 0;
            // Peticiones paralelas para obtener los datos de cada libro
            const bookDetails = await Promise.all(
                booksRead.map(async (ub) => {
                    try {
                        const res = await apiClient.get(`/books/${ub.bookId}`);
                        return res.data;
                    } catch (e) {
                        return null;
                    }
                })
            );
            bookDetails.forEach(book => {
                if (book && book.pages) {
                    pagesRead += book.pages;
                }
            });

            // Calcular el resto de estadísticas normalmente
            const stats = this.calculateStats(userBooks);
            stats.pagesRead = pagesRead;
            return stats;
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
            switch (userBook.status) {
                case 'READ':
                    stats.booksRead++;
                    if (userBook.book?.pages) {
                        stats.pagesRead += userBook.book.pages;
                    }
                    break;
                case 'TO_READ':
                    stats.booksWantToRead++;
                    break;
                case 'ABANDONED':
                    stats.booksAbandoned++;
                    break;
            }
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