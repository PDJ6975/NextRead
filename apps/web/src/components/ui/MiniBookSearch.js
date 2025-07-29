import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

export function MiniBookSearch({ onBookSelect, placeholder = 'Buscar libro...', disabledBooks = [] }) {
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
      <input
        ref={inputRef}
        type="text"
        className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
        autoComplete="off"
      />
      {isLoading && (
        <span className="absolute right-2 top-1.5 w-4 h-4 animate-spin border-b-2 border-blue-500 rounded-full"></span>
      )}
      {showDropdown && (
        <div className="absolute left-0 mt-1 w-full z-20 bg-white border border-gray-200 rounded shadow-lg min-w-[220px] max-w-[340px] overflow-hidden">
          <div className="flex flex-col">
            {pagedResults.map((book, idx) => {
              const coverUrl = book.coverUrl || 'https://placehold.co/32x48?text=+';
              return (
                <button
                  key={book.id || idx}
                  className="w-full px-2 py-2 flex items-center gap-2 text-left text-xs border-b last:border-b-0 border-gray-100 transition hover:bg-blue-50"
                  onClick={() => handleSelect(book)}
                  tabIndex={0}
                >
                  <img src={coverUrl} alt="portada" className="w-8 h-12 object-cover rounded border border-gray-200 bg-gray-50 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <div className="font-semibold truncate max-w-[140px]">{book.title}</div>
                    {book.authors && book.authors.length > 0 && (
                      <div className="text-gray-500 truncate max-w-[140px]">{book.authors.map(a => a.name).join(', ')}</div>
                    )}
                    {book.publisher && (
                      <div className="text-gray-400 truncate max-w-[140px]">{book.publisher}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex flex-row justify-between border-t border-gray-100 bg-gray-50">
            <button
              className="px-2 py-1 text-gray-500 hover:text-blue-600 disabled:opacity-30"
              onClick={() => canPageBack && setPage(page - 1)}
              disabled={!canPageBack}
              tabIndex={-1}
              aria-label="Anterior"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M7 14l5-5 5 5"/></svg>
            </button>
            <button
              className="px-2 py-1 text-gray-500 hover:text-blue-600 disabled:opacity-30"
              onClick={() => canPageNext && setPage(page + 1)}
              disabled={!canPageNext}
              tabIndex={-1}
              aria-label="Siguiente"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 10l-5 5-5-5"/></svg>
            </button>
          </div>
        </div>
      )}
      {error && query.length > 1 && !isLoading && (
        <div className="absolute left-0 mt-1 w-full z-20 bg-white border border-gray-200 rounded shadow text-xs text-gray-500 px-2 py-1">{error}</div>
      )}
    </div>
  );
}
