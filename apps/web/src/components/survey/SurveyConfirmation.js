import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

export function SurveyConfirmation({
    onSubmit,
    onBack,
    surveyData = {},
    isSubmitting = false
}) {
    const [isExpanded, setIsExpanded] = useState({
        preferences: true,
        readBooks: false,
        abandonedBooks: false
    });

    const toggleSection = (section) => {
        setIsExpanded(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getPaceLabel = (pace) => {
        return pace === 'SLOW' ? 'Ritmo Relajado' : 'Ritmo Intenso';
    };

    const getPaceIcon = (pace) => {
        return pace === 'SLOW' ? '🐢' : '🚀';
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(surveyData);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirma tu Encuesta
                </h2>
                <p className="text-gray-600">
                    Revisa la información antes de finalizar. Podrás modificarla más tarde desde tu perfil.
                </p>
            </div>

            {/* Preferences Summary */}
            <Card>
                <CardHeader>
                    <button
                        onClick={() => toggleSection('preferences')}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">
                            Preferencias de Lectura
                        </h3>
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.preferences ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </CardHeader>
                {isExpanded.preferences && (
                    <CardContent>
                        <div className="space-y-4">
                            {/* Pace */}
                            {surveyData.pace && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Ritmo de lectura</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">{getPaceIcon(surveyData.pace)}</span>
                                        <span className="text-sm text-gray-900">{getPaceLabel(surveyData.pace)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Genres */}
                            {surveyData.genres && surveyData.genres.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Géneros seleccionados ({surveyData.genres.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {surveyData.genres.map((genre, index) => (
                                            <span
                                                key={genre.id || index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {genre.selectedGenre || genre.name || genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Read Books Summary */}
            {surveyData.readBooks && surveyData.readBooks.length > 0 && (
                <Card>
                    <CardHeader>
                        <button
                            onClick={() => toggleSection('readBooks')}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                Libros Leídos ({surveyData.readBooks.length})
                            </h3>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.readBooks ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </CardHeader>
                    {isExpanded.readBooks && (
                        <CardContent>
                            <div className="space-y-3">
                                {surveyData.readBooks.map((book, index) => (
                                    <div key={`read-${book.id || book.title}-${index}`}
                                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <img
                                            src={book.coverUrl || '/placeholder-book.jpg'}
                                            alt={book.title}
                                            className="w-12 h-16 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {book.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 truncate">
                                                {book.authors?.map(author => author.name).join(', ') || 'Autor desconocido'}
                                            </p>
                                            <div className="mt-1">
                                                <StarRating
                                                    rating={book.rating || 0}
                                                    size="sm"
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Abandoned Books Summary */}
            {surveyData.abandonedBooks && surveyData.abandonedBooks.length > 0 && (
                <Card>
                    <CardHeader>
                        <button
                            onClick={() => toggleSection('abandonedBooks')}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                Libros Abandonados ({surveyData.abandonedBooks.length})
                            </h3>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.abandonedBooks ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </CardHeader>
                    {isExpanded.abandonedBooks && (
                        <CardContent>
                            <div className="space-y-3">
                                {surveyData.abandonedBooks.map((book, index) => (
                                    <div key={`abandoned-${book.id || book.title}-${index}`}
                                        className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                                        <img
                                            src={book.coverUrl || '/placeholder-book.jpg'}
                                            alt={book.title}
                                            className="w-12 h-16 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {book.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 truncate">
                                                {book.authors?.map(author => author.name).join(', ') || 'Autor desconocido'}
                                            </p>
                                            {book.reason && (
                                                <p className="text-xs text-red-600 mt-1">
                                                    Motivo: {book.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Summary Stats */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">
                            Resumen de tu Encuesta
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {surveyData.genres?.length || 0}
                                </div>
                                <div className="text-sm text-blue-800">Géneros</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {surveyData.readBooks?.length || 0}
                                </div>
                                <div className="text-sm text-blue-800">Leídos</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {surveyData.abandonedBooks?.length || 0}
                                </div>
                                <div className="text-sm text-blue-800">Abandonados</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {surveyData.readBooks?.reduce((sum, book) => sum + (book.rating || 0), 0) / (surveyData.readBooks?.length || 1) || 0}
                                </div>
                                <div className="text-sm text-blue-800">Rating Promedio</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-green-50 border-green-200">
                <CardContent>
                    <div className="flex items-start space-x-3">
                        <div className="text-green-500 mt-0.5">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-green-900">
                                ¡Ya casi terminamos!
                            </h4>
                            <p className="text-sm text-green-700 mt-1">
                                Una vez que confirmes tu encuesta, podrás empezar a recibir recomendaciones
                                personalizadas. También podrás actualizar tus preferencias en cualquier momento
                                desde tu perfil.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    Anterior
                </Button>

                <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Finalizar Encuesta'}
                </Button>
            </div>
        </div>
    );
} 