'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Clock, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import apiClient from '../../lib/apiClient';

export default function PreferencesEditModal({ isOpen, onClose, onSave }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [currentSurvey, setCurrentSurvey] = useState(null);

    // Estados del formulario
    const [selectedPace, setSelectedPace] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([]);

    // Cargar datos cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            loadCurrentPreferences();
            // No llamar loadAvailableGenres aquí porque ya se llama en loadCurrentPreferences
        }
    }, [isOpen]);

    /**
     * Carga las preferencias actuales del usuario
     */
    const loadCurrentPreferences = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get('/surveys/find');
            const survey = response.data;

            setCurrentSurvey(survey);
            setSelectedPace(survey.pace || '');

            // Los géneros seleccionados vienen como array de GenreSelection enums
            // Necesitamos convertirlos a IDs para el formulario
            if (survey.selectedGenres && survey.selectedGenres.length > 0) {
                // Cargar géneros disponibles primero para obtener los IDs
                const genresResponse = await apiClient.get('/genres');
                const availableGenres = genresResponse.data || [];

                // Mapear GenreSelection enums a IDs
                const selectedGenreIds = survey.selectedGenres
                    .map(genreEnum => {
                        const genre = availableGenres.find(g => g.selectedGenre === genreEnum);
                        return genre ? genre.id : null;
                    })
                    .filter(id => id !== null);

                setSelectedGenres(selectedGenreIds);
                setAvailableGenres(availableGenres);
            } else {
                setSelectedGenres([]);
            }
        } catch (err) {
            console.error('Error al cargar preferencias:', err);
            setError('Error al cargar tus preferencias actuales');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Carga los géneros disponibles
     */
    const loadAvailableGenres = async () => {
        try {
            const response = await apiClient.get('/genres');
            const genres = response.data || [];
            setAvailableGenres(genres);
        } catch (err) {
            console.error('Error al cargar géneros:', err);
            setError('Error al cargar géneros disponibles');
        }
    };

    /**
     * Maneja el cambio de ritmo de lectura
     */
    const handlePaceChange = (pace) => {
        setSelectedPace(pace);
    };

    /**
     * Maneja el cambio de géneros
     */
    const handleGenreToggle = (genreId) => {
        setSelectedGenres(prev => {
            if (prev.includes(genreId)) {
                return prev.filter(id => id !== genreId);
            } else {
                return [...prev, genreId];
            }
        });
    };

    /**
     * Guarda las preferencias actualizadas
     */
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Validación
            if (!selectedPace) {
                setError('Por favor selecciona un ritmo de lectura');
                return;
            }

            if (selectedGenres.length === 0) {
                setError('Por favor selecciona al menos un género');
                return;
            }

            // Preparar datos para enviar
            const updateData = {
                pace: selectedPace,
                genresIds: selectedGenres
            };

            // Enviar actualización
            await apiClient.put('/surveys/update', updateData);

            // Notificar al componente padre
            onSave?.();

            // Cerrar modal
            onClose();

        } catch (err) {
            console.error('Error al guardar preferencias:', err);
            setError('Error al guardar las preferencias. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    /**
     * Cierra el modal
     */
    const handleClose = () => {
        if (!saving) {
            onClose();
        }
    };

    /**
     * Obtiene el nombre legible del género desde el enum GenreSelection
     */
    const getGenreDisplayName = (genreEnum) => {
        const genreMap = {
            'FANTASY': 'Fantasía',
            'SCIENCE_FICTION': 'Ciencia Ficción',
            'ROMANCE': 'Romance',
            'THRILLER': 'Thriller',
            'MYSTERY': 'Misterio',
            'HORROR': 'Terror',
            'HISTORICAL_FICTION': 'Ficción Histórica',
            'NON_FICTION': 'No Ficción',
            'BIOGRAPHY': 'Biografía',
            'SELF_HELP': 'Autoayuda',
            'POETRY': 'Poesía',
            'CLASSIC': 'Clásico',
            'YOUNG_ADULT': 'Juvenil',
            'CHILDREN': 'Infantil',
            'GRAPHIC_NOVEL': 'Novela Gráfica',
            'MEMOIR': 'Memorias',
            'DYSTOPIAN': 'Distópico',
            'CRIME': 'Crimen',
            'ADVENTURE': 'Aventura',
            'LITERARY_FICTION': 'Ficción Literaria',
            'PHILOSOPHY': 'Filosofía',
            'RELIGION': 'Religión',
            'BUSINESS': 'Negocios',
            'TECHNOLOGY': 'Tecnología',
            'HUMOR': 'Humor',
            'COOKING': 'Cocina',
            'TRAVEL': 'Viajes',
            'HEALTH_FITNESS': 'Salud y Fitness',
            'ART_DESIGN': 'Arte y Diseño',
            'EDUCATION': 'Educación'
        };
        return genreMap[genreEnum] || genreEnum;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Actualizar Preferencias
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Modifica tu ritmo de lectura y géneros favoritos
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        disabled={saving}
                        className="p-2"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="space-y-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Ritmo de Lectura */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    ¿A qué ritmo prefieres leer?
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Ritmo Lento */}
                                    <Card
                                        className={`cursor-pointer transition-all ${selectedPace === 'SLOW'
                                            ? 'ring-2 ring-indigo-500 bg-indigo-50'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => handlePaceChange('SLOW')}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-8 h-8 text-blue-600" />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Ritmo Lento</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Prefiero tomarme mi tiempo y disfrutar cada detalle
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Ritmo Rápido */}
                                    <Card
                                        className={`cursor-pointer transition-all ${selectedPace === 'FAST'
                                            ? 'ring-2 ring-indigo-500 bg-indigo-50'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => handlePaceChange('FAST')}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <Zap className="w-8 h-8 text-orange-600" />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Ritmo Rápido</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Me gusta la acción constante y avanzar rápidamente
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Géneros */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    ¿Qué géneros te interesan? (selecciona varios)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {availableGenres.map((genre) => (
                                        <button
                                            key={genre.id}
                                            type="button"
                                            onClick={() => handleGenreToggle(genre.id)}
                                            className={`p-3 text-sm font-medium rounded-lg border transition-all ${selectedGenres.includes(genre.id)
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {getGenreDisplayName(genre.selectedGenre)}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Seleccionados: {selectedGenres.length} géneros
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-4 p-6 border-t bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading || saving || !selectedPace || selectedGenres.length === 0}
                        className="flex items-center space-x-2"
                    >
                        {saving && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>{saving ? 'Guardando...' : 'Guardar Preferencias'}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
} 