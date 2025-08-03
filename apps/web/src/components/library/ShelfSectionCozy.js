'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { DraggableBookCozy } from './DraggableBookCozy';

/**
 * Sección de estantería que actúa como zona de drop para libros
 */
export function ShelfSectionCozy({ 
  status, 
  books = [], 
  onDrop, 
  acceptsFrom = [],
  onBookDetails,
  title,
  emoji,
  color = 'sage',
  className = ''
}) {
  const {
    isOver,
    setNodeRef,
    active
  } = useDroppable({
    id: `shelf-${status}`,
    data: {
      type: 'shelf',
      status,
      acceptsFrom
    }
  });

  // Verificar si el elemento que se está arrastrando puede ser soltado aquí
  const canAcceptDrop = active?.data?.current?.sourceStatus && 
    (acceptsFrom.includes(active.data.current.sourceStatus) || 
     acceptsFrom.includes('recommendations'));

  const isDropActive = isOver && canAcceptDrop;

  // Configuración de colores por estado
  const shelfColors = {
    TO_READ: {
      primary: '#9caf88',
      secondary: '#6b8e6b', 
      background: 'rgba(156, 175, 136, 0.1)',
      border: '#9caf88',
      wood: '#d4a574'
    },
    READ: {
      primary: '#6b8e6b',
      secondary: '#4a6741',
      background: 'rgba(107, 142, 107, 0.1)',
      border: '#6b8e6b', 
      wood: '#c49464'
    },
    ABANDONED: {
      primary: '#b8b3ae',
      secondary: '#6b6560',
      background: 'rgba(184, 179, 174, 0.1)',
      border: '#b8b3ae',
      wood: '#a89289'
    }
  };

  const colors = shelfColors[status] || shelfColors.TO_READ;

  return (
    <motion.div
      ref={setNodeRef}
      className={`shelf-section-cozy ${className}`}
      animate={{
        scale: isDropActive ? 1.02 : 1,
        boxShadow: isDropActive 
          ? `0 8px 30px rgba(156, 175, 136, 0.3)` 
          : '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Header de la sección */}
      <div className="shelf-header mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="text-lg font-bold font-cozy-display" style={{ color: colors.primary }}>
            {title}
          </h3>
          <span 
            className="px-2 py-1 rounded-full text-xs font-cozy font-medium"
            style={{ 
              backgroundColor: colors.background,
              color: colors.secondary 
            }}
          >
            {books.length} {books.length === 1 ? 'libro' : 'libros'}
          </span>
        </div>
      </div>

      {/* Estantería con efecto de madera */}
      <div 
        className={`
          shelf-container relative rounded-xl p-6 min-h-[220px]
          transition-all duration-300 ease-out
          ${isDropActive ? 'shelf-drop-active' : ''}
        `}
        style={{
          background: `linear-gradient(135deg, ${colors.wood} 0%, ${colors.wood}dd 100%)`,
          border: `2px solid ${isDropActive ? colors.primary : colors.wood}`,
          boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.3),
            0 4px 15px rgba(139, 85, 36, 0.15)
          `
        }}
      >
        {/* Textura de madera */}
        <div 
          className="absolute inset-0 rounded-xl opacity-20"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(139, 85, 36, 0.1) 2px,
              rgba(139, 85, 36, 0.1) 4px
            )`
          }}
        />

        {/* Zona de drop activa */}
        {isDropActive && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-dashed"
            style={{ borderColor: colors.primary }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: `${colors.primary}20` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <div 
                  className="font-cozy font-medium"
                  style={{ color: colors.primary }}
                >
                  Soltar aquí
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Libros en la estantería */}
        <div className="relative z-10">
          {books.length === 0 ? (
            <EmptyShelfCozy color={colors.primary} emoji={emoji} />
          ) : (
            <div className="flex flex-wrap gap-1 justify-start items-end">
              <AnimatePresence>
                {books.map((book, index) => (
                  <motion.div
                    key={`${book.id}-${status}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.3
                    }}
                  >
                    <DraggableBookCozy
                      book={book}
                      status={status}
                      onDetails={onBookDetails}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Componente para mostrar cuando la estantería está vacía
 */
function EmptyShelfCozy({ color, emoji }) {
  return (
    <motion.div 
      className="text-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-6xl mb-4"
      >
        {emoji}
      </motion.div>
      <p 
        className="font-cozy text-sm opacity-70"
        style={{ color }}
      >
        Esta estantería está esperando tus próximas lecturas
      </p>
    </motion.div>
  );
}

// Estilos CSS adicionales
export const shelfStyles = `
  .shelf-drop-active {
    background: rgba(156, 175, 136, 0.2) !important;
    border-color: #9caf88 !important;
    transform: scale(1.02);
  }

  .shelf-section-cozy {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .shelf-container {
    position: relative;
  }

  .shelf-container::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(180deg, transparent 0%, rgba(139, 85, 36, 0.2) 100%);
    border-radius: 0 0 12px 12px;
  }
`;
