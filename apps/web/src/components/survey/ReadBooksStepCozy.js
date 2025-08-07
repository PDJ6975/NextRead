'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Star, Trash2, BookOpen } from 'lucide-react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { InputCozy } from '../ui/cozy/InputCozy';
import { BookCozyIcon, StarCozyIcon, SearchCozyIcon, HeartCozyIcon } from '../ui/cozy/IconCozy';
import { bookService } from '../../services/bookService';
import { useDebounce } from '../../hooks/useDebounce';

// Componente de tarjeta de libro para búsqueda
const BookSearchCard = ({ book, onAdd, isAdded = false }) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        setIsAdding(true);
        await onAdd(book);
        setIsAdding(false);
    };

    return (
        <CardCozy variant="soft" className="p-3 border border-cozy-light-gray hover:border-cozy-sage transition-all duration-300">
            <div className="flex gap-3">
                {/* Portada del libro */}
                <div className="flex-shrink-0 w-12 h-16 relative overflow-hidden rounded-md cozy-shadow-sm">
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
                    <div className={`${book.coverUrl ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-b from-cozy-sage to-cozy-forest items-center justify-center`}>
                        <BookCozyIcon className="w-6 h-6 text-white" />
                    </div>
                </div>
                
                {/* Información del libro */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold font-cozy text-cozy-warm-brown text-sm truncate">
                        {book.title}
                    </h4>
                    <p className="text-xs text-cozy-medium-gray font-cozy truncate">
                        {book.authors?.map(author => author.name).join(', ') || book.author || 'Autor desconocido'}
                    </p>
                    
                    {/* Información adicional */}
                    <div className="mt-1 space-y-0.5">
                        {book.publisher && (
                            <p className="text-xs text-cozy-medium-gray truncate">
                                📚 {book.publisher}
                            </p>
                        )}
                        {book.pages && (
                            <p className="text-xs text-cozy-medium-gray">
                                📄 {book.pages} páginas
                            </p>
                        )}
                        {book.publishedYear && (
                            <p className="text-xs text-cozy-medium-gray">
                                📅 {book.publishedYear}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Botón de agregar */}
                <div className="flex-shrink-0">
                    <ButtonCozy
                        variant={isAdded ? "secondary" : "primary"}
                        size="sm"
                        onClick={handleAdd}
                        disabled={isAdding || isAdded}
                        className="w-8 h-8 p-0"
                    >
                        {isAdded ? (
                            <HeartCozyIcon className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                    </ButtonCozy>
                </div>
            </div>
        </CardCozy>
    );
};

// Componente de libro seleccionado con rating
const SelectedBookCard = ({ book, index, onRemove, onRatingChange }) => {
    const [rating, setRating] = useState(book.rating || 0);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        onRatingChange(index, newRating);
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        await onRemove(index);
    };

    return (
        <CardCozy 
            variant="warm" 
            className={`p-4 border border-cozy-sage/30 bg-cozy-sage/5 transition-all duration-300 ${
                isRemoving ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
        >
            <div className="flex gap-3">
                {/* Portada decorativa */}
                <div className="flex-shrink-0 w-16 h-20 relative overflow-hidden rounded-md cozy-shadow-md">
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
                    <div className={`${book.coverUrl ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-b from-cozy-terracotta to-cozy-warm-brown items-center justify-center`}>
                        <BookCozyIcon className="w-8 h-8 text-white" />
                    </div>
                    {/* Pequeño corazón en la esquina */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cozy-sage rounded-full flex items-center justify-center">
                        <HeartCozyIcon className="w-2 h-2 text-white" />
                    </div>
                </div>
                
                {/* Información del libro */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold font-cozy-display text-cozy-warm-brown mb-1">
                        {book.title}
                    </h4>
                    <p className="text-sm text-cozy-medium-gray font-cozy mb-2">
                        {book.authors?.map(author => author.name).join(', ') || book.author || 'Autor desconocido'}
                    </p>
                    
                    {/* Información adicional */}
                    <div className="text-xs text-cozy-medium-gray space-y-0.5 mb-2">
                        {book.publisher && (
                            <p>📚 {book.publisher}</p>
                        )}
                        {book.pages && (
                            <p>📄 {book.pages} páginas</p>
                        )}
                    </div>
                    
                    {/* Sistema de rating con estrellas */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-cozy-warm-brown">Tu valoración:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRatingChange(star === rating ? star - 0.5 : star)}
                                    onDoubleClick={() => handleRatingChange(star - 0.5)}
                                    className="relative transition-all duration-200 hover:scale-110"
                                >
                                    <StarCozyIcon
                                        className={`w-4 h-4 ${
                                            star <= rating
                                                ? 'text-cozy-soft-yellow fill-current'
                                                : star - 0.5 === rating
                                                ? 'text-cozy-soft-yellow'
                                                : 'text-cozy-light-gray'
                                        }`}
                                    />
                                    {/* Media estrella */}
                                    {star - 0.5 === rating && (
                                        <div className="absolute inset-0 overflow-hidden w-1/2">
                                            <StarCozyIcon className="w-4 h-4 text-cozy-soft-yellow fill-current" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <span className="text-xs text-cozy-medium-gray">
                                ({rating}/5)
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Botón de eliminar */}
                <div className="flex-shrink-0">
                    <ButtonCozy
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="w-8 h-8 p-0 text-cozy-medium-gray hover:text-cozy-terracotta"
                    >
                        <Trash2 className="w-5 h-5" />
                    </ButtonCozy>
                </div>
            </div>
        </CardCozy>
    );
};

export function ReadBooksStepCozy({ data, onNext, onPrev, onDataChange }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState(data.readBooks || []);
    const [isSearching, setIsSearching] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Buscar libros cuando cambie la query
    useEffect(() => {
        if (debouncedSearchQuery.trim()) {
            searchBooks(debouncedSearchQuery);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery]);

    const searchBooks = async (query) => {
        setIsSearching(true);
        try {
            const response = await bookService.searchForSurvey(query);
            setSearchResults(response.data || []);
        } catch (error) {
            console.error('Error searching books:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const addBook = async (book) => {
        const isAlreadySelected = selectedBooks.some(selected => {
            // Comparación por ISBN13 si ambos lo tienen
            if (selected.isbn13 && book.isbn13 && selected.isbn13.trim() === book.isbn13.trim()) {
                return true;
            }

            // Comparación por título y primer autor como último recurso
            const selectedTitle = selected.title?.toLowerCase().trim();
            const bookTitle = book.title?.toLowerCase().trim();

            if (selectedTitle && bookTitle && selectedTitle === bookTitle) {
                const selectedAuthor = selected.authors?.[0]?.name?.toLowerCase().trim() || selected.author?.toLowerCase().trim();
                const bookAuthor = book.authors?.[0]?.name?.toLowerCase().trim() || book.author?.toLowerCase().trim();

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
            const bookWithRating = {
                ...book,
                rating: 0,
                status: 'READ'
            };
            
            const newBooks = [...selectedBooks, bookWithRating];
            setSelectedBooks(newBooks);
            onDataChange({ readBooks: newBooks });
        }
        
        // Limpiar búsqueda después de agregar
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeBook = (bookIndex) => {
        const newBooks = selectedBooks.filter((_, index) => index !== bookIndex);
        setSelectedBooks(newBooks);
        onDataChange({ readBooks: newBooks });
    };

    const updateBookRating = (bookIndex, rating) => {
        const newBooks = selectedBooks.map((book, index) =>
            index === bookIndex ? { ...book, rating } : book
        );
        setSelectedBooks(newBooks);
        onDataChange({ readBooks: newBooks });
    };

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNext();
        }, 300);
    };

    const isBookAdded = (book) => {
        return selectedBooks.some(selected => {
            // Comparación por ISBN13 si ambos lo tienen
            if (selected.isbn13 && book.isbn13 && selected.isbn13.trim() === book.isbn13.trim()) {
                return true;
            }

            // Comparación por título y primer autor como último recurso
            const selectedTitle = selected.title?.toLowerCase().trim();
            const bookTitle = book.title?.toLowerCase().trim();

            if (selectedTitle && bookTitle && selectedTitle === bookTitle) {
                const selectedAuthor = selected.authors?.[0]?.name?.toLowerCase().trim() || selected.author?.toLowerCase().trim();
                const bookAuthor = book.authors?.[0]?.name?.toLowerCase().trim() || book.author?.toLowerCase().trim();

                // Si ambos tienen autor, compararlos; si no, considerar solo el título
                if (selectedAuthor && bookAuthor) {
                    return selectedAuthor === bookAuthor;
                } else if (!selectedAuthor && !bookAuthor) {
                    return true; // Mismo título y ambos sin autor
                }
            }

            return false;
        });
    };

    return (
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            {/* Header */}
            <CardCozy variant="magical" className="mb-6 p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold font-cozy-display text-cozy-warm-brown">
                        Tus Libros Favoritos
                    </h3>
                </div>
                <p className="text-cozy-medium-gray font-cozy">
                    Añade algunos libros que hayas leído. Esto nos ayudará a conocer tus gustos.
                </p>
                <div className="mt-3 text-sm text-cozy-sage font-medium">
                    {selectedBooks.length} libro{selectedBooks.length !== 1 ? 's' : ''} añadido{selectedBooks.length !== 1 ? 's' : ''}
                </div>
            </CardCozy>

            {/* Buscador de libros */}
            <CardCozy variant="soft" className="mb-6 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <SearchCozyIcon className="w-6 h-6 text-cozy-sage" />
                    <h4 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown">
                        Buscar libros
                    </h4>
                </div>
                
                <div className="relative">
                    <InputCozy
                        type="text"
                        placeholder="Escribe el título o autor de un libro que hayas leído..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cozy-medium-gray" />
                    
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-cozy-sage border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Resultados de búsqueda */}
                {searchResults.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                        <p className="text-sm font-medium text-cozy-warm-brown mb-2">
                            Resultados de búsqueda:
                        </p>
                        {searchResults.map((book, index) => (
                            <BookSearchCard
                                key={book.isbn13 || book.title || index}
                                book={book}
                                onAdd={addBook}
                                isAdded={isBookAdded(book)}
                            />
                        ))}
                    </div>
                )}

                {searchQuery && !isSearching && searchResults.length === 0 && (
                    <div className="mt-4 text-center py-8">
                        <BookCozyIcon className="w-12 h-12 text-cozy-light-gray mx-auto mb-2" />
                        <p className="text-cozy-medium-gray font-cozy">
                            No encontramos libros con "{searchQuery}"
                        </p>
                        <p className="text-sm text-cozy-light-gray mt-1">
                            Intenta con otro título o autor
                        </p>
                    </div>
                )}
            </CardCozy>

            {/* Libros seleccionados */}
            {selectedBooks.length > 0 && (
                <CardCozy variant="warm" className="mb-6 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <HeartCozyIcon className="w-6 h-6 text-cozy-terracotta" />
                        <h4 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown">
                            Tus libros favoritos ({selectedBooks.length})
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedBooks.map((book, index) => (
                            <SelectedBookCard
                                key={`${book.title}-${index}`}
                                book={book}
                                index={index}
                                onRemove={removeBook}
                                onRatingChange={updateBookRating}
                            />
                        ))}
                    </div>
                </CardCozy>
            )}

            {/* Estado vacío */}
            {selectedBooks.length === 0 && !searchQuery && (
                <CardCozy variant="soft" className="mb-6 p-8 text-center">
                    <BookCozyIcon className="w-16 h-16 text-cozy-light-gray mx-auto mb-4" />
                    <h4 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown mb-2">
                        ¡Comienza tu biblioteca!
                    </h4>
                    <p className="text-cozy-medium-gray font-cozy">
                        Busca y añade algunos libros que hayas leído y disfrutado.
                        No te preocupes, puedes añadir más libros después.
                    </p>
                </CardCozy>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between items-center">
                <ButtonCozy
                    variant="ghost"
                    onClick={onPrev}
                    className="min-w-32"
                >
                    <span className="flex items-center gap-2">
                        ← Anterior
                    </span>
                </ButtonCozy>

                <ButtonCozy
                    variant="primary"
                    size="lg"
                    onClick={handleNext}
                    className="min-w-48 cozy-shadow-lg hover:scale-105 transition-all duration-300"
                >
                    <span className="flex items-center gap-2">
                        Continuar
                        <StarCozyIcon className="w-5 h-5" />
                    </span>
                </ButtonCozy>
            </div> 

            {/* Nota informativa */}
            <div className="mt-6 text-center">
                <p className="text-sm text-cozy-medium-gray font-cozy">
                    💡 Tip: Puedes saltar este paso si prefieres añadir libros más tarde
                </p>
            </div>
        </div>
    );
}
