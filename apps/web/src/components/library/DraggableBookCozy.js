'use client';

import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { BookSpineCozy } from './BookSpineCozy';

/**
 * Componente de libro arrastrable para la estantería interactiva
 */
export function DraggableBookCozy({ 
  book, 
  status, 
  onDetails, 
  isDragging = false,
  isOver = false,
  ...props 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: dndIsDragging
  } = useDraggable({
    id: `book-${book.id}`,
    data: { 
      book: { ...book, status },
      type: 'book',
      sourceStatus: status
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const finalIsDragging = isDragging || dndIsDragging;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        draggable-book-cozy 
        ${finalIsDragging ? 'book-dragging z-50' : 'z-10'}
        ${isOver ? 'book-drag-over' : ''}
        cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-out
      `}
      onClick={(e) => {
        e.stopPropagation();
        if (!finalIsDragging && onDetails) {
          onDetails(book);
        }
      }}
      whileHover={{ 
        y: -8, 
        rotateY: 0,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 1.05,
        rotate: 2
      }}
      initial={{ 
        opacity: 0, 
        y: 20 
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: finalIsDragging ? 1.1 : 1,
        rotate: finalIsDragging ? 5 : 0,
        boxShadow: finalIsDragging 
          ? '0 20px 50px rgba(0, 0, 0, 0.3)'
          : '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      {...props}
    >
      <BookSpineCozy 
        book={book} 
        status={status}
      />

      {/* Tooltip con información del libro */}
      {!finalIsDragging && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 
          bg-cozy-dark-gray text-white px-3 py-2 rounded-lg text-xs font-cozy
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none z-20 whitespace-nowrap max-w-48">
          <div className="font-semibold">{book.title}</div>
          <div className="text-cozy-light-gray text-xs">
            {book.authors?.[0]?.name || book.authors?.[0] || 'Autor desconocido'}
          </div>
          {book.pages && (
            <div className="text-cozy-light-gray text-xs">
              {book.pages} páginas
            </div>
          )}
          
          {/* Flecha del tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 
              border-transparent border-t-cozy-dark-gray"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Estilos CSS para el drag & drop (se añadirán al sistema de diseño)
export const dragDropStyles = `
  .book-dragging {
    transform: rotate(5deg) scale(1.1) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
    z-index: 1000 !important;
    opacity: 0.9;
  }

  .book-drag-over {
    transform: translateY(-4px);
  }

  .draggable-book-cozy {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .draggable-book-cozy:hover {
    z-index: 20;
  }

  .draggable-book-cozy:active {
    cursor: grabbing;
  }
`;
