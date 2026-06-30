/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg:       'rgb(var(--c-bg) / <alpha-value>)',
        surface:  'rgb(var(--c-surface) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        border:   'rgb(var(--c-border) / <alpha-value>)',
        fg:       'rgb(var(--c-fg) / <alpha-value>)',
        muted:    'rgb(var(--c-muted) / <alpha-value>)',
        accent: {
          DEFAULT: '#1c3a7a',
          soft:    '#4a6cd9',
          deep:    '#142a5a',
        },
        secondary: {
          DEFAULT: '#c0391b',
          soft:    '#e04a2c',
          deep:    '#8e2613',
        },
        product: {
          smartfiles: '#4a6cd9',
          numstore:   '#1c3a7a',
          enterprise: '#c0391b',
        },
      },
      maxWidth: {
        container: '1100px',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
