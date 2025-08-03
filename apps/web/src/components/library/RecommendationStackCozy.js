'use client';

import { useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Eye } from 'lucide-react';
import { CardCozy } from '../ui/cozy/CardCozy';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { MagicCozyIcon, StarCozyIcon } from '../ui/cozy/IconCozy';

/**
 * Pila de recomendaciones que se pueden arrastrar a la biblioteca
 */
export function RecommendationStackCozy({ 
  recommendations = [], 
  onRecommendationDetails,
  onAddToLibrary,
  className = ''
}) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className={`recommendation-stack-cozy mb-8 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <MagicCozyIcon className="w-6 h-6 text-cozy-terracotta" />
        <h3 className="text-xl font-bold font-cozy-display text-cozy-terracotta">
          Recomendaciones Mágicas
        </h3>
        <div className="px-3 py-1 rounded-full bg-cozy-terracotta/10 text-cozy-terracotta text-sm font-cozy font-medium">
          {recommendations.length} {recommendations.length === 1 ? 'libro' : 'libros'}
        </div>
      </div>

      <div className="relative">
        {/* Fondo decorativo para la pila */}
        <div className="absolute inset-0 bg-gradient-to-r from-cozy-peach/20 via-cozy-terracotta/10 to-cozy-soft-yellow/20 rounded-2xl blur-sm"></div>
        
        <div className="relative flex gap-4 overflow-x-auto pb-4 px-2">
          <AnimatePresence>
            {recommendations.map((recommendation, index) => (
              <DraggableRecommendationCard
                key={recommendation.id || index}
                recommendation={recommendation}
                index={index}
                onDetails={onRecommendationDetails}
                onAddToLibrary={onAddToLibrary}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Tarjeta de recomendación individual que se puede arrastrar
 */
function DraggableRecommendationCard({ 
  recommendation, 
  index, 
  onDetails, 
  onAddToLibrary 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: `recommendation-${recommendation.id || index}`,
    data: {
      book: recommendation,
      type: 'recommendation',
      sourceStatus: 'recommendations'
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        draggable-recommendation-card flex-shrink-0 w-72 cursor-grab active:cursor-grabbing
        ${isDragging ? 'z-50 opacity-90' : 'z-10'}
      `}
      initial={{ opacity: 0, x: 50 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 2 : 0
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.3
      }}
    >
      <CardCozy variant="vintage" className="h-full">
        <div className="p-4">
          {/* Header con icono mágico */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cozy-soft-yellow" />
            <span className="text-xs font-cozy font-medium text-cozy-terracotta uppercase tracking-wider">
              Recomendación
            </span>
          </div>

          {/* Información del libro */}
          <div className="flex gap-3 mb-4">
            {/* Portada placeholder */}
            <div className="w-16 h-20 bg-gradient-to-br from-cozy-sage to-cozy-forest rounded-lg flex items-center justify-center flex-shrink-0">
              {recommendation.coverUrl ? (
                <img 
                  src={recommendation.coverUrl} 
                  alt={recommendation.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-white text-xs font-bold text-center">
                  📚
                </div>
              )}
            </div>

            {/* Detalles */}
            <div className="flex-1 min-w-0">
              <h4 className="font-cozy-display font-bold text-sm text-cozy-dark-gray line-clamp-2 mb-1">
                {recommendation.title}
              </h4>
              <p className="text-xs text-cozy-medium-gray font-cozy mb-2">
                {Array.isArray(recommendation.authors) 
                  ? recommendation.authors.map(a => typeof a === 'string' ? a : a.name).join(', ')
                  : recommendation.authors || 'Autor desconocido'
                }
              </p>
              {recommendation.pages && (
                <div className="flex items-center gap-1 text-xs text-cozy-medium-gray">
                  <span>📄</span>
                  <span>{recommendation.pages} páginas</span>
                </div>
              )}
            </div>
          </div>

          {/* Motivo de recomendación */}
          {recommendation.reason && (
            <div className="mb-4">
              <p className="text-xs text-cozy-dark-gray font-cozy italic line-clamp-2">
                "{recommendation.reason}"
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2">
            <ButtonCozy
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDetails?.(recommendation);
              }}
              className="flex-1"
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </ButtonCozy>
            <ButtonCozy
              variant="warm"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToLibrary?.(recommendation);
              }}
              className="flex-1"
            >
              <Plus className="w-3 h-3 mr-1" />
              Añadir
            </ButtonCozy>
          </div>

          {/* Indicador de drag */}
          <div className="mt-3 pt-3 border-t border-cozy-light-gray/30">
            <div className="flex items-center justify-center gap-2 text-xs text-cozy-medium-gray font-cozy">
              <span>🪄</span>
              <span>Arrastra para añadir a tu biblioteca</span>
            </div>
          </div>
        </div>

        {/* Efecto mágico para el drag */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'radial-gradient(circle, rgba(242, 204, 143, 0.3) 0%, transparent 70%)',
              boxShadow: '0 0 20px rgba(242, 204, 143, 0.5)'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )}
      </CardCozy>
    </motion.div>
  );
}

// Estilos adicionales para las recomendaciones
export const recommendationStackStyles = `
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
`;
