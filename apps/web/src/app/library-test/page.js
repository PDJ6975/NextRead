'use client';

import { useState, useEffect } from 'react';
import { BookshelfCozy } from '../../components/library';
import { useLibraryDragDrop } from '../../hooks/useLibraryDragDrop';
import userBookService from '../../services/userBookService';
import { bookService } from '../../services/bookService';
import { CardCozy } from '../../components/ui/cozy/CardCozy';
import { LoadingCozyIcon } from '../../components/ui/cozy/IconCozy';

/**
 * Página de prueba para la nueva biblioteca interactiva cozy
 */
export default function InteractiveLibraryTestPage() {
  const [books, setBooks] = useState([]);
  const [booksDetails, setBooksDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recomendaciones de ejemplo para probar
  const mockRecommendations = [
    {
      id: 'rec-1',
      title: 'El Principito',
      authors: ['Antoine de Saint-Exupéry'],
      pages: 96,
      reason: 'Una historia atemporal sobre la amistad y la imaginación',
      coverUrl: null,
      publisher: 'Editorial Ejemplo',
      isbn13: '9781234567890'
    },
    {
      id: 'rec-2', 
      title: 'Cien años de soledad',
      authors: ['Gabriel García Márquez'],
      pages: 471,
      reason: 'Obra maestra del realismo mágico latinoamericano',
      coverUrl: null,
      publisher: 'Editorial Sudamericana',
      isbn13: '9780987654321'
    },
    {
      id: 'rec-3',
      title: 'Don Quijote de la Mancha',
      authors: ['Miguel de Cervantes'],
      pages: 863,
      reason: 'La novela más influyente de la literatura española',
      coverUrl: null,
      publisher: 'Real Academia Española',
      isbn13: '9781122334455'
    }
  ];

  // Hook personalizado para drag & drop
  const {
    moveBook,
    addRecommendationToLibrary,
    isUpdating
  } = useLibraryDragDrop(books, setBooks, setError);

  // Cargar libros del usuario
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const userBooks = await userBookService.getUserBooks();
      setBooks(userBooks);
      
      // Cargar detalles de los libros
      const detailsPromises = userBooks.map(async (ub) => {
        try {
          const bookDetails = await bookService.getBook(ub.bookId);
          return { bookId: ub.bookId, details: bookDetails };
        } catch (e) {
          console.warn(`Could not fetch details for book ${ub.bookId}:`, e);
          return { bookId: ub.bookId, details: null };
        }
      });

      const detailsResults = await Promise.all(detailsPromises);
      const detailsMap = {};
      
      detailsResults.forEach(({ bookId, details }) => {
        if (details) {
          detailsMap[bookId] = details;
        }
      });

      setBooksDetails(detailsMap);

      // Combinar datos de user books con detalles
      const enrichedBooks = userBooks.map(ub => ({
        ...ub,
        ...(detailsMap[ub.bookId] || {}),
        id: ub.id,
        bookId: ub.bookId,
        status: ub.status,
        rating: ub.rating
      }));

      setBooks(enrichedBooks);
    } catch (e) {
      console.error('Error fetching books:', e);
      setError('No se pudieron cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para la biblioteca interactiva
  const handleBookMove = async (book, newStatus) => {
    await moveBook(book, newStatus);
  };

  const handleBookDetails = (book) => {
    console.log('Ver detalles del libro:', book);
    // Aquí abriríamos un modal con los detalles
  };

  const handleRecommendationDetails = (recommendation) => {
    console.log('Ver detalles de la recomendación:', recommendation);
    // Aquí abriríamos un modal con los detalles de la recomendación
  };

  const handleAddRecommendationToLibrary = async (recommendation, status = 'TO_READ') => {
    await addRecommendationToLibrary(recommendation, status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-white to-cozy-mint p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <CardCozy variant="dreamy" className="p-8">
              <div className="text-center">
                <LoadingCozyIcon className="w-12 h-12 mx-auto mb-4 text-cozy-sage" />
                <h2 className="text-xl font-cozy-display font-bold text-cozy-dark-gray mb-2">
                  Preparando tu biblioteca mágica...
                </h2>
                <p className="text-cozy-medium-gray font-cozy">
                  Organizando tus libros en las estanterías
                </p>
              </div>
            </CardCozy>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-white to-cozy-mint p-8">
        <div className="max-w-7xl mx-auto">
          <CardCozy variant="warm" className="p-8 text-center">
            <h2 className="text-xl font-cozy-display font-bold text-cozy-terracotta mb-2">
              Ops! Algo salió mal
            </h2>
            <p className="text-cozy-dark-gray font-cozy">{error}</p>
          </CardCozy>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-white to-cozy-mint">
      {/* Header de prueba */}
      <div className="p-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <CardCozy variant="magical" className="p-6 mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-cozy-display font-bold text-cozy-dark-gray mb-2">
                🏗️ Biblioteca Interactiva Cozy - Prueba
              </h1>
              <p className="text-cozy-medium-gray font-cozy">
                <strong>Fase 6.1 Implementada:</strong> Arrastra y suelta libros entre estanterías. 
                Las recomendaciones también se pueden arrastrar a tu biblioteca.
              </p>
              {isUpdating && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <LoadingCozyIcon className="w-4 h-4 text-cozy-sage" />
                  <span className="text-sm text-cozy-sage font-cozy">Actualizando biblioteca...</span>
                </div>
              )}
            </div>
          </CardCozy>
        </div>
      </div>

      {/* Biblioteca interactiva */}
      <div className="px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BookshelfCozy
            books={books}
            recommendations={mockRecommendations}
            onBookMove={handleBookMove}
            onBookDetails={handleBookDetails}
            onRecommendationDetails={handleRecommendationDetails}
            onAddRecommendationToLibrary={handleAddRecommendationToLibrary}
          />
        </div>
      </div>

      {/* Información de debug */}
      <div className="px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <CardCozy variant="dreamy" className="p-4">
            <h3 className="font-cozy-display font-bold text-cozy-dark-gray mb-2">
              📊 Estado Actual
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-cozy">
              <div>
                <strong>Por Leer:</strong> {books.filter(b => b.status === 'TO_READ').length} libros
              </div>
              <div>
                <strong>Leídos:</strong> {books.filter(b => b.status === 'READ').length} libros
              </div>
              <div>
                <strong>Pausados:</strong> {books.filter(b => b.status === 'ABANDONED').length} libros
              </div>
            </div>
          </CardCozy>
        </div>
      </div>
    </div>
  );
}
