'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { BookCozyIcon, HeartCozyIcon, StarCozyIcon, MagicCozyIcon} from '../ui/cozy/IconCozy';
import { PreferencesStepCozy } from './PreferencesStepCozy';
import { ReadBooksStepCozy } from './ReadBooksStepCozy';
import { AbandonedBooksStepCozy } from './AbandonedBooksStepCozy';
import { SurveyConfirmationCozy } from './SurveyConfirmationCozy';

// Componente de Indicador de Progreso tipo "Sendero"
const ProgressPathCozy = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`flex items-center justify-center mb-8 ${className}`}>
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isNext = index === currentStep + 1;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Círculo del paso */}
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full border-3 transition-all duration-500 flex items-center justify-center font-cozy-display font-semibold ${
                    isCompleted
                      ? 'bg-cozy-sage border-cozy-forest text-white cozy-shadow-md'
                      : isActive
                      ? 'bg-cozy-terracotta border-cozy-warm-brown text-white cozy-shadow-lg scale-110'
                      : isNext
                      ? 'bg-cozy-soft-yellow/30 border-cozy-soft-yellow text-cozy-warm-brown'
                      : 'bg-cozy-cream border-cozy-light-gray text-cozy-medium-gray'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Partículas decorativas para paso activo */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cozy-soft-yellow rounded-full animate-ping opacity-60" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cozy-sage rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div className="relative">
                  <div className="w-16 h-1 bg-cozy-light-gray mx-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${
                        index < currentStep
                          ? 'w-full bg-cozy-sage'
                          : index === currentStep
                          ? 'w-1/2 bg-cozy-terracotta animate-pulse'
                          : 'w-0 bg-cozy-medium-gray'
                      }`}
                    />
                  </div>
                  
                  {/* Huellas decorativas en el sendero */}
                  {index < currentStep && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                      <div className="w-1 h-1 bg-cozy-forest rounded-full opacity-40" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente principal SurveyWizardCozy
export function SurveyWizardCozy({ initialSurvey = null, isFirstTime = true }) {
    const router = useRouter();
    const { updateUser, refreshUser } = useAuth();
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
            description: 'Ritmo y géneros favoritos',
            icon: HeartCozyIcon,
            color: 'cozy-sage'
        },
        {
            id: 'read-books',
            title: 'Libros Leídos',
            description: 'Tus lecturas realizadas (opcional)',
            icon: BookOpen,
            color: 'cozy-terracotta'
        },
        {
            id: 'abandoned-books',
            title: 'Tus Libros Abandonados',
            description: 'Libros que dejaste (opcional)',
            icon: null,
            color: 'cozy-soft-yellow'
        },
        {
            id: 'confirmation',
            title: 'Confirmación',
            description: 'Revisar y finalizar',
            icon: MagicCozyIcon,
            color: 'cozy-lavender'
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
            console.error('Error loading survey:', error);
        }
    };

    const handleStepData = (stepData) => {
        setSurveyData(prev => ({ ...prev, ...stepData }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            // Constantes para los valores del enum ReadingStatus
            const READING_STATUS = {
                READ: 'READ',
                ABANDONED: 'ABANDONED',
                TO_READ: 'TO_READ'
            };

            // Preparar datos finales
            const finalData = {
                pace: surveyData.pace,
                genres: surveyData.genres,
                readBooks: surveyData.readBooks || [],
                abandonedBooks: surveyData.abandonedBooks || []
            };

            const { surveyService } = await import('../../services/surveyService');

            try {
                const surveyResponse = await surveyService.updateSurvey({
                    pace: finalData.pace,
                    genresIds: finalData.genres // Ya son IDs numéricos del backend
                });
            } catch (surveyError) {
                throw surveyError;
            }

            // Añadir libros leídos
            if (finalData.readBooks && finalData.readBooks.length > 0) {
                const userBookService = (await import('../../services/userBookService')).default;

                for (const book of finalData.readBooks) {
                    // Crear el objeto Book sin ID (el backend lo generará)
                    const bookData = {
                        title: book.title,
                        authors: book.authors,
                        isbn10: book.isbn10 || book.isbn13?.substring(3) || null,
                        isbn13: book.isbn13,
                        publisher: book.publisher || book.publishedYear || "Editorial desconocida",
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
                        const response = await userBookService.addBook(bookData, userBookData);
                    } catch (error) {
                        throw error;
                    }
                }
            }

            // Añadir libros abandonados
            if (finalData.abandonedBooks && finalData.abandonedBooks.length > 0) {
                const userBookService = (await import('../../services/userBookService')).default;

                for (const book of finalData.abandonedBooks) {
                    // Crear el objeto Book sin ID (el backend lo generará)
                    const bookData = {
                        title: book.title,
                        authors: book.authors,
                        isbn10: book.isbn10 || book.isbn13?.substring(3) || null,
                        isbn13: book.isbn13,
                        publisher: book.publisher || book.publishedYear || "Editorial desconocida",
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
                        const response = await userBookService.addBook(bookData, userBookData);
                    } catch (error) {
                        throw error;
                    }
                }
            }

            // Actualizar firstTime a false y refrescar usuario
            await updateUser({ firstTime: false });
            await refreshUser();
            
            // Redirigir al dashboard
            router.push('/home');
        } catch (err) {
            setError('Error al guardar la encuesta. Inténtalo de nuevo.');
            console.error('Survey submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <PreferencesStepCozy
                        data={surveyData}
                        onNext={nextStep}
                        onDataChange={handleStepData}
                    />
                );
            case 1:
                return (
                    <ReadBooksStepCozy
                        data={surveyData}
                        onNext={nextStep}
                        onPrev={prevStep}
                        onDataChange={handleStepData}
                    />
                );
            case 2:
                return (
                    <AbandonedBooksStepCozy
                        data={surveyData}
                        onNext={nextStep}
                        onPrev={prevStep}
                        onDataChange={handleStepData}
                    />
                );
            case 3:
                return (
                    <SurveyConfirmationCozy
                        data={surveyData}
                        onComplete={handleComplete}
                        onPrev={prevStep}
                        isSubmitting={isSubmitting}
                        isFirstTime={isFirstTime}
                    />
                );
            default:
                return null;
        }
    };

    const currentStepConfig = steps[currentStep];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-white to-cozy-mint relative overflow-hidden">
            {/* Fondo decorativo con textura de papel */}
            <div className="absolute inset-0 cozy-texture-paper opacity-30" />
            
            {/* Elementos decorativos flotantes */}
            <div className="absolute top-10 left-10 opacity-20">
                <BookCozyIcon className="w-8 h-8 text-cozy-sage cozy-animate-float" />
            </div>
            <div className="absolute top-32 right-16 opacity-20">
                <HeartCozyIcon className="w-6 h-6 text-cozy-terracotta cozy-animate-float" style={{animationDelay: '1s'}} />
            </div>
            <div className="absolute bottom-20 left-20 opacity-20">
                <StarCozyIcon className="w-7 h-7 text-cozy-soft-yellow cozy-animate-float" style={{animationDelay: '2s'}} />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header del cuestionario */}
                <div className="text-center py-8 px-4">
                    <CardCozy variant="magical" className="max-w-2xl mx-auto p-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <MagicCozyIcon className="w-8 h-8 text-cozy-terracotta" />
                            <h1 className="text-3xl font-bold font-cozy-display text-cozy-warm-brown">
                                {isFirstTime ? '¡Bienvenido a tu aventura literaria!' : 'Actualiza tus preferencias'}
                            </h1>
                        </div>
                        <p className="text-cozy-dark-gray font-cozy text-lg">
                            Cuéntanos sobre tus gustos de lectura para personalizar tu experiencia
                        </p>
                        
                        {/* Indicador de progreso */}
                        <div className="mt-6">
                            <ProgressPathCozy steps={steps} currentStep={currentStep} />
                        </div>

                        {/* Título del paso actual */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                {currentStepConfig.icon && (
                                    <currentStepConfig.icon className={`w-6 h-6 text-${currentStepConfig.color}`} />
                                )}
                                <h2 className="text-xl font-semibold font-cozy-display text-cozy-warm-brown">
                                    {currentStepConfig.title}
                                </h2>
                            </div>
                            <p className="text-cozy-medium-gray font-cozy">
                                {currentStepConfig.description}
                            </p>
                        </div>
                    </CardCozy>
                </div>

                {/* Contenido del paso actual */}
                <div className="flex-1 px-4 pb-8">
                    {error && (
                        <div className="max-w-2xl mx-auto mb-6">
                            <CardCozy variant="warm" className="border-cozy-terracotta/30 bg-cozy-terracotta/10">
                                <div className="p-4 text-center">
                                    <p className="text-cozy-terracotta font-cozy font-medium">{error}</p>
                                </div>
                            </CardCozy>
                        </div>
                    )}
                    
                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    );
}
