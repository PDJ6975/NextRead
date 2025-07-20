import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { clsx } from 'clsx';
import { translateGenre } from '../../lib/genreTranslations';

export function PreferencesStep({
    onNext,
    onBack,
    initialData = {},
    isFirstTime = true
}) {
    const [selectedPace, setSelectedPace] = useState(initialData.pace || '');
    const [selectedGenres, setSelectedGenres] = useState(initialData.genres || []);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const paceOptions = [
        {
            value: 'SLOW',
            title: 'Ritmo Relajado',
            description: 'Me gustan los libros lentos que requieren atención',
            icon: '🐢'
        },
        {
            value: 'FAST',
            title: 'Ritmo Intenso',
            description: 'Me gustan los libros dinámicos en los que siempre hay acción',
            icon: '🚀'
        }
    ];

    useEffect(() => {
        loadGenres();
    }, []);

    const loadGenres = async () => {
        try {
            const { genreService } = await import('../../services/genreService');
            const response = await genreService.getAllGenres();
            setAvailableGenres(response.data || []);
        } catch (error) {
            console.error('Error al cargar géneros:', error);
            setError('Error al cargar los géneros disponibles');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaceSelect = (pace) => {
        setSelectedPace(pace);
    };

    const handleGenreToggle = (genreId) => {
        setSelectedGenres(prev => {
            if (prev.includes(genreId)) {
                return prev.filter(id => id !== genreId);
            } else {
                return [...prev, genreId];
            }
        });
    };

    const handleNext = () => {
        if (!selectedPace) {
            setError('Por favor selecciona un ritmo de lectura');
            return;
        }

        if (isFirstTime && selectedGenres.length === 0) {
            setError('Por favor selecciona al menos un género');
            return;
        }

        setError('');

        if (onNext) {
            onNext({
                pace: selectedPace,
                genres: selectedGenres
            });
        }
    };

    const canProceed = selectedPace && (!isFirstTime || selectedGenres.length > 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Preferencias de Lectura
                </h2>
                <p className="text-gray-600">
                    Cuéntanos sobre tu estilo de lectura para personalizar tus recomendaciones
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Pace Selection */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                        ¿Cuál es tu ritmo de lectura?
                    </h3>
                    <p className="text-sm text-gray-600">
                        Esto nos ayuda a sugerir libros de la longitud adecuada
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paceOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handlePaceSelect(option.value)}
                                className={clsx(
                                    'p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md',
                                    {
                                        'border-blue-500 bg-blue-50': selectedPace === option.value,
                                        'border-gray-200 bg-white hover:border-gray-300': selectedPace !== option.value,
                                    }
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">
                                            {option.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {option.description}
                                        </p>
                                    </div>
                                    {selectedPace === option.value && (
                                        <div className="text-blue-500">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Genre Selection */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                        ¿Qué géneros te interesan?
                    </h3>
                    <p className="text-sm text-gray-600">
                        {isFirstTime
                            ? 'Selecciona al menos uno para continuar'
                            : 'Puedes actualizar tus preferencias (opcional)'
                        }
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableGenres.map((genre) => (
                            <button
                                key={genre.id}
                                onClick={() => handleGenreToggle(genre.id)}
                                className={clsx(
                                    'p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm',
                                    {
                                        'border-blue-500 bg-blue-50 text-blue-700': selectedGenres.includes(genre.id),
                                        'border-gray-200 bg-white text-gray-700 hover:border-gray-300': !selectedGenres.includes(genre.id),
                                    }
                                )}
                            >
                                {translateGenre(genre.selectedGenre)}
                            </button>
                        ))}
                    </div>

                    {selectedGenres.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">
                                    {selectedGenres.length} género{selectedGenres.length !== 1 ? 's' : ''} seleccionado{selectedGenres.length !== 1 ? 's' : ''}
                                </span>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={!onBack}
                >
                    Anterior
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
} 