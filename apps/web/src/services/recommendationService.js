import apiClient from '../lib/apiClient';

/**
 * Servicio para manejar recomendaciones de libros
 */
class RecommendationService {
    /**
     * Obtiene las recomendaciones guardadas del usuario
     * @returns {Promise<Array>} Lista de recomendaciones guardadas
     */
    async getRecommendations() {
        try {
            const response = await apiClient.get('/recommendations');

            // Las recomendaciones del backend incluyen el libro completo
            const transformedData = this.transformRecommendationsToBooks(response.data);
            return transformedData;
        } catch (error) {
            console.error('💥 [Frontend] Error al obtener recomendaciones:', error);

            // Si no hay recomendaciones o hay error, devolver array vacío
            if (error.response?.status === 404 || error.response?.status === 500) {
                return [];
            }

            throw error;
        }
    }

    /**
     * Genera nuevas recomendaciones usando ChatGPT
     * Las recomendaciones se guardan automáticamente en el backend
     * @returns {Promise<Array>} Lista de nuevas recomendaciones generadas y guardadas
     */
    async generateNewRecommendations() {
        console.log('🚀 [Frontend] Iniciando generateNewRecommendations...');

        try {
            console.log('🌐 [Frontend] Realizando POST a /recommendations/generate');
            console.log('🌐 [Frontend] Headers que se enviarán:', {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ? 'Bearer [TOKEN_PRESENT]' : 'NO_TOKEN'
            });

            const response = await apiClient.post('/recommendations/generate');

            console.log('✅ [Frontend] Respuesta recibida del backend:');
            console.log('📊 [Frontend] Status:', response.status);
            console.log('📊 [Frontend] Headers:', response.headers);
            console.log('📊 [Frontend] Data type:', typeof response.data);
            console.log('📊 [Frontend] Data is array:', Array.isArray(response.data));
            console.log('📊 [Frontend] Data content:', response.data);

            // Verificar que la respuesta sea válida
            if (!response.data) {
                console.error('❌ [Frontend] Respuesta vacía del servidor');
                throw new Error('Respuesta vacía del servidor');
            }

            // Verificar que sea un array
            if (!Array.isArray(response.data)) {
                console.error('❌ [Frontend] Respuesta del backend no es un array:', response.data);
                throw new Error('Formato de respuesta inválido del servidor');
            }

            console.log('🔄 [Frontend] Transformando recomendaciones...');
            // Las recomendaciones generadas solo tienen title y reason
            const transformedData = this.transformGeneratedRecommendations(response.data);
            console.log('✅ [Frontend] Recomendaciones transformadas:', transformedData);

            return transformedData;
        } catch (error) {
            console.error('💥 [Frontend] Error al generar nuevas recomendaciones:', error);

            // Log del error específico para debugging
            if (error.response) {
                console.error('📊 [Frontend] Error response status:', error.response.status);
                console.error('📊 [Frontend] Error response headers:', error.response.headers);
                console.error('📊 [Frontend] Error response data:', error.response.data);
            } else if (error.request) {
                console.error('📊 [Frontend] Error request:', error.request);
            } else {
                console.error('📊 [Frontend] Error message:', error.message);
            }

            // Manejar errores específicos del backend
            if (error.response?.status === 400) {
                // Error de validación o usuario no completó encuesta
                throw new Error('Debes completar la encuesta antes de generar recomendaciones');
            } else if (error.response?.status === 500) {
                // Error interno del servidor (probablemente API key de OpenAI)
                throw new Error('Error interno del servidor. El servicio de recomendaciones no está disponible temporalmente');
            } else if (error.response?.status === 404) {
                // Endpoint no encontrado
                throw new Error('Servicio de recomendaciones no disponible');
            } else if (error.message?.includes('API key de OpenAI no configurada')) {
                throw new Error('Servicio de recomendaciones no configurado correctamente');
            } else if (error.message?.includes('Se debe completar la encuesta')) {
                throw new Error('Debes completar la encuesta antes de generar recomendaciones');
            }

            // Re-throw el error original para otros casos
            throw error;
        }
    }

    /**
     * Transforma las recomendaciones del backend a formato de libros para el frontend
     * @param {Array} recommendations - Recomendaciones del backend
     * @returns {Array} Array de libros transformados
     */
    transformRecommendationsToBooks(recommendations) {
        if (!Array.isArray(recommendations)) {
            return [];
        }

        return recommendations.map(rec => ({
            id: rec.recommendedBook?.id,
            title: rec.recommendedBook?.title,
            authors: rec.recommendedBook?.authors || [],
            isbn10: rec.recommendedBook?.isbn10,
            isbn13: rec.recommendedBook?.isbn13,
            publisher: rec.recommendedBook?.publisher,
            publishedYear: rec.recommendedBook?.publishedYear,
            pages: rec.recommendedBook?.pages,
            coverUrl: rec.recommendedBook?.coverUrl,
            synopsis: rec.recommendedBook?.synopsis,
            reason: rec.reason,
            recommendationId: rec.id, // Para poder eliminarla después
            createdAt: rec.createdAt
        }));
    }

    /**
     * Transforma las recomendaciones generadas a formato de libros
     * @param {Array} generatedRecs - Recomendaciones generadas por ChatGPT (enriquecidas por el backend)
     * @returns {Array} Array de libros transformados
     */
    transformGeneratedRecommendations(generatedRecs) {
        // Validación defensiva
        if (!Array.isArray(generatedRecs)) {
            console.warn('transformGeneratedRecommendations: input no es array, devolviendo array vacío');
            return [];
        }

        return generatedRecs
            .filter(rec => rec && rec.title && rec.reason) // Filtrar elementos inválidos
            .map((rec, index) => {
                console.log(`🔄 [Frontend] Transformando recomendación ${index + 1}:`, rec);

                // Si la recomendación fue enriquecida, usar los datos del backend
                if (rec.enriched && rec.coverUrl) {
                    return {
                        id: rec.bookId || `generated-${index}-${Date.now()}`,
                        title: rec.title,
                        authors: rec.authors || [{ name: 'Autor desconocido' }],
                        isbn10: rec.isbn10,
                        isbn13: rec.isbn13,
                        publisher: rec.publisher || 'Editorial desconocida',
                        publishedYear: rec.publishedYear || 'Año desconocido',
                        pages: rec.pages || 0,
                        coverUrl: rec.coverUrl,
                        synopsis: rec.synopsis || rec.reason,
                        reason: rec.reason,
                        isGenerated: !rec.bookId, // Si no tiene bookId, es generada
                        isEnriched: rec.enriched
                    };
                } else {
                    // Si no fue enriquecida, usar datos por defecto
                    return {
                        id: `generated-${index}-${Date.now()}`,
                        title: rec.title,
                        authors: [{ name: 'Autor desconocido' }],
                        isbn13: null,
                        publisher: 'Editorial desconocida',
                        publishedYear: 'Año desconocido',
                        pages: Math.floor(Math.random() * 400) + 200,
                        coverUrl: null, // Sin cover, el frontend mostrará placeholder
                        synopsis: rec.reason,
                        reason: rec.reason,
                        isGenerated: true,
                        isEnriched: false
                    };
                }
            });
    }

    /**
     * Datos mock para desarrollo y testing cuando las APIs fallan
     * @param {number} limit - Número de recomendaciones mock
     * @returns {Array} Lista de libros mock
     */
    getMockRecommendations(limit = 6) {
        const mockBooks = [
            {
                id: 'mock-1',
                title: 'El nombre del viento',
                authors: [{ name: 'Patrick Rothfuss' }],
                isbn13: '9788401352836',
                isbn10: '8401352835',
                publisher: 'Plaza & Janés',
                publishedYear: '2007',
                pages: 872,
                coverUrl: 'https://images.isbndb.com/covers/28/36/9788401352836.jpg',
                synopsis: 'Kvothe, conocido como Rompevientos, es una figura legendaria cuyas hazañas son famosas en todo el reino. Ahora se esconde bajo el nombre de Kote, el propietario de la posada Roca de Guía, y ha dejado atrás su vida de aventuras. Pero su historia debe contarse...',
                averageRating: 4.5,
                ratingsCount: 15420,
                genres: ['Fantasía', 'Aventura'],
                reason: 'Basado en tu gusto por la fantasía épica'
            },
            {
                id: 'mock-2',
                title: 'Klara y el Sol',
                authors: [{ name: 'Kazuo Ishiguro' }],
                isbn13: '9788433980304',
                isbn10: '8433980300',
                publisher: 'Anagrama',
                publishedYear: '2021',
                pages: 352,
                coverUrl: 'https://images.isbndb.com/covers/03/04/9788433980304.jpg',
                synopsis: 'Klara es una Amiga Artificial extraordinariamente observadora, que desde su lugar en la tienda vigila atentamente el comportamiento de quienes entran a curiosear y de quienes pasan por la calle.',
                averageRating: 4.2,
                ratingsCount: 8930,
                genres: ['Ciencia ficción', 'Drama'],
                reason: 'Por tu interés en narrativas introspectivas'
            },
            {
                id: 'mock-3',
                title: 'Los siete maridos de Evelyn Hugo',
                authors: [{ name: 'Taylor Jenkins Reid' }],
                isbn13: '9788466664882',
                isbn10: '8466664882',
                publisher: 'B de Books',
                publishedYear: '2019',
                pages: 400,
                coverUrl: 'https://images.isbndb.com/covers/48/82/9788466664882.jpg',
                synopsis: 'La reclusa Evelyn Hugo, de ochenta y cinco años, decide por fin contar la verdad sobre su glamurosa y escandalosa vida. Pero cuando elige a la desconocida periodista Monique Grant para que escriba su biografía, nadie entiende por qué.',
                averageRating: 4.6,
                ratingsCount: 12750,
                genres: ['Romance', 'Drama', 'Ficción histórica'],
                reason: 'Perfecto para tu gusto por dramas emotivos'
            },
            {
                id: 'mock-4',
                title: 'Proyecto Hail Mary',
                authors: [{ name: 'Andy Weir' }],
                isbn13: '9788466671187',
                isbn10: '8466671187',
                publisher: 'B de Books',
                publishedYear: '2021',
                pages: 512,
                coverUrl: 'https://images.isbndb.com/covers/11/87/9788466671187.jpg',
                synopsis: 'Ryland Grace se despierta en una nave espacial sin recordar cómo llegó allí. Sus compañeros de tripulación están muertos. Solo en el espacio, debe resolver un misterio imposible: ¿por qué está aquí? ¿Qué pasó con la tripulación? ¿Y qué es esa sustancia que cubre el casco de la nave?',
                averageRating: 4.7,
                ratingsCount: 9840,
                genres: ['Ciencia ficción', 'Aventura', 'Misterio'],
                reason: 'Te encantará por tu amor a los misterios científicos'
            },
            {
                id: 'mock-5',
                title: 'La canción de Aquiles',
                authors: [{ name: 'Madeline Miller' }],
                isbn13: '9788417511838',
                isbn10: '8417511830',
                publisher: 'AdN Alianza de Novelas',
                publishedYear: '2019',
                pages: 416,
                coverUrl: 'https://images.isbndb.com/covers/18/38/9788417511838.jpg',
                synopsis: 'Grecia, en la era de los héroes. Patroclo, un joven príncipe torpe e inadaptado, es exiliado a la corte del rey Peleo, donde conoce a Aquiles, el hijo dorado del rey. A pesar de sus diferencias, los dos jóvenes desarrollan una conexión que se convertirá en la amistad más intensa de sus vidas.',
                averageRating: 4.4,
                ratingsCount: 7650,
                genres: ['Ficción histórica', 'Romance', 'Mitología'],
                reason: 'Ideal por tu interés en mitología clásica'
            },
            {
                id: 'mock-6',
                title: 'Circe',
                authors: [{ name: 'Madeline Miller' }],
                isbn13: '9788417511845',
                isbn10: '8417511847',
                publisher: 'AdN Alianza de Novelas',
                publishedYear: '2020',
                pages: 480,
                coverUrl: 'https://images.isbndb.com/covers/18/45/9788417511845.jpg',
                synopsis: 'En la casa de Helios, dios del sol y más poderoso de los titanes, nace una niña. Circe es una extraña criatura, pero no es poderosa como su padre ni viciosamente seductora como su madre. Cuando recurre a los mortales en busca de compañía, descubre que posee el poder de la brujería.',
                averageRating: 4.3,
                ratingsCount: 11200,
                genres: ['Fantasía', 'Mitología', 'Ficción histórica'],
                reason: 'Complementa perfectamente tu biblioteca'
            }
        ];

        return mockBooks.slice(0, limit);
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

const recommendationService = new RecommendationService();
export default recommendationService; 