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

// Icono de libro cozy
const BookCozyIcon = ({ className = '', ...props }) => (
  <IconCozy className={className} {...props}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
      <path d="M8 12h8v1H8v-1zm0 2h8v1H8v-1zm0 2h5v1H8v-1z" opacity="0.7"/>
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

export {
  IconCozy,
  BookCozyIcon,
  ShelfCozyIcon,
  PlantCozyIcon,
  HeartCozyIcon,
  StarCozyIcon,
  HomeCozyIcon,
  SearchCozyIcon,
  UserCozyIcon,
  LoadingCozyIcon,
};
