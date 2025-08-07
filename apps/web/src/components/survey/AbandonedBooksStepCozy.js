'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Clock, SkipForward } from 'lucide-react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { InputCozy } from '../ui/cozy/InputCozy';
import { BookCozyIcon, StarCozyIcon, SearchCozyIcon, ClockCozyIcon, SadCozyIcon } from '../ui/cozy/IconCozy';
import { bookService } from '../../services/bookService';
import { useDebounce } from '../../hooks/useDebounce';

// Razones comunes para abandonar libros
const abandonReasons = [
    { id: 'TOO_SLOW', label: 'Muy lento', emoji: '🐌', color: 'cozy-sage' },
    { id: 'TOO_COMPLEX', label: 'Muy complejo', emoji: '🤯', color: 'cozy-terracotta' },
    { id: 'LOST_INTEREST', label: 'Perdí interés', emoji: '😴', color: 'cozy-soft-yellow' },
    { id: 'BORING', label: 'Aburrido', emoji: '😑', color: 'cozy-medium-gray' },
    { id: 'BAD_TIMING', label: 'Mal momento', emoji: '⏰', color: 'cozy-lavender' },
    { id: 'OTHER', label: 'Otro motivo', emoji: '💭', color: 'cozy-mint' }
];

// Componente de tarjeta de libro para búsqueda
const BookSearchCard = ({ book, onAdd, isAdded = false }) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        setIsAdding(true);
        await onAdd(book);
        setIsAdding(false);
    };

    return (
        <CardCozy variant="soft" className="p-3 border border-cozy-light-gray hover:border-cozy-soft-yellow transition-all duration-300">
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
                    <div className={`${book.coverUrl ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-b from-cozy-soft-yellow to-cozy-terracotta items-center justify-center`}>
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
                            <ClockCozyIcon className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                    </ButtonCozy>
                </div>
            </div>
        </CardCozy>
    );
};

// Componente de libro abandonado con razón
const AbandonedBookCard = ({ book, index, onRemove, onReasonChange }) => {
    const [selectedReason, setSelectedReason] = useState(book.reason || '');
    const [isRemoving, setIsRemoving] = useState(false);

    const handleReasonChange = (reason) => {
        setSelectedReason(reason);
        onReasonChange(index, reason);
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        await onRemove(index);
    };

    return (
        <CardCozy 
            variant="warm" 
            className={`p-4 border border-cozy-soft-yellow/30 bg-cozy-soft-yellow/5 transition-all duration-300 ${
                isRemoving ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
        >
            <div className="space-y-3">
                {/* Información del libro */}
                <div className="flex gap-3">
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
                        <div className={`${book.coverUrl ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-b from-cozy-soft-yellow to-cozy-medium-gray items-center justify-center`}>
                            <BookCozyIcon className="w-8 h-8 text-white" />
                        </div>
                        {/* Pequeño reloj en la esquina */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cozy-soft-yellow rounded-full flex items-center justify-center">
                            <ClockCozyIcon className="w-2 h-2 text-cozy-warm-brown" />
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold font-cozy-display text-cozy-warm-brown mb-1">
                            {book.title}
                        </h4>
                        <p className="text-sm text-cozy-medium-gray font-cozy">
                            {book.authors?.map(author => author.name).join(', ') || book.author || 'Autor desconocido'}
                        </p>
                        
                        {/* Información adicional */}
                        <div className="text-xs text-cozy-medium-gray space-y-0.5 mt-1">
                            {book.publisher && (
                                <p>📚 {book.publisher}</p>
                            )}
                            {book.pages && (
                                <p>📄 {book.pages} páginas</p>
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
                            className="w-10 h-10 p-0 text-cozy-medium-gray hover:text-cozy-terracotta transition-all duration-200 hover:scale-110"
                        >
                            <Trash2 className="w-6 h-6" />
                        </ButtonCozy>
                    </div>
                </div>

                {/* Selector de razón */}
                <div>
                    <p className="text-xs font-medium text-cozy-warm-brown mb-2">
                        ¿Por qué lo pausaste?
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                        {abandonReasons.map((reason) => (
                            <button
                                key={reason.id}
                                onClick={() => handleReasonChange(reason.id)}
                                className={`text-xs p-2 rounded-lg border transition-all duration-200 ${
                                    selectedReason === reason.id
                                        ? `border-${reason.color} bg-${reason.color}/10 text-cozy-warm-brown`
                                        : 'border-cozy-light-gray text-cozy-medium-gray hover:border-cozy-medium-gray'
                                }`}
                            >
                                <div className="text-base mb-1">{reason.emoji}</div>
                                <div className="font-cozy">{reason.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </CardCozy>
    );
};

export function AbandonedBooksStepCozy({ data, onNext, onPrev, onDataChange }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [abandonedBooks, setAbandonedBooks] = useState(data.abandonedBooks || []);
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
        const isAlreadySelected = abandonedBooks.some(selected => {
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
            const bookWithoutReason = {
                ...book,
                reason: '',
                status: 'ABANDONED'
            };
            
            const newBooks = [...abandonedBooks, bookWithoutReason];
            setAbandonedBooks(newBooks);
            onDataChange({ abandonedBooks: newBooks });
        }
        
        // Limpiar búsqueda después de agregar
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeBook = (bookIndex) => {
        const newBooks = abandonedBooks.filter((_, index) => index !== bookIndex);
        setAbandonedBooks(newBooks);
        onDataChange({ abandonedBooks: newBooks });
    };

    const updateBookReason = (bookIndex, reason) => {
        const newBooks = abandonedBooks.map((book, index) =>
            index === bookIndex ? { ...book, reason } : book
        );
        setAbandonedBooks(newBooks);
        onDataChange({ abandonedBooks: newBooks });
    };

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNext();
        }, 300);
    };

    const handleSkip = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNext();
        }, 300);
    };

    const isBookAdded = (book) => {
        return abandonedBooks.some(abandoned => {
            // Comparación por ISBN13 si ambos lo tienen
            if (abandoned.isbn13 && book.isbn13 && abandoned.isbn13.trim() === book.isbn13.trim()) {
                return true;
            }

            // Comparación por título y primer autor como último recurso
            const abandonedTitle = abandoned.title?.toLowerCase().trim();
            const bookTitle = book.title?.toLowerCase().trim();

            if (abandonedTitle && bookTitle && abandonedTitle === bookTitle) {
                const abandonedAuthor = abandoned.authors?.[0]?.name?.toLowerCase().trim() || abandoned.author?.toLowerCase().trim();
                const bookAuthor = book.authors?.[0]?.name?.toLowerCase().trim() || book.author?.toLowerCase().trim();

                // Si ambos tienen autor, compararlos; si no, considerar solo el título
                if (abandonedAuthor && bookAuthor) {
                    return abandonedAuthor === bookAuthor;
                } else if (!abandonedAuthor && !bookAuthor) {
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
                    <ClockCozyIcon className="w-8 h-8 text-cozy-soft-yellow" />
                    <h3 className="text-2xl font-bold font-cozy-display text-cozy-warm-brown">
                        Libros Pausados
                    </h3>
                </div>
                <p className="text-cozy-medium-gray font-cozy mb-2">
                    ¿Hay libros que empezaste pero no terminaste? Añádelos aquí para mejorar nuestras recomendaciones.
                </p>
                <div className="text-sm text-cozy-soft-yellow font-medium bg-cozy-soft-yellow/10 px-3 py-1 rounded-full inline-block">
                    Paso opcional - {abandonedBooks.length} libro{abandonedBooks.length !== 1 ? 's' : ''} añadido{abandonedBooks.length !== 1 ? 's' : ''}
                </div>
            </CardCozy>

            {/* Buscador de libros */}
            <CardCozy variant="soft" className="mb-6 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <SearchCozyIcon className="w-6 h-6 text-cozy-soft-yellow" />
                    <h4 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown">
                        Buscar libros que pausaste
                    </h4>
                </div>
                
                <div className="relative">
                    <InputCozy
                        type="text"
                        placeholder="Busca libros que empezaste pero no terminaste..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cozy-medium-gray" />
                    
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-cozy-soft-yellow border-t-transparent rounded-full animate-spin" />
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
                        <SadCozyIcon className="w-12 h-12 text-cozy-light-gray mx-auto mb-2" />
                        <p className="text-cozy-medium-gray font-cozy">
                            No encontramos libros con "{searchQuery}"
                        </p>
                    </div>
                )}
            </CardCozy>

            {/* Libros abandonados */}
            {abandonedBooks.length > 0 && (
                <CardCozy variant="warm" className="mb-6 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <ClockCozyIcon className="w-6 h-6 text-cozy-soft-yellow" />
                        <h4 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown">
                            Libros pausados ({abandonedBooks.length})
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {abandonedBooks.map((book, index) => (
                            <AbandonedBookCard
                                key={`${book.title}-${index}`}
                                book={book}
                                index={index}
                                onRemove={removeBook}
                                onReasonChange={updateBookReason}
                            />
                        ))}
                    </div>
                </CardCozy>
            )}

            {/* Estado vacío */}
            {abandonedBooks.length === 0 && !searchQuery && (
                <CardCozy variant="soft" className="mb-6 p-8 text-center">
                    <ClockCozyIcon className="w-16 h-16 text-cozy-light-gray mx-auto mb-4" />
                    <h4 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown mb-2">
                        ¿Algún libro pausado?
                    </h4>
                    <div className="bg-cozy-mint/10 border border-cozy-mint/30 rounded-lg p-4 text-sm text-cozy-medium-gray">
                        💡 <strong>Recuerda:</strong> Este paso es completamente opcional. 
                        Puedes saltarlo y continuar sin problema.
                    </div>
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

                <div className="flex gap-3">
                    <ButtonCozy
                        variant="ghost"
                        onClick={handleSkip}
                        className="min-w-32"
                    >
                        <span className="flex items-center gap-2">
                            <SkipForward className="w-4 h-4" />
                            Saltar
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
            </div>

            {/* Nota informativa */}
            <div className="mt-6 text-center">
                <p className="text-sm text-cozy-medium-gray font-cozy">
                    ⏰ No te preocupes, entender qué no te gustó también es valioso
                </p>
            </div>
        </div>
    );
}
