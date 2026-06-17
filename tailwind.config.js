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
        bg: '#0a0a0a',
        surface: '#111113',
        elevated: '#17171a',
        border: '#26262b',
        fg: '#e7e7ea',
        muted: '#9a9aa3',
        accent: {
          DEFAULT: '#f59e0b',
          soft: '#fbbf24',
          deep: '#b45309',
        },
        product: {
          smartfiles: '#38bdf8',
          numstore: '#f59e0b',
          enterprise: '#a78bfa',
        },
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
