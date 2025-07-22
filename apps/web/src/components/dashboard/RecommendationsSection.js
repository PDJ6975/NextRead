'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { EmptyRecommendations, ConnectionError } from '../ui/EmptyState';
import RecommendationCarousel from './RecommendationCarousel';
import BookDetailsModal from './BookDetailsModal';
import PreferencesEditModal from '../survey/PreferencesEditModal';
import recommendationService from '../../services/recommendationService';
import userBookService from '../../services/userBookService';

export default function RecommendationsSection({
    maxRecommendations = 6,
    onBookAdded
}) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);

    // Cargar recomendaciones iniciales
    useEffect(() => {
        loadRecommendations();
    }, []);

    /**
     * Carga las recomendaciones desde el servicio
     */
    const loadRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simular delay para mostrar skeleton loading
            await recommendationService.simulateDelay(1000);

            const data = await recommendationService.getRecommendations();
            setRecommendations(data || []);

            // Si no hay recomendaciones guardadas, intentar generar algunas
            if (!data || data.length === 0) {
                // Mostrar mensaje educativo en lugar de generar automáticamente
                console.log('No hay recomendaciones guardadas. El usuario puede generar nuevas.');
            }
        } catch (err) {
            setError('Error al cargar recomendaciones');
            console.error('Error loading recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Genera nuevas recomendaciones usando ChatGPT
     */
    const handleGenerateNew = async () => {
        try {
            setGenerating(true);
            setError(null);

            // Simular delay para UX
            await recommendationService.simulateDelay(2500);

            const newRecommendations = await recommendationService.generateNewRecommendations();
            setRecommendations(newRecommendations || []);

            // Feedback visual de éxito
            console.log('Nuevas recomendaciones generadas exitosamente');

        } catch (err) {
            // Mostrar el mensaje de error específico del servicio
            const errorMessage = err.message || 'Error al generar nuevas recomendaciones';
            setError(errorMessage);
            console.error('Error generating recommendations:', err);
        } finally {
            setGenerating(false);
        }
    };

    /**
     * Maneja el "like" de una recomendación (guardarla)
     */
    const handleLike = async (book) => {
        try {
            // Solo guardar si el libro tiene ID (no es generado)
            if (book.id && !book.isGenerated) {
                await recommendationService.saveRecommendation(book, book.reason);
                console.log('Recomendación guardada:', book.title);
            } else {
                console.log('Like registrado para libro generado:', book.title);
            }
        } catch (err) {
            console.error('Error al registrar like:', err);
            throw err; // Re-throw para que el componente hijo maneje el error
        }
    };

    /**
     * Maneja el "dislike" de una recomendación (eliminarla)
     */
    const handleDislike = async (book) => {
        try {
            // Solo eliminar si es una recomendación guardada
            if (book.recommendationId) {
                await recommendationService.deleteRecommendation({ id: book.recommendationId });
            }

            // Remover la recomendación de la lista local
            setRecommendations(prev => prev.filter(rec =>
                rec.id !== book.id && rec.title !== book.title
            ));

            console.log('Recomendación eliminada:', book.title);
        } catch (err) {
            console.error('Error al registrar dislike:', err);
            throw err;
        }
    };

    /**
     * Maneja agregar libro a la biblioteca
     */
    const handleAddToLibrary = async (book, rating = 0) => {
        try {
            // Preparar datos del libro
            const bookData = {
                id: book.id,
                title: book.title,
                authors: book.authors,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                publisher: book.publisher || "Editorial desconocida",
                coverUrl: book.coverUrl,
                pages: book.pages,
                publishedYear: book.publishedYear,
                synopsis: book.synopsis
            };

            const userBookData = {
                rating: rating > 0 ? rating : null,
                status: 'WANT_TO_READ' // Estado por defecto para libros recomendados
            };

            await userBookService.addBook(bookData, userBookData);

            // Guardar como recomendación si no está guardada y tiene ID
            if (book.id && !book.isGenerated && !book.recommendationId) {
                await recommendationService.saveRecommendation(book, 'Añadido desde recomendaciones');
            }

            // Remover de recomendaciones ya que fue añadido
            setRecommendations(prev => prev.filter(rec =>
                rec.id !== book.id && rec.title !== book.title
            ));

            // Callback para notificar al padre
            onBookAdded?.(book);

            console.log('Libro añadido a biblioteca:', book.title);
        } catch (err) {
            console.error('Error al añadir libro a biblioteca:', err);
            throw err;
        }
    };

    /**
     * Maneja ver detalles de un libro
     */
    const handleViewDetails = (book) => {
        setSelectedBook(book);
        setShowDetailsModal(true);
    };

    /**
     * Cierra el modal de detalles
     */
    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedBook(null);
    };

    /**
     * Maneja abrir el modal de preferencias
     */
    const handleUpdatePreferences = () => {
        setShowPreferencesModal(true);
    };

    /**
     * Maneja el cierre del modal de preferencias
     */
    const handleClosePreferences = () => {
        setShowPreferencesModal(false);
    };

    /**
     * Maneja cuando se guardan las preferencias
     */
    const handlePreferencesSaved = () => {
        // Recargar recomendaciones después de actualizar preferencias
        loadRecommendations();
        console.log('Preferencias actualizadas, recargando recomendaciones...');
    };

    /**
     * Maneja retry cuando hay error
     */
    const handleRetry = () => {
        loadRecommendations();
    };

    // Renderizado del componente
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Recomendaciones para ti
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Descubre libros basados en tus gustos
                                </p>
                            </div>
                        </div>

                        {/* Botón generar nuevas */}
                        <Button
                            onClick={handleGenerateNew}
                            disabled={generating || loading}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">
                                {generating ? 'Generando...' : 'Generar recomendaciones'}
                            </span>
                        </Button>
                    </div>

                    {/* Información adicional */}
                    {!loading && !error && (
                        <div className="mt-4 text-sm text-gray-600">
                            {recommendations.length > 0 ? (
                                <p>
                                    {recommendations.length} recomendación{recommendations.length !== 1 ? 'es' : ''} disponible{recommendations.length !== 1 ? 's' : ''}
                                    {recommendations.some(r => r.isGenerated) && ' (generadas con IA)'}
                                </p>
                            ) : (
                                <p>
                                    Genera recomendaciones personalizadas basadas en tu perfil de lectura
                                </p>
                            )}
                        </div>
                    )}
                </CardHeader>

                <CardContent>
                    {/* Estado de error */}
                    {error && !loading && (
                        <ConnectionError onRetry={handleRetry} />
                    )}

                    {/* Estado de carga o recomendaciones */}
                    {!error && (
                        <>
                            {/* Mensaje de generando nuevas */}
                            {generating && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center space-x-3">
                                        <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                                        <div>
                                            <p className="text-blue-900 font-medium">
                                                Generando recomendaciones personalizadas
                                            </p>
                                            <p className="text-blue-700 text-sm">
                                                Analizando tu perfil y preferencias de lectura...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Carrusel de recomendaciones */}
                            {(recommendations.length > 0 || loading) && (
                                <RecommendationCarousel
                                    recommendations={recommendations}
                                    loading={loading}
                                    onLike={handleLike}
                                    onDislike={handleDislike}
                                    onAddToLibrary={handleAddToLibrary}
                                    onViewDetails={handleViewDetails}
                                />
                            )}

                            {/* Estado vacío */}
                            {recommendations.length === 0 && !loading && !error && (
                                <EmptyRecommendations
                                    onUpdatePreferences={handleUpdatePreferences}
                                />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Modal de detalles del libro */}
            <BookDetailsModal
                book={selectedBook}
                isOpen={showDetailsModal}
                onClose={handleCloseModal}
                onAddToLibrary={handleAddToLibrary}
                onLike={handleLike}
                onDislike={handleDislike}
            />

            {/* Modal de edición de preferencias */}
            <PreferencesEditModal
                isOpen={showPreferencesModal}
                onClose={handleClosePreferences}
                onSave={handlePreferencesSaved}
            />
        </>
    );
} 