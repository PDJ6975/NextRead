'use client';

import { clsx } from 'clsx';
import { forwardRef } from 'react';

const ButtonCozy = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cozy-interactive font-cozy';

  const variants = {
    // Variante principal - Sage cozy
    primary: 'bg-cozy-sage text-white hover:bg-cozy-forest focus:ring-cozy-sage cozy-shadow-sm hover:cozy-shadow-md',
    
    // Variante cálida - Terracotta
    warm: 'bg-cozy-terracotta text-white hover:bg-cozy-warm-brown focus:ring-cozy-terracotta cozy-shadow-sm hover:cozy-shadow-md',
    
    // Variante suave - Amarillo suave
    soft: 'bg-cozy-soft-yellow text-cozy-warm-brown hover:bg-cozy-peach focus:ring-cozy-soft-yellow cozy-shadow-sm hover:cozy-shadow-md',
    
    // Variante outline cozy
    outline: 'border-2 border-cozy-sage text-cozy-sage bg-cozy-white hover:bg-cozy-sage hover:text-white focus:ring-cozy-sage cozy-shadow-sm',
    
    // Variante ghost cozy
    ghost: 'text-cozy-sage bg-transparent hover:bg-cozy-cream focus:ring-cozy-sage',
    
    // Variante secundaria suave
    secondary: 'bg-cozy-cream text-cozy-dark-gray border border-cozy-light-gray hover:bg-cozy-mint hover:border-cozy-sage focus:ring-cozy-sage cozy-shadow-sm',
    
    // Variante nature (verde bosque)
    nature: 'bg-cozy-forest text-white hover:bg-cozy-sage focus:ring-cozy-forest cozy-shadow-sm hover:cozy-shadow-md',
    
    // Variante magical - Gradiente mágico con efectos especiales
    magical: 'bg-gradient-to-r from-cozy-sage to-cozy-terracotta text-white hover:from-cozy-forest hover:to-cozy-warm-brown focus:ring-cozy-sage cozy-shadow-md hover:cozy-shadow-lg cozy-magical-hover transform hover:scale-105',
    
    // Variante dreamy - Colores suaves y etéreos
    dreamy: 'bg-gradient-to-r from-cozy-lavender to-cozy-mint text-white hover:from-cozy-peach hover:to-cozy-soft-yellow focus:ring-cozy-lavender cozy-shadow-sm hover:cozy-shadow-md',
    
    // Variante vintage - Colores tierra y nostálgicos
    vintage: 'bg-cozy-warm-brown text-cozy-cream border border-cozy-terracotta hover:bg-cozy-terracotta hover:border-cozy-warm-brown focus:ring-cozy-warm-brown cozy-shadow-sm hover:cozy-shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-cozy-sm min-h-[2rem]',
    md: 'px-4 py-2.5 text-sm rounded-cozy min-h-[2.5rem]',
    lg: 'px-6 py-3 text-base rounded-cozy-md min-h-[3rem]',
    xl: 'px-8 py-4 text-lg rounded-cozy-lg min-h-[3.5rem]',
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed hover:transform-none',
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
        </div>
      )}
      {children}
    </button>
  );
});

ButtonCozy.displayName = 'ButtonCozy';

export { ButtonCozy };
