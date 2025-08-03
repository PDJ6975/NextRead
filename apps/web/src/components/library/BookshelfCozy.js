'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShelfSectionCozy } from './ShelfSectionCozy';
import { RecommendationStackCozy } from './RecommendationStackCozy';
import { DraggableBookCozy } from './DraggableBookCozy';
import { BookSpineCozy } from './BookSpineCozy';

/**
 * Componente principal de la estantería interactiva con drag & drop
 */
export function BookshelfCozy({ 
  books = [], 
  recommendations = [],
  onBookMove,
  onBookDetails,
  onRecommendationDetails,
  onAddRecommendationToLibrary,
  className = ''
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [draggedOverShelf, setDraggedOverShelf] = useState(null);

  // Agrupar libros por estado
  const groupedBooks = {
    TO_READ: books.filter(book => book.status === 'TO_READ'),
    READ: books.filter(book => book.status === 'READ'),
    ABANDONED: books.filter(book => book.status === 'ABANDONED')
  };

  // Configuración de las estanterías
  const shelves = [
    {
      status: 'TO_READ',
      title: 'Por Leer',
      emoji: '📚',
      color: 'sage',
      books: groupedBooks.TO_READ,
      acceptsFrom: ['recommendations', 'ABANDONED', 'READ']
    },
    {
      status: 'READ',
      title: 'Leídos',
      emoji: '✅',
      color: 'forest',
      books: groupedBooks.READ,
      acceptsFrom: ['TO_READ', 'ABANDONED']
    },
    {
      status: 'ABANDONED',
      title: 'Pausados',
      emoji: '💤',
      color: 'gray',
      books: groupedBooks.ABANDONED,
      acceptsFrom: ['TO_READ', 'READ']
    }
  ];

  // Manejar inicio de arrastre
  const handleDragStart = (event) => {
    const { active } = event;
    const data = active.data?.current;
    
    if (data) {
      setActiveItem({
        id: active.id,
        type: data.type,
        book: data.book,
        sourceStatus: data.sourceStatus
      });
    }
  };

  // Manejar arrastre sobre zona válida
  const handleDragOver = (event) => {
    const { over } = event;
    
    if (over?.data?.current?.type === 'shelf') {
      setDraggedOverShelf(over.data.current.status);
    } else {
      setDraggedOverShelf(null);
    }
  };

  // Manejar finalización de arrastre
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.data?.current && over.data?.current) {
      const sourceData = active.data.current;
      const targetData = over.data.current;

      // Si es una recomendación siendo arrastrada a una estantería
      if (sourceData.type === 'recommendation' && targetData.type === 'shelf') {
        onAddRecommendationToLibrary?.(sourceData.book, targetData.status);
      }
      // Si es un libro siendo movido entre estanterías
      else if (sourceData.type === 'book' && targetData.type === 'shelf') {
        if (sourceData.sourceStatus !== targetData.status) {
          onBookMove?.(sourceData.book, targetData.status);
        }
      }
    }

    // Limpiar estados
    setActiveItem(null);
    setDraggedOverShelf(null);
  };

  // Manejar cancelación de arrastre
  const handleDragCancel = () => {
    setActiveItem(null);
    setDraggedOverShelf(null);
  };

  return (
    <div className={`bookshelf-cozy ${className}`}>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Stack de recomendaciones */}
        {recommendations.length > 0 && (
          <RecommendationStackCozy
            recommendations={recommendations}
            onRecommendationDetails={onRecommendationDetails}
            onAddToLibrary={onAddRecommendationToLibrary}
          />
        )}

        {/* Estanterías principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {shelves.map((shelf) => (
            <motion.div
              key={shelf.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: shelf.status === 'TO_READ' ? 0 : shelf.status === 'READ' ? 0.1 : 0.2,
                duration: 0.5 
              }}
            >
              <ShelfSectionCozy
                status={shelf.status}
                books={shelf.books}
                acceptsFrom={shelf.acceptsFrom}
                onBookDetails={onBookDetails}
                title={shelf.title}
                emoji={shelf.emoji}
                color={shelf.color}
              />
            </motion.div>
          ))}
        </div>

        {/* Overlay para el elemento que se está arrastrando */}
        <DragOverlay>
          {activeItem ? (
            <div className="drag-overlay-item">
              {activeItem.type === 'book' ? (
                <BookSpineCozy 
                  book={activeItem.book} 
                  status={activeItem.sourceStatus}
                />
              ) : activeItem.type === 'recommendation' ? (
                <div className="w-72 opacity-90">
                  <div className="p-4 bg-white rounded-xl shadow-2xl border-2 border-cozy-terracotta">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🪄</span>
                      <span className="font-cozy-display font-bold text-cozy-terracotta">
                        {activeItem.book.title}
                      </span>
                    </div>
                    <p className="text-sm text-cozy-medium-gray font-cozy">
                      Arrastrando a la biblioteca...
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Indicador visual global durante drag */}
      {activeItem && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fondo sutil */}
          <div className="absolute inset-0 bg-cozy-sage/5"></div>
          
          {/* Partículas mágicas */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cozy-soft-yellow rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Estilos CSS para la estantería completa
export const bookshelfStyles = `
  .bookshelf-cozy {
    position: relative;
    padding: 1rem;
  }

  .drag-overlay-item {
    transform: rotate(5deg) scale(1.1);
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
    z-index: 1000;
  }

  .bookshelf-cozy .shelf-section-cozy {
    height: fit-content;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .bookshelf-cozy .grid-cols-1.lg\\:grid-cols-3 {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .bookshelf-cozy {
      padding: 0.5rem;
    }
  }
`;
