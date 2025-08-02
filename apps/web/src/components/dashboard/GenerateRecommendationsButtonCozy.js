'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { MagicCozyIcon, StarCozyIcon } from '../ui/cozy/IconCozy';
import { useAuth } from '../../contexts/AuthContext';
import recommendationService from '../../services/recommendationService';

export default function GenerateRecommendationsButtonCozy({ 
  onRecommendationsGenerated, 
  className = '' 
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  const handleClick = async () => {
    if (generating) return;

    // Si el usuario no está autenticado, redirigir a login
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Si está autenticado, generar recomendaciones
    setGenerating(true);
    setSparkleAnimation(true);
    
    try {
      const newRecommendations = await recommendationService.generateNewRecommendations();
      if (onRecommendationsGenerated) {
        onRecommendationsGenerated(newRecommendations);
      }
    } catch (error) {
      console.error('Error al generar recomendaciones:', error);
    } finally {
      setGenerating(false);
      setTimeout(() => setSparkleAnimation(false), 2000);
    }
  };

  if (generating) {
    return (
      <CardCozy variant="magical" className={`${className} relative overflow-hidden`}>
        <div className="p-6 text-center">
          {/* Efecto de partículas mágicas durante carga */}
          <div className="absolute inset-0 bg-gradient-to-r from-cozy-soft-yellow/20 via-cozy-sage/20 to-cozy-terracotta/20 animate-pulse"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <MagicCozyIcon className="w-16 h-16 text-cozy-soft-yellow animate-spin" />
                <div className="absolute -top-2 -right-2">
                  <StarCozyIcon className="w-6 h-6 text-cozy-terracotta animate-bounce" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <StarCozyIcon className="w-4 h-4 text-cozy-sage animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-cozy-warm-brown font-cozy-display">
                ✨ Creando magia literaria...
              </h3>
              <p className="text-sm text-cozy-dark-gray font-cozy">
                Nuestros sabios bibliotecarios están seleccionando los libros perfectos para ti
              </p>
            </div>

            {/* Barra de progreso mágica */}
            <div className="w-full bg-cozy-light-gray rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cozy-sage via-cozy-soft-yellow to-cozy-terracotta animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardCozy>
    );
  }

  return (
    <CardCozy variant="dreamy" interactive={true} className={`${className} group cursor-pointer`}>
      <div className="p-6 text-center space-y-4" onClick={handleClick}>
        {/* Fondo decorativo con partículas */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          sparkleAnimation ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-4 left-4 text-cozy-soft-yellow animate-ping">✨</div>
          <div className="absolute top-8 right-6 text-cozy-sage animate-pulse">🌟</div>
          <div className="absolute bottom-6 left-8 text-cozy-terracotta animate-bounce">💫</div>
          <div className="absolute bottom-4 right-4 text-cozy-lavender animate-pulse">⭐</div>
        </div>

        {/* Icono principal */}
        <div className="relative">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cozy-soft-yellow/20 to-cozy-sage/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <MagicCozyIcon className="w-10 h-10 text-cozy-warm-brown group-hover:text-cozy-terracotta transition-colors duration-300" />
          </div>
          
          {/* Elementos decorativos flotantes */}
          <StarCozyIcon className="absolute -top-1 -right-1 w-4 h-4 text-cozy-soft-yellow group-hover:animate-spin transition-all duration-300" />
          <StarCozyIcon className="absolute -bottom-1 -left-1 w-3 h-3 text-cozy-sage group-hover:animate-pulse transition-all duration-300" />
        </div>

        {/* Contenido */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-cozy-warm-brown font-cozy-display group-hover:text-cozy-terracotta transition-colors duration-300">
            ✨ {user ? 'Generar Recomendaciones Mágicas' : 'Descubre tu Próximo Libro Favorito'}
          </h3>
          <p className="text-sm text-cozy-dark-gray font-cozy leading-relaxed">
            {user 
              ? 'Deja que nuestros bibliotecarios mágicos descubran tu próxima aventura literaria'
              : 'Regístrate para obtener recomendaciones personalizadas basadas en tus gustos únicos'
            }
          </p>
        </div>

        {/* Botón de acción principal */}
        <div className="pt-2">
          <ButtonCozy
            variant="magical"
            size="lg"
            disabled={generating}
            className="w-full group/btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Wand2 className="w-5 h-5 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
            <span className="font-cozy font-medium">
              {user ? 'Crear Recomendaciones' : 'Comenzar mi Aventura'}
            </span>
            <Sparkles className="w-4 h-4 ml-2 group-hover/btn:animate-pulse" />
          </ButtonCozy>
        </div>

        {/* Texto motivacional pequeño */}
        <p className="text-xs text-cozy-medium-gray font-cozy opacity-75">
          {user 
            ? '🔮 Basado en tus gustos únicos y preferencias mágicas'
            : '📚 Miles de libros esperan por ti en nuestra biblioteca mágica'
          }
        </p>
      </div>
    </CardCozy>
  );
}
