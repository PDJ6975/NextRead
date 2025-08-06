'use client';

import { X, Plus, Sparkles, Book, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MiniBookSearchCozy } from '../ui/MiniBookSearchCozy';
import userBookService from '../../services/userBookService';
import { bookService } from '../../services/bookService';
import { CardCozy } from '../ui/cozy/CardCozy';
import { ButtonCozy, BookCardCozy } from '../ui/cozy';
import { BookCozyIcon, HeartCozyIcon, StarCozyIcon, LoadingCozyIcon, PendingCozyIcon, CheckMarkCozyIcon, PauseCozyIcon } from '../ui/cozy/IconCozy';

export default function UserLibrarySectionCozy({ recommendations = [], onRecommendationAdded }) {
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null); // Para el modal de detalles del libro
  const [userBooks, setUserBooks] = useState([]);
  const [booksDetails, setBooksDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingBookId, setUpdatingBookId] = useState(null);
  const [addingBook, setAddingBook] = useState(false);
  const [activeShelf, setActiveShelf] = useState('TO_READ'); // Estantería activa

  // Función para manejar la vista de detalles del libro
  const handleViewBook = (book) => {
    setSelectedBook(book);
  };

  // Añadir libro manualmente a POR_LEER
  const handleAddBookToRead = async (book) => {
    if (userBooks.some(ub => ub.bookId === book.id)) return;
    setAddingBook(true);
    try {
      const added = await userBookService.addBook(book, { status: 'TO_READ' });
      setUserBooks(prev => [...prev, added]);
      setBooksDetails(prev => ({ ...prev, [added.bookId]: book }));
    } catch (e) {
      setError('No se pudo añadir el libro');
    } finally {
      setAddingBook(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await userBookService.getUserBooks();
      setUserBooks(data);
      
      const detailsPromises = data.map(async (ub) => {
        try {
          const book = await bookService.getBook(ub.bookId);
          return [ub.bookId, book];
        } catch (e) {
          return [ub.bookId, null];
        }
      });
      const detailsArr = await Promise.all(detailsPromises);
      const detailsObj = Object.fromEntries(detailsArr);
      setBooksDetails(detailsObj);
    } catch (err) {
      setError('No se pudo cargar tu biblioteca');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Mover libro de sección
  const handleMoveBook = async (userBook, newStatus) => {
    setUpdatingBookId(userBook.id);
    setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, status: newStatus } : ub));
    try {
      await userBookService.updateBook(userBook.id, { status: newStatus });
    } catch (e) {
      setError('No se pudo actualizar el estado del libro');
      setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, status: userBook.status } : ub));
    } finally {
      setUpdatingBookId(null);
    }
  };

  // Valorar libro leído
  const handleRateBook = async (userBook, rating) => {
    setUpdatingBookId(userBook.id);
    setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, rating } : ub));
    try {
      await userBookService.updateBook(userBook.id, { rating });
    } catch (e) {
      setError('No se pudo guardar la valoración');
      setUserBooks(prev => prev.map(ub => ub.id === userBook.id ? { ...ub, rating: userBook.rating } : ub));
    } finally {
      setUpdatingBookId(null);
    }
  };

  // Función para añadir recomendación a la biblioteca
  const handleAddRecommendationToLibrary = async (recommendation) => {
    try {
      const bookData = {
        title: recommendation.title,
        authors: Array.isArray(recommendation.authors) && recommendation.authors.length > 0
          ? recommendation.authors.map(a => typeof a === 'string' ? { name: a } : a)
          : [{ name: 'Autor por determinar' }],
        coverUrl: recommendation.coverUrl,
        synopsis: recommendation.reason,
        publisher: recommendation.publisher,
        isbn10: recommendation.isbn10,
        isbn13: recommendation.isbn13,
        pages: recommendation.pages,
        publishedYear: recommendation.publishedYear
      };
      const userBookData = { status: 'TO_READ' };
      const added = await userBookService.addBook(bookData, userBookData);

      setUserBooks(prev => [...prev, added]);
      setBooksDetails(prev => ({ ...prev, [added.bookId]: bookData }));

      if (typeof onRecommendationAdded === 'function') {
        onRecommendationAdded(recommendation);
      }
    } catch (e) {
      setError('No se pudo añadir la recomendación');
      console.error('Error adding recommendation:', e);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <CardCozy variant="dreamy" className="p-6">
        <div className="text-center">
          <LoadingCozyIcon className="w-8 h-8 mx-auto mb-2 text-cozy-sage" />
          <p className="text-cozy-dark-gray font-cozy text-sm">
            Explorando tu biblioteca mágica...
          </p>
        </div>
      </CardCozy>
    </div>
  );

  if (error) return (
    <CardCozy variant="warm" className="my-8">
      <div className="p-6 text-center">
        <p className="text-cozy-terracotta font-cozy font-medium">{error}</p>
      </div>
    </CardCozy>
  );

  if (!userBooks.length) return (
    <CardCozy variant="dreamy" className="my-8">
      <div className="p-12 text-center">
        {/* SVG de estantería vacía */}
        <div className="mb-6">
          <svg className="w-24 h-24 mx-auto text-cozy-sage opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-cozy-warm-brown font-cozy-display mb-2">
          📚 Tu biblioteca está esperando
        </h3>
        
        <p className="text-cozy-dark-gray font-cozy mb-4 max-w-md mx-auto">
          Aún no has añadido ningún libro a tu biblioteca personal. ¡Comienza explorando nuestras recomendaciones mágicas!
        </p>
        
        <p className="text-sm text-cozy-medium-gray font-cozy">
          💡 Consejo: Completa la encuesta para obtener recomendaciones personalizadas
        </p>
      </div>
    </CardCozy>
  );

  // Agrupar libros por estado
  const porLeerBooks = userBooks.filter((ub) => ub.status === 'TO_READ');
  const leidoBooks = userBooks.filter((ub) => ub.status === 'READ');
  const pausadoBooks = userBooks.filter((ub) => ub.status === 'ABANDONED');

  // Configuración de estanterías
  const shelves = [
    {
      key: 'TO_READ',
      title: 'Por leer',
      icon: PendingCozyIcon,
      books: porLeerBooks,
      color: 'cozy-sage',
      bgClass: 'bg-cozy-sage/10',
      borderClass: 'border-cozy-sage/30',
      textClass: 'text-cozy-sage'
    },
    {
      key: 'READ',
      title: 'Leídos',
      icon: CheckMarkCozyIcon,
      books: leidoBooks,
      color: 'cozy-forest',
      bgClass: 'bg-cozy-forest/10',
      borderClass: 'border-cozy-forest/30',
      textClass: 'text-cozy-forest'
    },
    {
      key: 'ABANDONED',
      title: 'Pausados',
      icon: PauseCozyIcon,
      books: pausadoBooks,
      color: 'cozy-forest',
      bgClass: 'bg-cozy-forest/10',
      borderClass: 'border-cozy-forest/30',
      textClass: 'text-cozy-forest'
    }
  ];

  const activeShelfData = shelves.find(s => s.key === activeShelf) || shelves[0];

  // Generar placeholder SVG para biblioteca vacía
  const getEmptyShelfSvg = (shelfColor) => {
    const svg = `
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="wood" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#8D5524"/>
            <rect x="2" y="2" width="16" height="16" fill="#A0622D" opacity="0.8"/>
            <line x1="0" y1="10" x2="20" y2="10" stroke="#7A4B1F" stroke-width="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="300" height="200" fill="#F7F5F3"/>
        <rect x="10" y="30" width="280" height="15" fill="url(#wood)"/>
        <rect x="10" y="100" width="280" height="15" fill="url(#wood)"/>
        <rect x="10" y="170" width="280" height="15" fill="url(#wood)"/>
        <text x="150" y="125" font-family="serif" font-size="14" text-anchor="middle" fill="${shelfColor}" opacity="0.6">
          Esta estantería está esperando tus libros
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  return (
    <section className="my-8 space-y-6">
      {/* Header de la biblioteca */}
      <CardCozy variant="vintage" className="relative overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-r from-cozy-sage/20 via-cozy-terracotta/20 to-cozy-soft-yellow/20 rounded-lg"></div>
        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <BookCozyIcon className="w-8 h-8 text-cozy-warm-brown" />
                <h2 className="text-2xl font-bold text-cozy-warm-brown font-cozy-display">
                  Tu biblioteca personal
                </h2>
              </div>
              <p className="text-cozy-dark-gray font-cozy">
                Un rincón acogedor para tus aventuras literarias
              </p>
              <div className="flex items-center gap-6 text-sm font-cozy">
                <button 
                  onClick={() => setActiveShelf('TO_READ')}
                  className={`flex items-center gap-1 transition-colors hover:text-cozy-sage ${
                    activeShelf === 'TO_READ' ? 'text-cozy-sage font-medium' : 'text-cozy-medium-gray'
                  }`}
                >
                  <PendingCozyIcon className="w-4 h-4" />
                  {porLeerBooks.length} por leer
                </button>
                <button 
                  onClick={() => setActiveShelf('READ')}
                  className={`flex items-center gap-1 transition-colors hover:text-cozy-forest ${
                    activeShelf === 'READ' ? 'text-cozy-forest font-medium' : 'text-cozy-medium-gray'
                  }`}
                >
                  <CheckMarkCozyIcon className="w-4 h-4" />
                  {leidoBooks.length} leídos
                </button>
                <button 
                  onClick={() => setActiveShelf('ABANDONED')}
                  className={`flex items-center gap-1 transition-colors hover:text-cozy-forest ${
                    activeShelf === 'ABANDONED' ? 'text-cozy-forest font-medium' : 'text-cozy-medium-gray'
                  }`}
                >
                  <PauseCozyIcon className="w-4 h-4" />
                  {pausadoBooks.length} pausados
                </button>
              </div>
            </div>
            
            {/* Buscador de libros */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <MiniBookSearchCozy
                  onBookSelect={handleAddBookToRead}
                  placeholder="Buscar y añadir libro..."
                  disabledBooks={userBooks.map(ub => booksDetails[ub.bookId]).filter(Boolean)}
                />
                {addingBook && (
                  <div className="absolute top-full mt-2 left-0 text-xs text-cozy-terracotta font-cozy flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-cozy-terracotta border-t-transparent rounded-full animate-spin"></div>
                    Añadiendo a tu biblioteca...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardCozy>

      {/* Sección de Recomendaciones */}
      {recommendations.length > 0 && (
        <CardCozy variant="dreamy" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cozy-soft-yellow/20 to-cozy-sage/20"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-cozy-soft-yellow" />
              <h3 className="text-xl font-bold text-cozy-warm-brown font-cozy-display">
                Recomendaciones mágicas
              </h3>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-cozy-sage/30">
              {recommendations.map((recommendation, index) => (
                <CardCozy 
                  key={`recommendation-${index}`}
                  variant="vintage"
                  interactive={true}
                  className="min-w-[350px] flex-shrink-0 cursor-pointer group"
                  onClick={() => setSelectedRecommendation(recommendation)}
                >
                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-32 overflow-hidden rounded-lg bg-cozy-cream shadow-md">
                          <img
                            src={recommendation.coverUrl || 'https://placehold.co/80x128?text=Sin+portada'}
                            alt={recommendation.title || 'Título no disponible'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs bg-cozy-soft-yellow text-cozy-warm-brown rounded-full font-cozy font-medium">
                            ✨ Recomendado
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-base text-cozy-warm-brown font-cozy-display line-clamp-2">
                          {recommendation.title || 'Título no disponible'}
                        </h4>
                        
                        <p className="text-sm text-cozy-dark-gray font-cozy line-clamp-2">
                          {recommendation.reason || 'Una recomendación personalizada especial para ti'}
                        </p>
                        
                        <div className="flex gap-2 pt-2">
                          <ButtonCozy
                            variant="primary"
                            size="sm"
                            onClick={e => { 
                              e.stopPropagation(); 
                              handleAddRecommendationToLibrary(recommendation); 
                            }}
                            className="flex-1"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Añadir
                          </ButtonCozy>
                          
                          <ButtonCozy
                            variant="ghost"
                            size="sm"
                            onClick={e => { 
                              e.stopPropagation(); 
                              setSelectedRecommendation(recommendation); 
                            }}
                          >
                            <Eye className="w-3 h-3" />
                          </ButtonCozy>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardCozy>
              ))}
            </div>
          </div>
        </CardCozy>
      )}

      {/* Contenido de la biblioteca */}
      <CardCozy variant="vintage">
        <div className="p-6">
          {/* Contenido de la estantería activa */}
          <div className={`min-h-[300px] rounded-xl border-2 ${activeShelfData.borderClass} ${activeShelfData.bgClass} p-6`}>

            {activeShelfData.books.length === 0 ? (
              <div className="text-center py-8">
                <img 
                  src={getEmptyShelfSvg(`var(--${activeShelfData.color})`)}
                  alt="Estantería vacía"
                  className="w-64 h-40 mx-auto mb-4 opacity-60"
                />
                <p className={`text-sm ${activeShelfData.textClass} font-cozy`}>
                  Esta estantería está esperando tus próximas lecturas
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeShelfData.books.map((userBook) => {
                  const book = booksDetails[userBook.bookId];
                  const bookData = {
                    ...book,
                    ...userBook,
                    rating: userBook.rating,
                    status: userBook.status
                  };

                  return (
                    <BookCardCozy
                      key={userBook.id}
                      book={bookData}
                      variant="default"
                      onRatingChange={(book, rating) => handleRateBook(userBook, rating)}
                      onStatusChange={(book, newStatus) => handleMoveBook(userBook, newStatus)}
                      onView={handleViewBook}
                      className={updatingBookId === userBook.id ? 'opacity-50' : ''}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardCozy>

      {/* Modal de detalles de recomendación */}
      {selectedRecommendation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <CardCozy variant="dreamy" className="max-w-md w-full mx-4 relative animate-float-in">
            <ButtonCozy
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 z-10"
              onClick={() => setSelectedRecommendation(null)}
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </ButtonCozy>
            
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-36 overflow-hidden rounded-lg bg-cozy-cream shadow-md">
                    <img
                      src={selectedRecommendation.coverUrl || 'https://placehold.co/96x140?text=Sin+portada'}
                      alt={selectedRecommendation.title || 'Título no disponible'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <h2 className="font-bold text-lg text-cozy-warm-brown font-cozy-display line-clamp-2">
                    {selectedRecommendation.title || 'Título no disponible'}
                  </h2>
                  
                  <div className="space-y-1 text-xs text-cozy-dark-gray font-cozy">
                    <p><strong>Editorial:</strong> {selectedRecommendation.publisher || 'Desconocida'}</p>
                    <p><strong>Autores:</strong> {Array.isArray(selectedRecommendation.authors)
                      ? selectedRecommendation.authors.map(a => a.name || a).join(', ')
                      : 'Desconocido'}</p>
                    <p><strong>Páginas:</strong> {selectedRecommendation.pages || 'N/D'}</p>
                    <p><strong>ISBN:</strong> {selectedRecommendation.isbn13 || selectedRecommendation.isbn10 || 'N/D'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="inline-block bg-cozy-soft-yellow/20 text-cozy-warm-brown text-xs px-3 py-1 rounded-full mb-2 font-cozy font-medium">
                    💫 Motivo de la recomendación
                  </span>
                  <p className="text-sm text-cozy-dark-gray font-cozy leading-relaxed">
                    {selectedRecommendation.reason || 'Sin motivo específico'}
                  </p>
                </div>
                
                <div>
                  <span className="inline-block bg-cozy-sage/20 text-cozy-forest text-xs px-3 py-1 rounded-full mb-2 font-cozy font-medium">
                    📖 Sinopsis
                  </span>
                  <p className="text-sm text-cozy-dark-gray font-cozy leading-relaxed whitespace-pre-line">
                    {selectedRecommendation.synopsis || 'Sin sinopsis disponible'}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-cozy-light-gray">
                  <ButtonCozy
                    variant="primary"
                    onClick={() => {
                      handleAddRecommendationToLibrary(selectedRecommendation);
                      setSelectedRecommendation(null);
                    }}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir a biblioteca
                  </ButtonCozy>
                  
                  <ButtonCozy
                    variant="ghost"
                    onClick={() => setSelectedRecommendation(null)}
                  >
                    Cerrar
                  </ButtonCozy>
                </div>
              </div>
            </div>
          </CardCozy>
        </div>
      )}

      {/* Modal de detalles de libro */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <CardCozy variant="dreamy" className="max-w-lg w-full mx-4 relative animate-float-in">
            <ButtonCozy
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 z-10"
              onClick={() => setSelectedBook(null)}
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </ButtonCozy>
            
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-32 h-48 overflow-hidden rounded-lg bg-cozy-cream shadow-md">
                    <img
                      src={selectedBook.coverUrl || 'https://placehold.co/128x192?text=Sin+portada'}
                      alt={selectedBook.title || 'Título no disponible'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 space-y-3">
                  <h2 className="font-bold text-xl text-cozy-warm-brown font-cozy-display line-clamp-2">
                    {selectedBook.title || 'Título no disponible'}
                  </h2>
                  
                  <div className="space-y-2 text-sm text-cozy-dark-gray font-cozy">
                    <p><strong>Autores:</strong> {
                      selectedBook.authors && Array.isArray(selectedBook.authors)
                        ? selectedBook.authors.map(a => typeof a === 'string' ? a : a.name || 'Desconocido').join(', ')
                        : selectedBook.author || 'Desconocido'
                    }</p>
                    <p><strong>Editorial:</strong> {selectedBook.publisher || 'Desconocida'}</p>
                    <p><strong>Páginas:</strong> {selectedBook.pages || 'N/D'}</p>
                    <p><strong>Publicación:</strong> {selectedBook.publishedYear || 'N/D'}</p>
                    <p><strong>ISBN:</strong> {selectedBook.isbn13 || selectedBook.isbn10 || 'N/D'}</p>
                  </div>

                  {/* Rating si está disponible */}
                  {selectedBook.status === 'READ' && selectedBook.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-cozy-warm-brown">Mi valoración:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarCozyIcon
                            key={star}
                            className={`w-4 h-4 ${
                              star <= selectedBook.rating
                                ? 'text-cozy-soft-yellow'
                                : 'text-cozy-light-gray'
                            }`}
                            filled={star <= selectedBook.rating}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sinopsis si está disponible */}
              {selectedBook.synopsis && (
                <div className="space-y-2">
                  <span className="inline-block bg-cozy-sage/20 text-cozy-forest text-xs px-3 py-1 rounded-full font-cozy font-medium">
                    📖 Sinopsis
                  </span>
                  <p className="text-sm text-cozy-dark-gray font-cozy leading-relaxed whitespace-pre-line">
                    {selectedBook.synopsis}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t border-cozy-light-gray">
                <ButtonCozy
                  variant="ghost"
                  onClick={() => setSelectedBook(null)}
                >
                  Cerrar
                </ButtonCozy>
              </div>
            </div>
          </CardCozy>
        </div>
      )}
    </section>
  );
}
