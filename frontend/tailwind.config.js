/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          hover: '#0A3A63',
          50: '#EAF2F8',
          100: '#CFE0EE',
          500: '#0F4C81',
          600: '#0A3A63',
          900: '#082C4B',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          hover: '#0F9488',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#3B82F6',
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          border: '#E2E8F0',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        dark: {
          bg: '#0B1220',
          card: '#111827',
          sidebar: '#0E1626',
          border: '#1F2A3C',
          text: '#E5EAF1',
          subtext: '#8B98AC',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        card: '0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.06)',
        elevated: '0 10px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.04)',
        'glow-primary': '0 0 0 1px rgba(15,76,129,0.08), 0 8px 24px -8px rgba(15,76,129,0.35)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
