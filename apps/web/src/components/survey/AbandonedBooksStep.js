import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { BookSearchForm } from '../ui/BookSearchForm';
import { clsx } from 'clsx';

// Componente de icono por defecto para libros
const DefaultBookIcon = ({ className = "w-full h-full" }) => (
    <div className={clsx("flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200", className)}>
        <svg
            className="w-8 h-8 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
            <path d="M8 12h8v1H8v-1zm0 2h8v1H8v-1zm0 2h5v1H8v-1z" />
        </svg>
    </div>
);

export function AbandonedBooksStep({
    onNext,
    onBack,
    initialData = {},
    isFirstTime = true
}) {
    const [abandonedBooks, setAbandonedBooks] = useState(initialData.abandonedBooks || []);

    const handleBookSelect = (book) => {
        const isAlreadySelected = abandonedBooks.some(selected => {
            // Comparación por ID si ambos lo tienen y son del mismo tipo
            if (selected.id && book.id && typeof selected.id === typeof book.id) {
                return selected.id === book.id;
            }

            // Comparación por ISBN13 si ambos lo tienen
            if (selected.isbn13 && book.isbn13 && selected.isbn13.trim() === book.isbn13.trim()) {
                return true;
            }

            // Comparación por título y primer autor como último recurso
            const selectedTitle = selected.title?.toLowerCase().trim();
            const bookTitle = book.title?.toLowerCase().trim();

            if (selectedTitle && bookTitle && selectedTitle === bookTitle) {
                const selectedAuthor = selected.authors?.[0]?.name?.toLowerCase().trim();
                const bookAuthor = book.authors?.[0]?.name?.toLowerCase().trim();

                // Si ambos tienen autor, compararlos; si no, considerar solo el título
                if (selectedAuthor && bookAuthor) {
                    return selectedAuthor === bookAuthor;
                } else if (!selectedAuthor && !bookAuthor) {
                    return true; // Mismo título y ambos sin autor
                }
            }

            return false;
        });

        if (!isAlreadySelected) {
            setAbandonedBooks(prev => [...prev, {
                ...book,
                status: 'ABANDONED',
                reason: ''
            }]);
        }
    };

    const handleReasonChange = (bookIndex, reason) => {
        setAbandonedBooks(prev => prev.map((book, index) =>
            index === bookIndex ? { ...book, reason } : book
        ));
    };

    const handleRemoveBook = (bookIndex) => {
        setAbandonedBooks(prev => prev.filter((_, index) => index !== bookIndex));
    };

    const handleNext = () => {
        if (onNext) {
            onNext({
                abandonedBooks: abandonedBooks
            });
        }
    };

    const reasonOptions = [
        { value: 'boring', label: 'Era aburrido' },
        { value: 'difficult', label: 'Demasiado difícil' },
        { value: 'long', label: 'Muy largo' },
        { value: 'not_interested', label: 'Perdí el interés' },
        { value: 'bad_writing', label: 'Mala escritura' },
        { value: 'other', label: 'Otro motivo' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Libros que has Abandonado
                </h2>
                <p className="text-gray-600">
                    {isFirstTime
                        ? 'Añade libros que no pudiste terminar para evitar recomendaciones similares (opcional)'
                        : 'Actualiza tu lista de libros abandonados (opcional)'
                    }
                </p>
            </div>

            {/* Book Search */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Buscar Libros Abandonados
                    </h3>
                    <p className="text-sm text-gray-600">
                        Esto nos ayuda a entender mejor tus preferencias y evitar recomendaciones similares
                    </p>
                </CardHeader>
                <CardContent>
                    <BookSearchForm
                        onBookSelect={handleBookSelect}
                        selectedBooks={abandonedBooks}
                        searchType="survey"
                        placeholder="Buscar libros que no pudiste terminar..."
                    />
                </CardContent>
            </Card>

            {/* Selected Books */}
            {abandonedBooks.length > 0 && (
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Libros Abandonados ({abandonedBooks.length})
                        </h3>
                        <p className="text-sm text-gray-600">
                            Indica por qué abandonaste cada libro para mejorar las recomendaciones
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {abandonedBooks.map((book, index) => (
                                <div key={`${book.id || book.title}-${index}`}
                                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                                    {/* Book Info */}
                                    <div className="w-16 h-20 rounded flex-shrink-0 overflow-hidden">
                                        {book.coverUrl ? (
                                            <img
                                                src={book.coverUrl}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <DefaultBookIcon className={book.coverUrl ? "hidden" : "w-full h-full rounded"} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {book.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {book.authors?.map(author => author.name).join(', ') || 'Autor desconocido'}
                                        </p>

                                        {/* Reason Selection */}
                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                ¿Por qué lo abandonaste?
                                            </label>
                                            <select
                                                value={book.reason || ''}
                                                onChange={(e) => handleReasonChange(index, e.target.value)}
                                                className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Selecciona un motivo</option>
                                                {reasonOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Book Details */}
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            {book.pages && (
                                                <span>{book.pages} páginas</span>
                                            )}
                                            {book.publishedYear && (
                                                <span>{book.publishedYear}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveBook(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Eliminar libro"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {abandonedBooks.length === 0 && (
                <Card>
                    <CardContent>
                        <div className="text-center py-8">
                            <div className="text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {isFirstTime ? 'Paso opcional' : 'No has añadido libros abandonados'}
                                </h3>
                                <p className="text-gray-500">
                                    {isFirstTime
                                        ? 'Puedes saltar este paso si prefieres no añadir libros abandonados'
                                        : 'Puedes añadir libros abandonados más tarde'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent>
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-500 mt-0.5">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-900">
                                ¿Por qué pedimos esto?
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Conocer los libros que no pudiste terminar nos ayuda a evitar recomendarte
                                libros similares en género, estilo o longitud. Esto es completamente opcional
                                y puedes continuar sin añadir ninguno.
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
                >
                    Anterior
                </Button>

                <div className="flex space-x-3">
                    {isFirstTime && (
                        <Button
                            variant="outline"
                            onClick={handleNext}
                        >
                            Saltar Paso
                        </Button>
                    )}
                    <Button
                        onClick={handleNext}
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </div>
    );
} 