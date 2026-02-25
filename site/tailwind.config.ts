import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NYT-inspired cream/sepia palette
        cream: {
          50: '#FDF8F0',
          100: '#FAF0E1',
          200: '#F5E6CF',
          300: '#EDD9B7',
          400: '#E5CC9F',
          500: '#D4B896',
        },
        // FT salmon accent
        salmon: {
          50: '#FFF5F0',
          100: '#FFE8DB',
          200: '#FFD1B8',
          300: '#FFB794',
          400: '#FF9E71',
          500: '#F2A68A',
          600: '#E8967A',
        },
        // Dark navy for text
        navy: {
          50: '#E8EBF0',
          100: '#C4CAD6',
          200: '#9DA7BA',
          300: '#76849E',
          400: '#586A89',
          500: '#3B5075',
          600: '#33476B',
          700: '#2A3B5E',
          800: '#223052',
          900: '#151E39',
          950: '#0D1526',
        },
        // Accent colors
        gold: '#C9A84C',
        'ink-black': '#1A1A1A',
        'paper-white': '#F4EDDB',
        'newsprint': '#EDE5D0',
        'rule-gray': '#C8C0AD',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        body: ['var(--font-source-serif)', 'Source Serif 4', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'headline-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'headline-md': ['1.75rem', { lineHeight: '1.2' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      maxWidth: {
        'article': '720px',
        'content': '1200px',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};

export default config;
