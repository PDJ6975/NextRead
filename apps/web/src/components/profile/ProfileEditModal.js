'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';

// Lista de iconos predefinidos (puedes añadir más SVGs o iconos de librerías)
const avatarIcons = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
];

export default function ProfileEditModal({
  isOpen,
  onClose,
  user,
  onSave,
}) {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [username, setUsername] = useState(user?.nickname || user?.email?.split('@')[0] || '');
  const [saving, setSaving] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Editar Perfil</h2>
        {/* Carrusel de iconos */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="mr-2"
              aria-label="Anterior icono"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="w-20 h-20 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-indigo-50 shadow-lg mx-2">
              <img
                src={avatarIcons[currentIcon]}
                alt="Avatar actual"
                className="w-16 h-16 object-contain"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="ml-2"
              aria-label="Siguiente icono"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
        {/* Cambiar nombre de usuario */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={32}
            autoFocus
          />
        </div>
        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSave}
          disabled={saving || !username.trim()}
        >
          <Check className="w-5 h-5" />
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
