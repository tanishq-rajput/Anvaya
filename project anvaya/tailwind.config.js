/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Foundation Brand Palette
        cream: {
          DEFAULT: '#FAF8F3',
          50: '#FDFCF9',
          100: '#FAF8F3',
          200: '#F3EDE2',
        },
        linen: {
          DEFAULT: '#F3EDE2',
          light: '#F8F4EC',
          dark: '#E7DDD0',
        },
        ivory: {
          DEFAULT: '#FAF8F3',
          50: '#FDFCF9',
          100: '#FAF8F3',
          200: '#F3EDE2',
          300: '#E7DDD0',
          400: '#D5C4AF',
        },
        forest: {
          DEFAULT: '#34483A',
          hover: '#2A3B2F',
          dark: '#212F25',
          light: '#425A49',
          accent: '#4E6A56',
          soft: '#EAF0EC',
        },
        walnut: {
          DEFAULT: '#76543C',
          light: '#8C664B',
          dark: '#5D422F',
          soft: '#F4ECE4',
        },
        espresso: {
          DEFAULT: '#49382C',
          900: '#2E221A',
          800: '#3D2F25',
          700: '#49382C',
          600: '#5F4A3B',
          500: '#755C4A',
          400: '#91745E',
          300: '#B0957F',
          200: '#D2C0B0',
        },
        taupe: {
          DEFAULT: '#B7A58D',
          light: '#CBC0AF',
          dark: '#9B8971',
          subtle: '#EAE3D9',
        },
        // Dressing Room Interior Palette
        'slate-blue': {
          DEFAULT: '#788E9C',
          light: '#8FA3B0',
          dark: '#627683',
        },
        'pale-mist': {
          DEFAULT: '#D5DDE0',
          light: '#E2E8EA',
          dark: '#C1CBD0',
        },
        'espresso-brown': {
          DEFAULT: '#49382C',
          light: '#5D493B',
          dark: '#36281E',
        },
        'silver-blue': {
          DEFAULT: '#A9B8C2',
          light: '#BAC6CE',
          dark: '#94A4AF',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.28em',
        'subtle-luxury': '0.18em',
        'wide-editorial': '0.22em',
        'tight-editorial': '-0.02em',
      },
      lineHeight: {
        'relaxed-editorial': '1.75',
      },
      boxShadow: {
        'luxury-subtle': '0 20px 40px -15px rgba(73, 56, 44, 0.06)',
        'luxury-hover': '0 30px 60px -20px rgba(52, 72, 58, 0.12)',
        'editorial': '0 4px 20px -2px rgba(73, 56, 44, 0.04)',
      },
    },
  },
  plugins: [],
}
