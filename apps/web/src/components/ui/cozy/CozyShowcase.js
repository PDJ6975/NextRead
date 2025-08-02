'use client';

import { useState } from 'react';
import { ButtonCozy } from './ButtonCozy';
import { CardCozy, CardHeaderCozy, CardContentCozy, CardFooterCozy } from './CardCozy';
import { InputCozy, TextareaCozy } from './InputCozy';
import { 
  BookCozyIcon, 
  ShelfCozyIcon, 
  PlantCozyIcon, 
  HeartCozyIcon, 
  StarCozyIcon,
  HomeCozyIcon,
  SearchCozyIcon,
  UserCozyIcon,
  LoadingCozyIcon 
} from './IconCozy';

const CozyShowcase = () => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cozy-gradient-primary p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold cozy-text-display text-cozy-warm-brown mb-4">
            🏠 Sistema de Diseño Cozy
          </h1>
          <p className="text-lg cozy-text-body text-cozy-dark-gray">
            Demostración de componentes con estilo acogedor y cálido
          </p>
        </div>

        {/* Iconos */}
        <CardCozy variant="elevated" className="cozy-animate-fade-in">
          <CardHeaderCozy>
            <h2 className="text-xl font-semibold cozy-text-display text-cozy-forest">
              🎨 Iconos Cozy
            </h2>
          </CardHeaderCozy>
          <CardContentCozy>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6 items-center">
              <div className="text-center">
                <BookCozyIcon size="xl" variant="sage" />
                <p className="text-xs mt-2 cozy-text-body">Libro</p>
              </div>
              <div className="text-center">
                <ShelfCozyIcon size="xl" variant="warm" />
                <p className="text-xs mt-2 cozy-text-body">Estante</p>
              </div>
              <div className="text-center">
                <PlantCozyIcon size="xl" variant="forest" />
                <p className="text-xs mt-2 cozy-text-body">Planta</p>
              </div>
              <div className="text-center">
                <HeartCozyIcon size="xl" variant="warm" />
                <p className="text-xs mt-2 cozy-text-body">Corazón</p>
              </div>
              <div className="text-center">
                <StarCozyIcon size="xl" variant="soft" filled />
                <p className="text-xs mt-2 cozy-text-body">Estrella</p>
              </div>
              <div className="text-center">
                <HomeCozyIcon size="xl" variant="sage" />
                <p className="text-xs mt-2 cozy-text-body">Casa</p>
              </div>
              <div className="text-center">
                <SearchCozyIcon size="xl" variant="default" />
                <p className="text-xs mt-2 cozy-text-body">Buscar</p>
              </div>
              <div className="text-center">
                <UserCozyIcon size="xl" variant="warm" />
                <p className="text-xs mt-2 cozy-text-body">Usuario</p>
              </div>
            </div>
          </CardContentCozy>
        </CardCozy>

        {/* Botones */}
        <CardCozy variant="paper" className="cozy-animate-slide-up">
          <CardHeaderCozy>
            <h2 className="text-xl font-semibold cozy-text-display text-cozy-forest">
              🔘 Botones Cozy
            </h2>
          </CardHeaderCozy>
          <CardContentCozy>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-cozy-dark-gray">Variantes Principales</h3>
                <div className="space-y-2">
                  <ButtonCozy variant="primary" size="md">
                    <BookCozyIcon size="sm" className="mr-2" />
                    Primario
                  </ButtonCozy>
                  <ButtonCozy variant="warm" size="md">
                    <HeartCozyIcon size="sm" className="mr-2" />
                    Cálido
                  </ButtonCozy>
                  <ButtonCozy variant="soft" size="md">
                    <StarCozyIcon size="sm" className="mr-2" />
                    Suave
                  </ButtonCozy>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-cozy-dark-gray">Variantes Secundarias</h3>
                <div className="space-y-2">
                  <ButtonCozy variant="outline" size="md">
                    <PlantCozyIcon size="sm" className="mr-2" />
                    Outline
                  </ButtonCozy>
                  <ButtonCozy variant="ghost" size="md">
                    <SearchCozyIcon size="sm" className="mr-2" />
                    Ghost
                  </ButtonCozy>
                  <ButtonCozy variant="nature" size="md">
                    <ShelfCozyIcon size="sm" className="mr-2" />
                    Naturaleza
                  </ButtonCozy>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-cozy-dark-gray">Estados y Tamaños</h3>
                <div className="space-y-2">
                  <ButtonCozy variant="primary" size="sm">
                    Pequeño
                  </ButtonCozy>
                  <ButtonCozy variant="primary" size="lg">
                    Grande
                  </ButtonCozy>
                  <ButtonCozy 
                    variant="warm" 
                    loading={loading}
                    onClick={handleLoadingDemo}
                  >
                    {loading ? 'Cargando...' : 'Probar Loading'}
                  </ButtonCozy>
                </div>
              </div>
            </div>
          </CardContentCozy>
        </CardCozy>

        {/* Cards */}
        <CardCozy variant="sage" className="cozy-animate-scale-in">
          <CardHeaderCozy>
            <h2 className="text-xl font-semibold cozy-text-display text-cozy-forest">
              🃏 Tarjetas Cozy
            </h2>
          </CardHeaderCozy>
          <CardContentCozy>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CardCozy variant="default" interactive>
                <CardContentCozy>
                  <div className="text-center">
                    <BookCozyIcon size="2xl" variant="sage" className="mx-auto mb-3" />
                    <h3 className="font-semibold cozy-text-display">Tarjeta Default</h3>
                    <p className="text-sm text-cozy-medium-gray cozy-text-body">
                      Estilo básico con interactividad
                    </p>
                  </div>
                </CardContentCozy>
              </CardCozy>

              <CardCozy variant="wood" interactive>
                <CardContentCozy>
                  <div className="text-center">
                    <ShelfCozyIcon size="2xl" variant="warm" className="mx-auto mb-3" />
                    <h3 className="font-semibold cozy-text-display">Tarjeta Madera</h3>
                    <p className="text-sm text-cozy-medium-gray cozy-text-body">
                      Con textura de madera
                    </p>
                  </div>
                </CardContentCozy>
              </CardCozy>

              <CardCozy variant="elevated" interactive>
                <CardContentCozy>
                  <div className="text-center">
                    <PlantCozyIcon size="2xl" variant="forest" className="mx-auto mb-3" />
                    <h3 className="font-semibold cozy-text-display">Tarjeta Elevada</h3>
                    <p className="text-sm text-cozy-medium-gray cozy-text-body">
                      Con sombra pronunciada
                    </p>
                  </div>
                </CardContentCozy>
              </CardCozy>
            </div>
          </CardContentCozy>
        </CardCozy>

        {/* Inputs */}
        <CardCozy variant="warm" className="cozy-animate-bounce-in">
          <CardHeaderCozy>
            <h2 className="text-xl font-semibold cozy-text-display text-cozy-forest">
              📝 Campos de Entrada Cozy
            </h2>
          </CardHeaderCozy>
          <CardContentCozy>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputCozy
                  label="Input Default"
                  placeholder="Escribe algo acogedor..."
                  variant="default"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                
                <InputCozy
                  label="Input Cálido"
                  placeholder="Texto con estilo cálido"
                  variant="warm"
                />
                
                <InputCozy
                  label="Input Suave"
                  placeholder="Estilo suave y delicado"
                  variant="soft"
                />

                <InputCozy
                  label="Contraseña"
                  type="password"
                  placeholder="Tu contraseña secreta"
                  variant="default"
                />
              </div>

              <div className="space-y-4">
                <TextareaCozy
                  label="Área de Texto Cozy"
                  placeholder="Cuenta tu historia aquí... 📚"
                  variant="default"
                  rows={5}
                />
                
                <TextareaCozy
                  label="Comentarios Cálidos"
                  placeholder="Comparte tus pensamientos..."
                  variant="warm"
                  rows={3}
                />
              </div>
            </div>
          </CardContentCozy>
        </CardCozy>

        {/* Estado de Loading */}
        {loading && (
          <CardCozy variant="elevated" className="text-center">
            <CardContentCozy>
              <LoadingCozyIcon size="xl" variant="sage" className="mx-auto mb-4" />
              <p className="cozy-text-body text-cozy-dark-gray">
                Cargando experiencia cozy...
              </p>
            </CardContentCozy>
          </CardCozy>
        )}

        {/* Footer */}
        <div className="text-center pt-8">
          <div className="cozy-divider"></div>
          <p className="cozy-text-body text-cozy-medium-gray">
            🌟 Sistema de Diseño Cozy para NextRead • Hecho con amor y café ☕
          </p>
        </div>
      </div>
    </div>
  );
};

export default CozyShowcase;
