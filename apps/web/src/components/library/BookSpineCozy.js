'use client';

import { StarCozyIcon } from '../ui/cozy/IconCozy';

/**
 * Componente que representa el lomo de un libro en la estantería
 * con estilo cozy y efectos 3D
 */
export function BookSpineCozy({ book, status, isPlaceholder = false }) {
  // Colores por estado
  const statusColors = {
    TO_READ: {
      primary: '#9caf88', // sage
      secondary: '#6b8e6b', // forest
      accent: '#f2cc8f', // soft yellow
      shadow: 'rgba(156, 175, 136, 0.3)'
    },
    READ: {
      primary: '#6b8e6b', // forest
      secondary: '#4a6741',
      accent: '#9caf88', // sage
      shadow: 'rgba(107, 142, 107, 0.3)'
    },
    ABANDONED: {
      primary: '#b8b3ae', // medium gray
      secondary: '#6b6560', // dark gray
      accent: '#e8e5e1', // light gray
      shadow: 'rgba(184, 179, 174, 0.3)'
    }
  };

  const colors = statusColors[status] || statusColors.TO_READ;
  
  // Generar un ancho aleatorio para el libro (entre 20px y 45px)
  const bookWidth = book?.pages 
    ? Math.max(20, Math.min(45, (book.pages / 10))) 
    : 25 + Math.random() * 20;

  if (isPlaceholder) {
    return (
      <div 
        className="book-spine-placeholder"
        style={{
          width: `${bookWidth}px`,
          height: '180px',
          background: `linear-gradient(135deg, #e8e5e1 0%, #d0cbc4 100%)`,
          border: '1px solid #b8b3ae',
          borderRadius: '2px 0 0 2px',
          position: 'relative',
          transform: 'perspective(100px) rotateY(-5deg)',
          boxShadow: `
            2px 0 4px rgba(184, 179, 174, 0.2),
            inset -2px 0 2px rgba(255, 255, 255, 0.1)
          `,
          opacity: 0.5
        }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
          style={{ 
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 8px,
              rgba(255,255,255,0.1) 8px,
              rgba(255,255,255,0.1) 10px
            )`
          }}
        />
      </div>
    );
  }

  // Título truncado para el lomo
  const spineTitle = book?.title 
    ? book.title.length > 15 
      ? book.title.substring(0, 15) + '...' 
      : book.title
    : 'Sin título';

  // Autor truncado
  const spineAuthor = book?.authors?.[0]?.name || book?.authors?.[0] || 'Autor';
  const truncatedAuthor = spineAuthor.length > 12 
    ? spineAuthor.substring(0, 12) + '...' 
    : spineAuthor;

  return (
    <div 
      className="book-spine-cozy group cursor-pointer"
      style={{
        width: `${bookWidth}px`,
        height: '180px',
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        border: `1px solid ${colors.secondary}`,
        borderRadius: '3px 0 0 3px',
        position: 'relative',
        transform: 'perspective(100px) rotateY(-5deg)',
        transformOrigin: 'left center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          3px 0 6px ${colors.shadow},
          inset -2px 0 3px rgba(255, 255, 255, 0.1),
          inset 1px 0 1px rgba(255, 255, 255, 0.2)
        `,
        overflow: 'hidden'
      }}
    >
      {/* Textura del libro */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 6px,
            rgba(255,255,255,0.1) 6px,
            rgba(255,255,255,0.1) 8px
          )`
        }}
      />

      {/* Contenido del lomo */}
      <div className="absolute inset-0 p-2 flex flex-col justify-between text-white">
        {/* Título (rotado para verse vertical) */}
        <div 
          className="flex-1 flex items-start justify-center"
          style={{ 
            writingMode: 'vertical-lr',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)'
          }}
        >
          <span 
            className="font-cozy font-semibold text-xs leading-tight text-center"
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              wordBreak: 'break-word',
              fontSize: bookWidth > 35 ? '0.75rem' : '0.65rem'
            }}
          >
            {spineTitle}
          </span>
        </div>

        {/* Autor (en la parte inferior) */}
        <div 
          className="text-center"
          style={{ 
            writingMode: 'vertical-lr',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)'
          }}
        >
          <span 
            className="font-cozy text-xs opacity-90"
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              fontSize: bookWidth > 35 ? '0.65rem' : '0.55rem'
            }}
          >
            {truncatedAuthor}
          </span>
        </div>

        {/* Rating si el libro está leído */}
        {status === 'READ' && book?.rating && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center">
              <StarCozyIcon 
                className="w-3 h-3 text-cozy-soft-yellow"
                style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}
              />
              <span 
                className="text-xs font-bold text-cozy-soft-yellow ml-1"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                {book.rating}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Efecto de brillo en hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`
        }}
      />

      {/* Borde lateral para dar efecto 3D */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-1"
        style={{
          background: `linear-gradient(180deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
          boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
}
