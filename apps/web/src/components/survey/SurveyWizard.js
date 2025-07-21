import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { StepIndicator } from '../ui/StepIndicator';
import { PreferencesStep } from './PreferencesStep';
import { ReadBooksStep } from './ReadBooksStep';
import { AbandonedBooksStep } from './AbandonedBooksStep';
import { SurveyConfirmation } from './SurveyConfirmation';

export function SurveyWizard({ initialSurvey = null, isFirstTime = true }) {
    const router = useRouter();
    const { updateUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [surveyData, setSurveyData] = useState({
        pace: initialSurvey?.pace || '',
        genres: initialSurvey?.genres || [],
        readBooks: [],
        abandonedBooks: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const steps = [
        {
            id: 'preferences',
            title: 'Preferencias',
            description: 'Ritmo y géneros'
        },
        {
            id: 'read-books',
            title: 'Libros Leídos',
            description: 'Con valoraciones'
        },
        {
            id: 'abandoned-books',
            title: 'Abandonados',
            description: 'Opcional'
        },
        {
            id: 'confirmation',
            title: 'Confirmación',
            description: 'Revisar y finalizar'
        }
    ];

    // Cargar datos existentes si no es primera vez
    useEffect(() => {
        if (!isFirstTime && !initialSurvey) {
            loadExistingSurvey();
        }
    }, [isFirstTime, initialSurvey]);

    const loadExistingSurvey = async () => {
        try {
            const { surveyService } = await import('../../services/surveyService');
            const response = await surveyService.getSurvey();

            if (response.data) {
                setSurveyData(prev => ({
                    ...prev,
                    pace: response.data.pace || '',
                    genres: response.data.selectedGenres || []
                }));
            }
        } catch (error) {
            console.error('Error al cargar encuesta existente:', error);
        }
    };

    const handleStepComplete = (stepData) => {
        setSurveyData(prev => ({
            ...prev,
            ...stepData
        }));

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
        setError('');
    };

    const handleStepBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
        setError('');
    };

    const handleSubmit = async (finalData) => {
        setIsSubmitting(true);
        setError('');

        try {

            // Constantes para los valores del enum ReadingStatus
            const READING_STATUS = {
                READ: 'READ',
                ABANDONED: 'ABANDONED',
                TO_READ: 'TO_READ'
            };

            const { surveyService } = await import('../../services/surveyService');

            try {
                const surveyResponse = await surveyService.updateSurvey({
                    pace: finalData.pace,
                    genresIds: finalData.genres.map(genre => genre.id || genre)
                });
            } catch (surveyError) {
                throw surveyError;
            }

            // Añadir libros leídos
            if (finalData.readBooks && finalData.readBooks.length > 0) {
                const { userBookService } = await import('../../services/userBookService');

                for (const book of finalData.readBooks) {
                    // Crear el objeto Book separado del UserBookDTO
                    const bookData = {
                        id: book.id,
                        title: book.title,
                        authors: book.authors,
                        isbn10: book.isbn10 || book.isbn13?.substring(3) || null, // Generar ISBN10 desde ISBN13 o null
                        isbn13: book.isbn13,
                        publisher: book.publisher || book.publishedYear || "Editorial desconocida", // Usar publishedYear como fallback si no hay publisher
                        coverUrl: book.coverUrl,
                        pages: book.pages,
                        publishedYear: book.publishedYear,
                        synopsis: book.synopsis
                    };

                    const userBookData = {
                        rating: book.rating,
                        status: READING_STATUS.READ
                    };

                    try {

                        const response = await userBookService.addBook({
                            book: bookData,
                            userBookDTO: userBookData
                        });
                    } catch (error) {
                        throw error;
                    }
                }
            }

            // Añadir libros abandonados
            if (finalData.abandonedBooks && finalData.abandonedBooks.length > 0) {
                const { userBookService } = await import('../../services/userBookService');

                for (const book of finalData.abandonedBooks) {
                    // Crear el objeto Book separado del UserBookDTO
                    const bookData = {
                        id: book.id,
                        title: book.title,
                        authors: book.authors,
                        isbn10: book.isbn10 || book.isbn13?.substring(3) || null, // Generar ISBN10 desde ISBN13 o null
                        isbn13: book.isbn13,
                        publisher: book.publisher || book.publishedYear || "Editorial desconocida", // Usar publishedYear como fallback si no hay publisher
                        coverUrl: book.coverUrl,
                        pages: book.pages,
                        publishedYear: book.publishedYear,
                        synopsis: book.synopsis
                    };

                    const userBookData = {
                        rating: null,
                        status: READING_STATUS.ABANDONED
                    };

                    try {

                        const response = await userBookService.addBook({
                            book: bookData,
                            userBookDTO: userBookData
                        });
                    } catch (error) {
                        throw error;
                    }
                }
            }

            // Actualizar el estado del usuario para reflejar que ya no es primera vez
            updateUser({ firstTime: false });

            // Pequeño delay para asegurar que el estado se actualice antes de redirigir
            setTimeout(() => {
                router.push('/home');
            }, 100);

        } catch (error) {
            setError('Error al guardar la encuesta. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCurrentStep = () => {
        const stepProps = {
            onNext: handleStepComplete,
            onBack: currentStep > 0 ? handleStepBack : null,
            isFirstTime
        };

        switch (currentStep) {
            case 0:
                return (
                    <PreferencesStep
                        {...stepProps}
                        initialData={{
                            pace: surveyData.pace,
                            genres: surveyData.genres
                        }}
                    />
                );
            case 1:
                return (
                    <ReadBooksStep
                        {...stepProps}
                        initialData={{
                            readBooks: surveyData.readBooks
                        }}
                    />
                );
            case 2:
                return (
                    <AbandonedBooksStep
                        {...stepProps}
                        initialData={{
                            abandonedBooks: surveyData.abandonedBooks
                        }}
                    />
                );
            case 3:
                return (
                    <SurveyConfirmation
                        onSubmit={handleSubmit}
                        onBack={handleStepBack}
                        surveyData={surveyData}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isFirstTime ? 'Configura tu Perfil de Lectura' : 'Actualizar Preferencias'}
                        </h1>
                        <p className="text-gray-600">
                            {isFirstTime
                                ? 'Completa esta encuesta para recibir recomendaciones personalizadas'
                                : 'Actualiza tus preferencias para mejorar las recomendaciones'
                            }
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator
                        steps={steps}
                        currentStep={currentStep}
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="text-red-500">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Current Step Content */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {renderCurrentStep()}
                    </div>

                    {/* Progress Info */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Paso {currentStep + 1} de {steps.length}
                        {isFirstTime && currentStep < steps.length - 1 && (
                            <span className="ml-2">
                                • Tiempo estimado: {Math.max(1, (steps.length - currentStep - 1) * 2)} minutos restantes
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 