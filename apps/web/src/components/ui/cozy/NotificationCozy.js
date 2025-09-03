'use client';

import React from 'react';
import { X, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { CardCozy } from './CardCozy';
import { ButtonCozy } from './ButtonCozy';

export function NotificationCozy({
  title,
  message,
  type = 'info', // 'error', 'warning', 'success', 'info'
  isOpen = false,
  onClose,
  remainingRequests,
  resetTime,
  className = '',
  showCloseButton = true
}) {
  if (!isOpen) return null;

  // Configuración de iconos y colores por tipo
  const typeConfig = {
    error: {
      icon: AlertTriangle,
      bgColor: 'from-red-50 to-cozy-cream',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800'
    },
    warning: {
      icon: Clock,
      bgColor: 'from-yellow-50 to-cozy-soft-yellow/20',
      borderColor: 'border-cozy-terracotta/30',
      iconColor: 'text-cozy-terracotta',
      titleColor: 'text-cozy-warm-brown'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'from-green-50 to-cozy-sage/20',
      borderColor: 'border-cozy-sage/30',
      iconColor: 'text-cozy-sage',
      titleColor: 'text-cozy-warm-brown'
    },
    info: {
      icon: Info,
      bgColor: 'from-blue-50 to-cozy-sage/10',
      borderColor: 'border-cozy-sage/20',
      iconColor: 'text-cozy-sage',
      titleColor: 'text-cozy-warm-brown'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md ${className}`}>
        <CardCozy variant="dreamy" className={`relative bg-gradient-to-br ${config.bgColor} border-2 ${config.borderColor} shadow-2xl`}>
          <div className="p-6 space-y-4">
            {/* Header con icono y botón cerrar */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full bg-white/80 ${config.iconColor}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  {title && (
                    <h3 className={`text-lg font-bold font-cozy-display ${config.titleColor}`}>
                      {title}
                    </h3>
                  )}
                </div>
              </div>
              {showCloseButton && (
                <ButtonCozy
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1 hover:bg-white/50 transition-colors"
                >
                  <X className="w-4 h-4 text-cozy-medium-gray hover:text-cozy-warm-brown" />
                </ButtonCozy>
              )}
            </div>

            {/* Contenido del mensaje */}
            <div className="space-y-3">
              <p className="text-cozy-dark-gray font-cozy leading-relaxed">
                {message}
              </p>

              {/* Información adicional para rate limit */}
              {type === 'warning' && (remainingRequests !== undefined || resetTime) && (
                <div className="bg-white/40 rounded-lg p-3 space-y-2 border border-cozy-terracotta/20">
                  {remainingRequests !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cozy-medium-gray font-cozy">
                        Recomendaciones restantes:
                      </span>
                      <span className="font-bold text-cozy-warm-brown">
                        {remainingRequests}
                      </span>
                    </div>
                  )}
                  {resetTime && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cozy-medium-gray font-cozy">
                        Se reinicia en:
                      </span>
                      <span className="font-bold text-cozy-warm-brown">
                        {resetTime}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Consejo mágico para rate limit */}
              {type === 'warning' && (
                <div className="text-center p-3 bg-cozy-soft-yellow/20 rounded-lg border border-cozy-soft-yellow/30">
                  <p className="text-xs text-cozy-medium-gray font-cozy italic">
                    ✨ Mientras tanto, puedes explorar tu biblioteca personal o leer las recomendaciones que ya tienes guardadas
                  </p>
                </div>
              )}
            </div>

            {/* Botón de acción */}
            <div className="pt-2">
              <ButtonCozy
                variant="magical"
                size="lg"
                onClick={onClose}
                className="w-full"
              >
                <span className="font-cozy font-medium">
                  Entendido
                </span>
              </ButtonCozy>
            </div>
          </div>
        </CardCozy>
      </div>
    </div>
  );
}