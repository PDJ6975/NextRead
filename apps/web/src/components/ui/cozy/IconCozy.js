'use client';

import { clsx } from 'clsx';

// Componente base para iconos cozy
const IconCozy = ({ 
  children, 
  size = 'md', 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  };

  const variants = {
    default: 'text-cozy-dark-gray',
    sage: 'text-cozy-sage',
    warm: 'text-cozy-terracotta',
    soft: 'text-cozy-soft-yellow',
    forest: 'text-cozy-forest',
    muted: 'text-cozy-medium-gray',
  };

  return (
    <div 
      className={clsx(
        'inline-flex items-center justify-center',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Icono de libro cozy simple con líneas (restaurado original)
const BookCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      {/* Libro cerrado */}
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      {/* Líneas de texto en la cubierta */}
      <line x1="8" y1="7" x2="16" y2="7" strokeWidth="1" opacity="0.6"/>
      <line x1="8" y1="10" x2="14" y2="10" strokeWidth="1" opacity="0.6"/>
      <line x1="8" y1="13" x2="12" y2="13" strokeWidth="1" opacity="0.6"/>
    </svg>
  </IconCozy>
);

// Icono de nube de pensamiento para libros reflexivos
const ThoughtCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className="w-full h-full">
      {/* Nube de pensamiento principal */}
      <path d="M18 10c0-3.3-2.7-6-6-6S6 6.7 6 10c0 .6.1 1.2.3 1.8C5.5 12.1 5 12.9 5 14c0 1.7 1.3 3 3 3h10c2.2 0 4-1.8 4-4 0-2.2-1.8-4-4-4z"/>
      
      {/* Burbujas pequeñas de pensamiento debajo */}
      <circle cx="8" cy="18" r="1.5" opacity="0.8"/>
      <circle cx="6" cy="20" r="1" opacity="0.6"/>
      <circle cx="4.5" cy="21.5" r="0.8" opacity="0.4"/>
      
      {/* Detalles internos de la nube - suaves ondulaciones */}
      <path d="M8 10c.8-.5 1.7-.8 2.5-.8s1.7.3 2.5.8" 
            stroke="white" 
            strokeWidth="0.8" 
            fill="none" 
            opacity="0.3"/>
      <path d="M9 12.5c1-.3 2-.3 3 0" 
            stroke="white" 
            strokeWidth="0.6" 
            fill="none" 
            opacity="0.3"/>
      
      {/* Pequeños puntos sutiles que sugieren ideas flotantes */}
      <circle cx="10.5" cy="11" r="0.3" fill="white" opacity="0.4"/>
      <circle cx="13.5" cy="11" r="0.3" fill="white" opacity="0.4"/>
      <circle cx="12" cy="13" r="0.2" fill="white" opacity="0.3"/>
    </svg>
  </IconCozy>
);

// Icono de rayo/acción para libros dinámicos
const FastBookCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      {/* Rayo zigzag para representar dinamismo y acción */}
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" opacity="0.8"/>
      {/* Líneas de impacto/energía alrededor */}
      <path d="M6 4l2 2" strokeWidth="1" opacity="0.5"/>
      <path d="M4 8l2-1" strokeWidth="1" opacity="0.5"/>
      <path d="M18 6l-2 2" strokeWidth="1" opacity="0.5"/>
      <path d="M20 10l-2-1" strokeWidth="1" opacity="0.5"/>
      <path d="M6 18l2-2" strokeWidth="1" opacity="0.5"/>
      <path d="M4 16l2 1" strokeWidth="1" opacity="0.5"/>
      <path d="M18 20l-2-2" strokeWidth="1" opacity="0.5"/>
      <path d="M20 16l-2 1" strokeWidth="1" opacity="0.5"/>
    </svg>
  </IconCozy>
);

// Icono de estante cozy
const ShelfCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <rect x="2" y="4" width="20" height="2" rx="1"/>
      <rect x="2" y="11" width="20" height="2" rx="1"/>
      <rect x="2" y="18" width="20" height="2" rx="1"/>
      <rect x="4" y="6" width="2" height="5" rx="0.5" opacity="0.7"/>
      <rect x="8" y="6" width="2" height="5" rx="0.5" opacity="0.7"/>
      <rect x="12" y="6" width="2" height="5" rx="0.5" opacity="0.7"/>
      <rect x="16" y="6" width="2" height="5" rx="0.5" opacity="0.7"/>
    </svg>
  </IconCozy>
);

// Icono de planta cozy
const PlantCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 22c-1.1 0-2-.9-2-2v-2h4v2c0 1.1-.9 2-2 2z"/>
      <path d="M16 18H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z"/>
      <path d="M12 16c-2 0-4-2-4-5 0-2 1-3 2-3 0-2 2-4 4-4s4 2 4 4c1 0 2 1 2 3 0 3-2 5-4 5z" opacity="0.8"/>
      <circle cx="10" cy="8" r="1" opacity="0.6"/>
      <circle cx="14" cy="8" r="1" opacity="0.6"/>
    </svg>
  </IconCozy>
);

// Icono de corazón cozy
const HeartCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </IconCozy>
);

// Icono de estrella cozy
const StarCozyIcon = ({ filled = false, className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  </IconCozy>
);

// Icono de casa cozy
const HomeCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 3l10 9h-3v9h-6v-6h-2v6H5v-9H2l10-9z"/>
      <rect x="9" y="15" width="2" height="2" opacity="0.7"/>
      <rect x="13" y="15" width="2" height="2" opacity="0.7"/>
      <circle cx="12" cy="10" r="1" opacity="0.5"/>
    </svg>
  </IconCozy>
);

// Icono de lupa cozy
const SearchCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
      <circle cx="11" cy="11" r="3" opacity="0.3" fill="currentColor"/>
    </svg>
  </IconCozy>
);

// Icono de usuario cozy
const UserCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="8" r="4"/>
      <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" opacity="0.8"/>
    </svg>
  </IconCozy>
);

// Icono de loading/spinner cozy
const LoadingCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={clsx('animate-spin', className)} {...props}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
        className="opacity-25"
      />
      <path 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        className="opacity-75"
      />
    </svg>
  </IconCozy>
);

// Icono mágico cozy (varita con estrella)
const MagicCozyIcon = ({ className = '', animated = true, ...props }) => (
  <IconCozy className={clsx(className, animated && 'cozy-animate-sparkle')} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      {/* Varita mágica */}
      <rect x="4" y="18" width="12" height="1.5" rx="0.75" transform="rotate(-45 10 18.75)" opacity="0.8"/>
      
      {/* Estrella en la punta */}
      <polygon points="19,5 20.5,8 24,8.5 21.5,11 22,15 19,13 16,15 16.5,11 14,8.5 17.5,8" opacity="0.9"/>
      
      {/* Partículas mágicas */}
      <circle cx="8" cy="8" r="1" opacity="0.6"/>
      <circle cx="15" cy="12" r="0.8" opacity="0.5"/>
      <circle cx="6" cy="15" r="0.6" opacity="0.7"/>
      <circle cx="11" cy="6" r="0.7" opacity="0.6"/>
      
      {/* Estelas mágicas */}
      <path d="M8 8l2 2M15 12l-2 2M6 15l2-2" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  </IconCozy>
);

// Icono de reloj cozy
const ClockCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10" opacity="0.8"/>
      <polyline points="12,6 12,12 16,14" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  </IconCozy>
);

// Icono de check/marca cozy
const CheckMarkCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  </IconCozy>
);

// Icono triste cozy
const SadCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10" opacity="0.8"/>
      <circle cx="8" cy="10" r="1" fill="white"/>
      <circle cx="16" cy="10" r="1" fill="white"/>
      <path d="M8 16s2-2 4-2 4 2 4 2" stroke="white" strokeWidth="2" fill="none" transform="rotate(180 12 16)"/>
    </svg>
  </IconCozy>
);

// Iconos específicos por género
const RomanceCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </IconCozy>
);

const FantasyCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l3 6 6 1-4.5 4.5 1 6-5.5-3-5.5 3 1-6L3 9l6-1z"/>
      <circle cx="12" cy="12" r="2" fill="white" opacity="0.8"/>
    </svg>
  </IconCozy>
);

const SciFiCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12l4-4 4 4-4 4z" fill="white" opacity="0.8"/>
      <circle cx="12" cy="12" r="1.5" fill="white"/>
    </svg>
  </IconCozy>
);

const MysteryCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="17" r="1" fill="white"/>
    </svg>
  </IconCozy>
);

const ThrillerCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-8-5z"/>
      <path d="M8 11l4 4 4-4" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const ContemporaryCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <path d="M7 8h10M7 12h7M7 16h4" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  </IconCozy>
);

const LiteraryCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <path d="M8 7h8M8 11h6M8 15h4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="16" cy="7" r="1" fill="white"/>
    </svg>
  </IconCozy>
);

const HistoricalCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <path d="M7 2v4M17 2v4" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M7 12h10M7 16h6" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  </IconCozy>
);

const NonFictionCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z"/>
      <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const BiographyCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  </IconCozy>
);

const SelfHelpCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l3 6 6 1-4.5 4.5 1 6-5.5-3-5.5 3 1-6L3 9l6-1z"/>
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const YoungAdultCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="8" cy="10" r="1.5" fill="white"/>
      <circle cx="16" cy="10" r="1.5" fill="white"/>
      <path d="M8 15s2 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const HorrorCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M8 10v2M16 10v2" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M7 16s2-2 5-2 5 2 5 2" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const AdventureCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M3 21h18l-9-18z"/>
      <path d="M12 9v6" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="17" r="1" fill="white"/>
    </svg>
  </IconCozy>
);

// Íconos adicionales para más géneros
const PoetryCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14l-6-4.5h7.5z"/>
    </svg>
  </IconCozy>
);

const ClassicCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6z"/>
      <path d="M8 6h8M8 10h8M8 14h6" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="16" cy="16" r="2" fill="white"/>
    </svg>
  </IconCozy>
);

const ChildrenCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="9" cy="9" r="1.5" fill="white"/>
      <circle cx="15" cy="9" r="1.5" fill="white"/>
      <path d="M8 14s2 3 4 3 4-3 4-3" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M6 6l2 2M18 6l-2 2" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const GraphicNovelCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M7 7h10v4H7zM7 13h6M7 16h8" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="15" cy="15" r="2" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  </IconCozy>
);

const MemoirCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <circle cx="12" cy="8" r="2" fill="white"/>
      <path d="M8 14v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  </IconCozy>
);

const DystopianCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2"/>
    </svg>
  </IconCozy>
);

const CrimeCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.46 9-11V7l-10-5z"/>
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const PhilosophyCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1 2-2.5 2.5V14" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="17" r="1" fill="white"/>
    </svg>
  </IconCozy>
);

const ReligionCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      {/* Cruz principal */}
      <rect x="11" y="4" width="2" height="16" rx="1"/>
      <rect x="7" y="10" width="10" height="2" rx="1"/>
      {/* Base/pedestal */}
      <rect x="9" y="18" width="6" height="2" rx="1"/>
      <rect x="10" y="20" width="4" height="1" rx="0.5"/>
    </svg>
  </IconCozy>
);

const BusinessCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/>
      <path d="M16 8h2M16 12h2M7 8h.01M7 12h.01M7 16h.01"/>
      <path d="M15 19l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const TechnologyCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <rect x="8" y="21" width="8" height="1"/>
      <rect x="12" y="17" width="0" height="4"/>
      <path d="M6 7h12M6 11h12" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  </IconCozy>
);

const HumorCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="8" cy="10" r="1" fill="white"/>
      <circle cx="16" cy="10" r="1" fill="white"/>
      <path d="M7 14.5s2 2.5 5 2.5 5-2.5 5-2.5" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  </IconCozy>
);

const CookingCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2v4M8 2v4M16 2v4"/>
      <path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/>
      <path d="M9 12h6M9 16h4" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  </IconCozy>
);

const TravelCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a10 10 0 0 0 0 20M2 12h20" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M8 6s4 1 4 6-4 6-4 6M16 6s-4 1-4 6 4 6 4 6" stroke="white" strokeWidth="1" fill="none"/>
    </svg>
  </IconCozy>
);

const HealthFitnessCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/>
    </svg>
  </IconCozy>
);

const ArtDesignCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/>
      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  </IconCozy>
);

const EducationCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  </IconCozy>
);

// Icono de pendiente/próximo a leer cozy
const PendingCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  </IconCozy>
);

// Icono de pausa cozy
const PauseCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <line x1="10" y1="15" x2="10" y2="9"/>
      <line x1="14" y1="15" x2="14" y2="9"/>
    </svg>
  </IconCozy>
);

export {
  IconCozy,
  BookCozyIcon,
  ThoughtCozyIcon,
  FastBookCozyIcon,
  ShelfCozyIcon,
  PlantCozyIcon,
  HeartCozyIcon,
  StarCozyIcon,
  HomeCozyIcon,
  SearchCozyIcon,
  UserCozyIcon,
  LoadingCozyIcon,
  MagicCozyIcon,
  ClockCozyIcon,
  CheckMarkCozyIcon,
  SadCozyIcon,
  PendingCozyIcon,
  PauseCozyIcon,
  // Iconos por género
  RomanceCozyIcon,
  FantasyCozyIcon,
  SciFiCozyIcon,
  MysteryCozyIcon,
  ThrillerCozyIcon,
  ContemporaryCozyIcon,
  LiteraryCozyIcon,
  HistoricalCozyIcon,
  NonFictionCozyIcon,
  BiographyCozyIcon,
  SelfHelpCozyIcon,
  YoungAdultCozyIcon,
  HorrorCozyIcon,
  AdventureCozyIcon,
  // Íconos adicionales para más géneros
  PoetryCozyIcon,
  ClassicCozyIcon,
  ChildrenCozyIcon,
  GraphicNovelCozyIcon,
  MemoirCozyIcon,
  DystopianCozyIcon,
  CrimeCozyIcon,
  PhilosophyCozyIcon,
  ReligionCozyIcon,
  BusinessCozyIcon,
  TechnologyCozyIcon,
  HumorCozyIcon,
  CookingCozyIcon,
  TravelCozyIcon,
  HealthFitnessCozyIcon,
  ArtDesignCozyIcon,
  EducationCozyIcon,
};
