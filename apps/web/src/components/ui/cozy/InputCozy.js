'use client';

import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputCozy = forwardRef(({
  className = '',
  type = 'text',
  variant = 'default',
  size = 'md',
  error = null,
  label = null,
  placeholder = '',
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'w-full font-cozy transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default: clsx(
      'bg-cozy-white border-2 border-cozy-light-gray text-cozy-dark-gray',
      'focus:border-cozy-sage focus:ring-cozy-sage/20',
      'placeholder:text-cozy-medium-gray',
      error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
    ),
    warm: clsx(
      'bg-cozy-cream border-2 border-cozy-terracotta/30 text-cozy-warm-brown',
      'focus:border-cozy-terracotta focus:ring-cozy-terracotta/20',
      'placeholder:text-cozy-medium-gray'
    ),
    soft: clsx(
      'bg-cozy-soft-yellow/10 border-2 border-cozy-soft-yellow/50 text-cozy-warm-brown',
      'focus:border-cozy-soft-yellow focus:ring-cozy-soft-yellow/20',
      'placeholder:text-cozy-medium-gray'
    ),
    minimal: clsx(
      'bg-transparent border-b-2 border-cozy-light-gray text-cozy-dark-gray rounded-none',
      'focus:border-cozy-sage focus:ring-0',
      'placeholder:text-cozy-medium-gray'
    ),
    magical: clsx(
      'bg-cozy-soft-yellow/15 border-2 border-cozy-soft-yellow/60 text-cozy-dark-gray',
      'focus:border-cozy-soft-yellow focus:ring-cozy-soft-yellow/20',
      'placeholder:text-cozy-medium-gray'
    ),
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-cozy-sm',
    md: 'px-4 py-3 text-sm rounded-cozy',
    lg: 'px-5 py-4 text-base rounded-cozy-md',
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className={clsx(
          'block text-sm font-medium mb-2 font-cozy',
          error ? 'text-red-600' : 'text-cozy-dark-gray',
          isFocused && !error && 'text-cozy-sage'
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={clsx(
            baseClasses,
            variants[variant],
            sizes[size],
            type === 'password' && 'pr-10',
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cozy-medium-gray hover:text-cozy-sage transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 font-cozy">
          {error}
        </p>
      )}
    </div>
  );
});

const TextareaCozy = forwardRef(({
  className = '',
  variant = 'default',
  size = 'md',
  error = null,
  label = null,
  placeholder = '',
  disabled = false,
  rows = 4,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'w-full font-cozy transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-none';

  const variants = {
    default: clsx(
      'bg-cozy-white border-2 border-cozy-light-gray text-cozy-dark-gray',
      'focus:border-cozy-sage focus:ring-cozy-sage/20',
      'placeholder:text-cozy-medium-gray',
      error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
    ),
    warm: clsx(
      'bg-cozy-cream border-2 border-cozy-terracotta/30 text-cozy-warm-brown',
      'focus:border-cozy-terracotta focus:ring-cozy-terracotta/20',
      'placeholder:text-cozy-medium-gray'
    ),
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-cozy-sm',
    md: 'px-4 py-3 text-sm rounded-cozy',
    lg: 'px-5 py-4 text-base rounded-cozy-md',
  };

  return (
    <div className="w-full">
      {label && (
        <label className={clsx(
          'block text-sm font-medium mb-2 font-cozy',
          error ? 'text-red-600' : 'text-cozy-dark-gray',
          isFocused && !error && 'text-cozy-sage'
        )}>
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 font-cozy">
          {error}
        </p>
      )}
    </div>
  );
});

InputCozy.displayName = 'InputCozy';
TextareaCozy.displayName = 'TextareaCozy';

export { InputCozy, TextareaCozy };
