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
        // Dollar bill paper - warm cream with subtle green undertone
        cream: {
          50: '#F7F5EC',
          100: '#F0ECDF',
          200: '#E5E0CD',
          300: '#D8D1BA',
          400: '#C9C0A5',
          500: '#B8AD8E',
        },
        // Dollar green palette
        dollar: {
          50: '#EEF3EC',
          100: '#D4E0D0',
          200: '#A8BFA0',
          300: '#7D9E72',
          400: '#5A7D4F',
          500: '#3D6B35',
          600: '#2F5429',
          700: '#234020',
          800: '#1A3018',
          900: '#12200F',
        },
        // Dark ink for text (WSJ-style deep black-green)
        navy: {
          50: '#EAEBE8',
          100: '#CDD0CA',
          200: '#A3A89D',
          300: '#7A8172',
          400: '#5A6352',
          500: '#3D4637',
          600: '#333B2E',
          700: '#2A3125',
          800: '#1F251B',
          900: '#141A11',
          950: '#0B0F09',
        },
        // Accent - muted gold (seal on dollar)
        gold: '#B8942E',
        'gold-light': '#D4B04A',
        // FT salmon for highlights/alerts
        salmon: {
          50: '#FFF5F0',
          100: '#FFE8DB',
          200: '#FFD1B8',
          300: '#FFB794',
          400: '#FF9E71',
          500: '#F2A68A',
          600: '#E8967A',
        },
        // Core page colors
        'paper-white': '#FAF9F6',
        'newsprint': '#F0EDE6',
        'ink-black': '#1A1A14',
        'rule-gray': '#C5BCAA',
      },
      fontFamily: {
        // WSJ-style: Playfair Display for that authoritative Scotch Roman feel
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        // Body text: Lora for readability in columns
        body: ['var(--font-lora)', 'Lora', 'Georgia', 'serif'],
        // Sans for UI/navigation elements
        sans: ['var(--font-franklin)', 'Libre Franklin', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'headline-lg': ['2.5rem', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
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
