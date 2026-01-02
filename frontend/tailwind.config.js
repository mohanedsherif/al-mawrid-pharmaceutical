/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // AL-MAWRID PHARMACEUTICALS Brand Colors
        primary: {
          50: '#E8EDF2',
          100: '#D1DBE5',
          200: '#A3B7CB',
          300: '#7593B1',
          400: '#476F97',
          500: '#2A5374', // Ocean Blue (main primary)
          600: '#1E3A5F', // Deep Research Blue (primary-dark)
          700: '#162C47',
          800: '#0F1E2F',
          900: '#081017',
          950: '#04080B',
          dark: '#1E3A5F',
        },
        secondary: {
          50: '#E5F1F4',
          100: '#CCE3E9',
          200: '#99C7D3',
          300: '#66ABBD',
          400: '#4A90A1',
          500: '#367D8E', // Teal Flow
          600: '#2B6370',
          700: '#204952',
          800: '#152F34',
          900: '#0A1517',
        },
        accent: {
          50: '#E5F5F5',
          100: '#CCEBEB',
          200: '#99D7D7',
          300: '#66C3C3',
          400: '#54B6B6',
          500: '#42A9A9', // Aqua Stream
          600: '#358787',
          700: '#286565',
          800: '#1A4343',
          900: '#0D2121',
        },
        cta: {
          50: '#E5F9F8',
          100: '#CCF3F1',
          200: '#99E7E3',
          300: '#66DBD5',
          400: '#5AD4CE',
          500: '#4ECDC4', // Life-Giving Turquoise
          600: '#3EA49D',
          700: '#2E7B76',
          800: '#1F524E',
          900: '#0F2927',
        },
        // Brand aliases for semantic use
        'brand-dark': '#1E3A5F',
        'brand-primary': '#2A5374',
        'brand-secondary': '#367D8E',
        'brand-accent': '#42A9A9',
        'brand-cta': '#4ECDC4',
      },
      fontFamily: {
        heading: ['Poppins', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.16)',
        'hover': '0 12px 32px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'flow-gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-flow': 'linear-gradient(-45deg, #2A5374, #367D8E, #42A9A9, #4ECDC4, #42A9A9, #367D8E, #2A5374)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(78, 205, 196, 0.1), transparent 50%), radial-gradient(at 100% 0%, rgba(66, 169, 169, 0.1), transparent 50%), radial-gradient(at 100% 100%, rgba(54, 125, 142, 0.1), transparent 50%), radial-gradient(at 0% 100%, rgba(42, 83, 116, 0.1), transparent 50%)',
      },
    },
  },
  plugins: [],
}

