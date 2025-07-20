import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { BookCard } from './BookCard';

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

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setError('Por favor ingresa un término de búsqueda');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Importar dinámicamente el servicio para evitar problemas de SSR
            const { bookService } = await import('../../services/bookService');

            let response;
            if (searchType === 'survey') {
                response = await bookService.searchForSurvey(searchQuery.trim());
            } else {
                response = await bookService.searchBooks(searchQuery.trim());
            }

            setSearchResults(response.data || []);

            if (!response.data || response.data.length === 0) {
                setError('No se encontraron libros con ese título');
            }
        } catch (error) {
            console.error('Error al buscar libros:', error);
            setError('Error al buscar libros. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookSelect = (book) => {
        if (onBookSelect) {
            onBookSelect(book);
        }
    };

    const isBookSelected = (book) => {
        return selectedBooks.some(selected =>
            selected.id === book.id ||
            (selected.isbn13 && book.isbn13 && selected.isbn13 === book.isbn13) ||
            (selected.title === book.title && selected.authors?.[0]?.name === book.authors?.[0]?.name)
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setError('');
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            error={error}
                        />
                    </div>
                    <Button
                        type="submit"
                        loading={isLoading}
                        disabled={!searchQuery.trim()}
                    >
                        {isLoading ? 'Buscando...' : 'Buscar'}
                    </Button>
                    {(searchResults.length > 0 || error) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearSearch}
                        >
                            Limpiar
                        </Button>
                    )}
                </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Resultados de búsqueda ({searchResults.length})
                    </h3>
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
            {!isLoading && searchResults.length === 0 && !error && searchQuery && (
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
                            Escribe el título del libro que quieres encontrar y presiona buscar.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
} 