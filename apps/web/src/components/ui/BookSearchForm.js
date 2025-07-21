import { useState, useEffect, useCallback } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { BookCard } from './BookCard';
import { useDebounce } from '../../hooks/useDebounce';

export function BookSearchForm({
    onBookSelect,
    selectedBooks = [],
    searchType = 'basic', // 'basic' | 'survey'
    placeholder = 'Buscar libros por título...',
    showRating = false,
    showStatus = false
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    // Debounce la query de búsqueda para búsqueda dinámica
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Función de búsqueda optimizada
    const performSearch = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            setError('');
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setError('');
        setHasSearched(true);

        try {
            // Importar dinámicamente el servicio para evitar problemas de SSR
            const { bookService } = await import('../../services/bookService');

            let response;
            if (searchType === 'survey') {
                response = await bookService.searchForSurvey(query.trim());
            } else {
                response = await bookService.searchBooks(query.trim());
            }

            setSearchResults(response.data || []);

            if (!response.data || response.data.length === 0) {
                setError('No se encontraron libros con ese título');
            }
        } catch (error) {
            console.error('Error al buscar libros:', error);
            setError('Error al buscar libros. Inténtalo de nuevo.');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchType]);

    // Efecto para búsqueda dinámica
    useEffect(() => {
        performSearch(debouncedSearchQuery);
    }, [debouncedSearchQuery, performSearch]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            performSearch(searchQuery.trim());
        }
    };

    const handleBookSelect = (book) => {
        if (onBookSelect) {
            onBookSelect(book);
        }
    };

    const isBookSelected = useCallback((book) => {
        if (!selectedBooks || selectedBooks.length === 0) return false;

        return selectedBooks.some(selected => {
            // Comparación por ID si ambos lo tienen y son números válidos
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
    }, [selectedBooks]);

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setError('');
        setHasSearched(false);
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            error={error}
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>
                    {(searchResults.length > 0 || error || hasSearched) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearSearch}
                        >
                            Limpiar
                        </Button>
                    )}
                </div>
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                    <p className="text-sm text-gray-500">
                        Escribe al menos 2 caracteres para buscar...
                    </p>
                )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Resultados de búsqueda ({searchResults.length})
                        </h3>
                        {searchResults.length > 1 && (
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                💡 Varias ediciones disponibles
                            </div>
                        )}
                    </div>

                    {/* Nota educativa para múltiples ediciones */}
                    {searchResults.length > 1 && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">
                                <span className="font-medium">📚 Diferentes ediciones:</span> Los libros pueden tener múltiples ediciones con diferentes editoriales, años o portadas. Elige la edición que más se parezca a la que leíste.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {searchResults.map((book, index) => (
                            <BookCard
                                key={book.id || `${book.title}-${index}`}
                                book={book}
                                onSelect={handleBookSelect}
                                isSelected={isBookSelected(book)}
                                showRating={showRating}
                                showStatus={showStatus}
                                variant="default"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Books Summary */}
            {selectedBooks.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Libros seleccionados ({selectedBooks.length})
                    </h4>
                    <div className="space-y-2">
                        {selectedBooks.slice(0, 3).map((book, index) => (
                            <div key={book.id || index} className="text-sm text-blue-800">
                                • {book.title}
                                {book.authors && book.authors.length > 0 && (
                                    <span className="text-blue-600">
                                        {' '}por {book.authors.map(a => a.name).join(', ')}
                                    </span>
                                )}
                            </div>
                        ))}
                        {selectedBooks.length > 3 && (
                            <div className="text-sm text-blue-600">
                                ... y {selectedBooks.length - 3} más
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && searchResults.length === 0 && hasSearched && searchQuery.length >= 2 && (
                <div className="text-center py-8">
                    <div className="text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
                        <p className="text-gray-500">
                            Intenta con otro término de búsqueda o verifica la ortografía.
                        </p>
                    </div>
                </div>
            )}

            {/* Help Text */}
            {!searchQuery && (
                <div className="text-center py-8">
                    <div className="text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Busca tus libros</h3>
                        <p className="text-gray-500">
                            Comienza a escribir el título del libro y los resultados aparecerán automáticamente.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
} 