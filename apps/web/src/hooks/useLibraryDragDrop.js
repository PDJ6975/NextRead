'use client';

import { useState, useCallback } from 'react';
import userBookService from '../services/userBookService';

/**
 * Hook personalizado para manejar la lógica de drag & drop de la biblioteca
 */
export function useLibraryDragDrop(books, onBooksUpdate, onError) {
  const [draggedBook, setDraggedBook] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mover libro entre estanterías
  const moveBook = useCallback(async (book, newStatus) => {
    if (book.status === newStatus) return;

    setIsUpdating(true);
    
    try {
      // Optimistic update - actualizar UI inmediatamente
      const optimisticBooks = books.map(b => 
        b.id === book.id ? { ...b, status: newStatus } : b
      );
      onBooksUpdate?.(optimisticBooks);

      // Actualizar en el backend
      await userBookService.updateBook(book.id, { status: newStatus });
      
      // Revalidar datos si es necesario
      // La UI ya está actualizada optimísticamente
    } catch (error) {
      console.error('Error moving book:', error);
      
      // Revertir cambios optimistas en caso de error
      onBooksUpdate?.(books);
      onError?.('No se pudo mover el libro. Inténtalo de nuevo.');
    } finally {
      setIsUpdating(false);
    }
  }, [books, onBooksUpdate, onError]);

  // Añadir recomendación a la biblioteca
  const addRecommendationToLibrary = useCallback(async (recommendation, status = 'TO_READ') => {
    setIsUpdating(true);
    
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
      
      const userBookData = { status };
      const addedBook = await userBookService.addBook(bookData, userBookData);

      // Actualizar la lista de libros
      const newBook = {
        ...addedBook,
        ...bookData,
        status: addedBook.status
      };

      const updatedBooks = [...books, newBook];
      onBooksUpdate?.(updatedBooks);

      return addedBook;
    } catch (error) {
      console.error('Error adding recommendation to library:', error);
      onError?.('No se pudo añadir la recomendación a tu biblioteca.');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [books, onBooksUpdate, onError]);

  // Validar si un movimiento es permitido
  const canDropBook = useCallback((sourceStatus, targetStatus, acceptsFrom = []) => {
    return acceptsFrom.includes(sourceStatus) || 
           acceptsFrom.includes('recommendations') ||
           sourceStatus !== targetStatus;
  }, []);

  // Handlers para los eventos de drag & drop
  const handleDragStart = useCallback((book) => {
    setDraggedBook(book);
  }, []);

  const handleDragOver = useCallback((targetStatus) => {
    setDropTarget(targetStatus);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedBook(null);
    setDropTarget(null);
  }, []);

  return {
    // Estados
    draggedBook,
    dropTarget,
    isUpdating,
    
    // Acciones
    moveBook,
    addRecommendationToLibrary,
    canDropBook,
    
    // Handlers de eventos
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
}
