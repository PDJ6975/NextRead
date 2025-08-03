// Exportaciones principales de la biblioteca interactiva
export { BookshelfCozy } from './BookshelfCozy';
export { ShelfSectionCozy } from './ShelfSectionCozy';
export { DraggableBookCozy } from './DraggableBookCozy';
export { BookSpineCozy } from './BookSpineCozy';
export { RecommendationStackCozy } from './RecommendationStackCozy';

// Estilos CSS consolidados
export const libraryStyles = `
  /* Importar todos los estilos de los componentes */
  
  /* BookSpine Styles */
  .book-spine-cozy {
    position: relative;
    transform-style: preserve-3d;
  }
  
  .book-spine-cozy:hover {
    transform: perspective(100px) rotateY(0deg) translateY(-8px) !important;
    z-index: 20;
  }

  /* DraggableBook Styles */
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

  /* Shelf Section Styles */
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

  /* Recommendation Stack Styles */
  .draggable-recommendation-card {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .recommendation-stack-cozy {
    position: relative;
  }

  .recommendation-stack-cozy::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(224, 122, 95, 0.3) 20%, 
      rgba(242, 204, 143, 0.5) 50%, 
      rgba(224, 122, 95, 0.3) 80%, 
      transparent 100%
    );
    border-radius: 1px;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Bookshelf Global Styles */
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

  /* Animaciones globales para drag & drop */
  @keyframes float-particles {
    0%, 100% {
      transform: translateY(0) scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-10px) scale(1.2);
      opacity: 0.8;
    }
  }

  .magic-particles {
    animation: float-particles 2s ease-in-out infinite;
  }

  /* Efectos de hover globales */
  .cozy-hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  /* Transiciones suaves globales */
  .cozy-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
