import { useState, useRef, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { IconCozy } from './cozy/IconCozy';

export function MiniBookSearchCozy({ onBookSelect, placeholder = 'Buscar libro...', disabledBooks = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(0);
  const inputRef = useRef(null);
  const resultsPerPage = 2;
  const debouncedQuery = useDebounce(query, 400);
  // Flag para evitar que el useEffect vuelva a disparar la búsqueda tras limpiar
  const skipNextEffect = useRef(false);

  useEffect(() => {
    if (skipNextEffect.current) {
      skipNextEffect.current = false;
      return;
    }
    if (debouncedQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setError('');
      setPage(0);
      return;
    }
    setIsLoading(true);
    setError('');
    import('../../services/bookService').then(({ bookService }) => {
      bookService.searchBooks(debouncedQuery.trim()).then(res => {
        let books = res.data || [];
        // Solo mostrar libros con isbn10 y isbn13
        books = books.filter(b => b.isbn10 && b.isbn13);
        // Filtrar por ISBN si ya está en la biblioteca
        if (disabledBooks.length > 0) {
          books = books.filter(b => !disabledBooks.some(db => db.isbn13 && db.isbn13 === b.isbn13));
        }
        setResults(books);
        setShowDropdown(books.length > 0);
        setPage(0);
        if (books.length === 0) setError('Sin resultados');
      }).catch(() => {
        setError('Error al buscar');
        setResults([]);
        setShowDropdown(false);
        setPage(0);
      }).finally(() => setIsLoading(false));
    });
  }, [debouncedQuery, disabledBooks]);

  const handleSelect = (book) => {
    skipNextEffect.current = true;
    setQuery('');
    setShowDropdown(false);
    setResults([]);
    setPage(0);
    setError('');
    if (onBookSelect) onBookSelect(book);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const pagedResults = results.slice(page * resultsPerPage, (page + 1) * resultsPerPage);
  const canPageBack = page > 0;
  const canPageNext = (page + 1) * resultsPerPage < results.length;

  return (
    <div className="relative w-full">
      {/* Input de búsqueda cozy */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-cozy-medium-gray" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-10 pr-10 py-3 border-2 border-cozy-light-gray rounded-lg bg-cozy-white text-cozy-dark-gray placeholder-cozy-medium-gray focus:outline-none focus:ring-2 focus:ring-cozy-sage/50 focus:border-cozy-sage transition-all duration-200 font-nunito"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <IconCozy name="loading" size="sm" className="text-cozy-sage animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown de resultados cozy */}
      {showDropdown && (
        <div className="absolute left-0 mt-2 w-full z-20 bg-cozy-white border-2 border-cozy-sage/20 rounded-xl shadow-lg backdrop-blur-sm min-w-[220px] max-w-[340px] overflow-hidden">
          {/* Resultados */}
          <div className="flex flex-col">
            {pagedResults.map((book, idx) => {
              const coverUrl = book.coverUrl || 'https://placehold.co/32x48?text=📚';
              return (
                <button
                  key={book.id || idx}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left border-b last:border-b-0 border-cozy-light-gray/50 transition-all duration-200 hover:bg-cozy-sage/5 hover:border-cozy-sage/20 group"
                  onClick={() => handleSelect(book)}
                  tabIndex={0}
                >
                  {/* Portada del libro */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={coverUrl} 
                      alt="portada" 
                      className="w-10 h-14 object-cover rounded-sm border border-cozy-light-gray bg-cozy-cream shadow-sm group-hover:shadow-md transition-shadow duration-200" 
                    />
                    <div className="absolute -top-1 -right-1">
                      <IconCozy name="book" size="xs" className="text-cozy-sage opacity-70" />
                    </div>
                  </div>
                  
                  {/* Información del libro */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="font-semibold text-cozy-dark-gray truncate max-w-[140px] font-nunito text-sm group-hover:text-cozy-forest transition-colors duration-200">
                      {book.title}
                    </div>
                    {book.authors && book.authors.length > 0 && (
                      <div className="text-cozy-medium-gray truncate max-w-[140px] font-nunito text-xs mt-0.5">
                        {book.authors.map(a => a.name).join(', ')}
                      </div>
                    )}
                    {book.publisher && (
                      <div className="text-cozy-medium-gray/70 truncate max-w-[140px] font-nunito text-xs mt-0.5">
                        {book.publisher}
                      </div>
                    )}
                  </div>

                  {/* Indicador de añadir */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <IconCozy name="heart" size="sm" className="text-cozy-terracotta" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controles de paginación cozy */}
          <div className="flex flex-row justify-between items-center border-t border-cozy-light-gray bg-cozy-cream/30 px-2 py-1">
            <button
              className="p-2 text-cozy-medium-gray hover:text-cozy-sage hover:bg-cozy-sage/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-sm transition-all duration-200"
              onClick={() => canPageBack && setPage(page - 1)}
              disabled={!canPageBack}
              tabIndex={-1}
              aria-label="Anterior"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            
            {/* Contador de resultados */}
            <span className="text-xs text-cozy-medium-gray font-nunito">
              {results.length > 0 && `${page * resultsPerPage + 1}-${Math.min((page + 1) * resultsPerPage, results.length)} de ${results.length}`}
            </span>
            
            <button
              className="p-2 text-cozy-medium-gray hover:text-cozy-sage hover:bg-cozy-sage/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-sm transition-all duration-200"
              onClick={() => canPageNext && setPage(page + 1)}
              disabled={!canPageNext}
              tabIndex={-1}
              aria-label="Siguiente"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de error cozy */}
      {error && query.length > 1 && !isLoading && (
        <div className="absolute left-0 mt-2 w-full z-20 bg-cozy-white border-2 border-cozy-terracotta/20 rounded-lg shadow-md">
          <div className="px-4 py-3 flex items-center space-x-2">
            <IconCozy name="heart" size="sm" className="text-cozy-terracotta" />
            <span className="text-sm text-cozy-medium-gray font-nunito">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
