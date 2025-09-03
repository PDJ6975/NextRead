/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Colores cozy - Tonos tierra y naturaleza
        cozy: {
          sage: '#9CAF88',        // Verde salvia suave
          cream: '#F7F5F3',       // Crema cálido
          terracotta: '#E07A5F',  // Terracota suave
          'warm-brown': '#8D5524', // Marrón cálido
          'soft-yellow': '#F2CC8F', // Amarillo suave
          lavender: '#D4A5A5',    // Lavanda suave
          mint: '#A8D8DC',        // Menta clara
          peach: '#FFB5A7',       // Durazno
          forest: '#6B8E6B',      // Verde bosque
          white: '#FDF9F6',       // Blanco cálido
          'light-gray': '#E8E5E1', // Gris cálido claro
          'medium-gray': '#B8B3AE', // Gris cálido medio
          'dark-gray': '#6B6560',  // Gris cálido oscuro
        },
        // Colores originales (mantener compatibilidad)
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f9fafb',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Nuevas fuentes cozy
        cozy: ['Nunito', 'system-ui', 'sans-serif'],
        'cozy-display': ['Comfortaa', 'system-ui', 'sans-serif'],
        'cozy-mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        // Border radius orgánicos para elementos cozy
        'cozy-sm': '0.375rem',
        'cozy': '0.5rem',
        'cozy-md': '0.75rem',
        'cozy-lg': '1rem',
        'cozy-xl': '1.5rem',
      },
      boxShadow: {
        // Sombras suaves y naturales
        'cozy-sm': '0 2px 8px rgba(139, 85, 36, 0.08)',
        'cozy': '0 4px 20px rgba(139, 85, 36, 0.1)',
        'cozy-md': '0 6px 25px rgba(139, 85, 36, 0.12)',
        'cozy-lg': '0 10px 35px rgba(139, 85, 36, 0.15)',
        'cozy-xl': '0 20px 50px rgba(139, 85, 36, 0.2)',
      },
    },
  },
  plugins: [],
};
