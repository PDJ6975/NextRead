'use client';

import { clsx } from 'clsx';
import { forwardRef } from 'react';

const CardCozy = forwardRef(({
  children,
  variant = 'default',
  className = '',
  interactive = false,
  ...props
}, ref) => {
  const baseClasses = 'bg-cozy-white border rounded-cozy cozy-shadow-sm overflow-hidden transition-all duration-300';

  const variants = {
    default: 'border-cozy-light-gray',
    paper: 'border-cozy-light-gray cozy-texture-paper',
    wood: 'border-cozy-medium-gray cozy-texture-wood bg-cozy-cream',
    sage: 'border-cozy-sage bg-gradient-to-br from-cozy-white to-cozy-cream',
    warm: 'border-cozy-terracotta bg-gradient-to-br from-cozy-cream to-cozy-peach/10',
    soft: 'border-cozy-soft-yellow bg-gradient-to-br from-cozy-white to-cozy-soft-yellow/10',
    elevated: 'border-cozy-light-gray cozy-shadow-md hover:cozy-shadow-lg',
  };

  const interactiveClasses = interactive ? 'cursor-pointer cozy-hover' : '';

  return (
    <div
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const CardHeaderCozy = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'px-6 py-4 border-b border-cozy-light-gray bg-gradient-to-r from-cozy-cream/50 to-transparent',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const CardContentCozy = forwardRef(({
  children,
  className = '',
  padding = 'default',
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      ref={ref}
      className={clsx(
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const CardFooterCozy = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'px-6 py-4 border-t border-cozy-light-gray bg-gradient-to-r from-cozy-cream/30 to-transparent',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Asignar displayName para debugging
CardCozy.displayName = 'CardCozy';
CardHeaderCozy.displayName = 'CardHeaderCozy';
CardContentCozy.displayName = 'CardContentCozy';
CardFooterCozy.displayName = 'CardFooterCozy';

export { 
  CardCozy,
  CardHeaderCozy,
  CardContentCozy,
  CardFooterCozy 
};
