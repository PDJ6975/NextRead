"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { InputCozy } from '../ui/cozy/InputCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { IconCozy } from '../ui/cozy/IconCozy';

// Lista de iconos predefinidos (puedes añadir más SVGs o iconos de librerías)
// Usar URLs absolutas para los avatares (importante para el backend)
const AVATAR_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
const avatarIcons = [
  `${AVATAR_BASE_URL}/avatars/avatar1.png`,
  `${AVATAR_BASE_URL}/avatars/avatar2.png`,
  `${AVATAR_BASE_URL}/avatars/avatar3.png`,
  `${AVATAR_BASE_URL}/avatars/avatar4.png`,
  `${AVATAR_BASE_URL}/avatars/avatar5.png`,
];

export default function ProfileEditModalCozy({
  isOpen,
  onClose,
  user,
  onSave,
}) {
  // Sincronizar el avatar seleccionado con el avatar actual del usuario al abrir el modal
  const getInitialIcon = () => {
    if (!user?.avatarUrl) return 0;
    const idx = avatarIcons.findIndex((url) => url === user.avatarUrl);
    return idx >= 0 ? idx : 0;
  };
  const [currentIcon, setCurrentIcon] = useState(getInitialIcon());
  const [username, setUsername] = useState(user?.nickname || user?.email?.split('@')[0] || '');
  const [saving, setSaving] = useState(false);

  // Actualizar el icono seleccionado si cambia el usuario o se abre el modal
  // (por ejemplo, tras guardar cambios)
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIcon(getInitialIcon());
      setUsername(user?.nickname || user?.email?.split('@')[0] || '');
    }
    // eslint-disable-next-line
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handlePrev = () => {
    setCurrentIcon((prev) => (prev === 0 ? avatarIcons.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIcon((prev) => (prev === avatarIcons.length - 1 ? 0 : prev + 1));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      avatar: avatarIcons[currentIcon],
      fullName: username,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cozy-dark-gray/40 backdrop-blur-sm">
      <CardCozy 
        variant="dreamy" 
        className="w-full max-w-md relative cozy-animate-float p-8"
      >
        {/* Botón de cerrar cozy */}
        <button
          className="absolute top-4 right-4 text-cozy-medium-gray hover:text-cozy-dark-gray transition-colors duration-200"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <IconCozy name="heart" size="sm" className="rotate-45" />
        </button>

        {/* Header con estilo cozy */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <IconCozy name="star" size="lg" className="text-cozy-soft-yellow" />
          </div>
          <h2 className="text-2xl font-bold text-cozy-dark-gray font-comfortaa">
            Personaliza tu Perfil
          </h2>
          <p className="text-cozy-medium-gray font-nunito mt-2">
            Elige tu avatar y nombre favoritos
          </p>
        </div>

        {/* Carrusel de avatares con estilo cozy */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ButtonCozy
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className="mr-4 border-cozy-sage text-cozy-sage hover:bg-cozy-sage hover:text-white"
              aria-label="Avatar anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </ButtonCozy>

            {/* Marco decorativo cozy para el avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cozy-sage to-cozy-terracotta p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-cozy-white flex items-center justify-center">
                  <img
                    src={avatarIcons[currentIcon]}
                    alt="Avatar actual"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
              {/* Elementos decorativos flotantes */}
              <div className="absolute -top-1 -right-1">
                <IconCozy name="star" size="sm" className="text-cozy-soft-yellow animate-pulse" />
              </div>
            </div>

            <ButtonCozy
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="ml-4 border-cozy-sage text-cozy-sage hover:bg-cozy-sage hover:text-white"
              aria-label="Siguiente avatar"
            >
              <ChevronRight className="w-5 h-5" />
            </ButtonCozy>
          </div>

          {/* Indicadores de posición cozy */}
          <div className="flex space-x-2">
            {avatarIcons.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIcon 
                    ? 'bg-cozy-sage shadow-sm' 
                    : 'bg-cozy-light-gray'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Campo de nombre con InputCozy */}
        <div className="mb-8">
          <InputCozy
            variant="warm"
            label="Nombre de usuario"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre mágico"
            maxLength={32}
            icon="book"
            autoFocus
          />
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <ButtonCozy
            variant="nature"
            className="w-full"
            onClick={handleSave}
            disabled={saving || !username.trim()}
            loading={saving}
          >
            <div className="flex items-center justify-center space-x-2">
              <IconCozy name="star" size="sm" />
              <span>{saving ? 'Guardando cambios...' : 'Guardar cambios'}</span>
            </div>
          </ButtonCozy>

          <ButtonCozy
            variant="ghost"
            className="w-full"
            onClick={onClose}
            disabled={saving}
          >
            <div className="flex items-center justify-center space-x-2">
              <IconCozy name="plant" size="sm" />
              <span>Cancelar</span>
            </div>
          </ButtonCozy>
        </div>
      </CardCozy>
    </div>
  );
}
