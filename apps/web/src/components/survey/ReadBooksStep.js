import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { BookSearchForm } from '../ui/BookSearchForm';
import { BookCard } from '../ui/BookCard';
import { StarRating } from '../ui/StarRating';
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

export function ReadBooksStep({
    onNext,
    onBack,
    initialData = {},
    isFirstTime = true
}) {
    const [readBooks, setReadBooks] = useState(initialData.readBooks || []);
    const [error, setError] = useState('');

    const handleBookSelect = (book) => {
        const isAlreadySelected = readBooks.some(selected => {
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
            setReadBooks(prev => [...prev, {
                ...book,
                rating: 0,
                status: 'READ'
            }]);
        }
        setError('');
    };

    const handleRatingChange = (bookIndex, rating) => {
        setReadBooks(prev => prev.map((book, index) =>
            index === bookIndex ? { ...book, rating } : book
        ));
    };

    const handleRemoveBook = (bookIndex) => {
        setReadBooks(prev => prev.filter((_, index) => index !== bookIndex));
    };

    const handleNext = () => {
        if (isFirstTime && readBooks.length === 0) {
            setError('Por favor añade al menos un libro que hayas leído');
            return;
        }

        // Validar que todos los libros tengan rating si es primera vez
        if (isFirstTime) {
            const booksWithoutRating = readBooks.filter(book => !book.rating || book.rating === 0);
            if (booksWithoutRating.length > 0) {
                setError('Por favor valora todos los libros que has añadido');
                return;
            }
        }

        setError('');

        if (onNext) {
            onNext({
                readBooks: readBooks
            });
        }
    };

    const canProceed = !isFirstTime || (readBooks.length > 0 && readBooks.every(book => book.rating > 0));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Libros que has Leído
                </h2>
                <p className="text-gray-600">
                    {isFirstTime
                        ? 'Añade algunos libros que hayas leído y valóralos para mejorar tus recomendaciones'
                        : 'Puedes añadir más libros a tu historial (opcional)'
                    }
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Book Search */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Buscar Libros
                    </h3>
                    <p className="text-sm text-gray-600">
                        Busca y añade libros que hayas leído recientemente
                    </p>
                </CardHeader>
                <CardContent>
                    <BookSearchForm
                        onBookSelect={handleBookSelect}
                        selectedBooks={readBooks}
                        searchType="survey"
                        placeholder="Buscar libros que hayas leído..."
                    />
                </CardContent>
            </Card>

            {/* Selected Books */}
            {readBooks.length > 0 && (
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Libros Seleccionados ({readBooks.length})
                        </h3>
                        <p className="text-sm text-gray-600">
                            {isFirstTime
                                ? 'Valora cada libro para obtener mejores recomendaciones'
                                : 'Puedes actualizar las valoraciones'
                            }
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {readBooks.map((book, index) => (
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

                                        {/* Rating */}
                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Tu valoración {isFirstTime && <span className="text-red-500">*</span>}
                                            </label>
                                            <StarRating
                                                rating={book.rating || 0}
                                                onChange={(rating) => handleRatingChange(index, rating)}
                                                size="sm"
                                            />
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
            {readBooks.length === 0 && (
                <Card>
                    <CardContent>
                        <div className="text-center py-8">
                            <div className="text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {isFirstTime ? 'Añade tus primeros libros' : 'No has añadido libros aún'}
                                </h3>
                                <p className="text-gray-500">
                                    {isFirstTime
                                        ? 'Busca y añade algunos libros que hayas leído para comenzar'
                                        : 'Puedes añadir libros más tarde desde tu perfil'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={onBack}
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