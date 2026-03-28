/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colors extracted from Cafe Ikigai logo
        brand: {
          50:  '#fdf4f6',
          100: '#fae8ed',
          200: '#f5d0da',
          300: '#edaabb',
          400: '#e07a96',
          500: '#c4526e',  // mid
          600: '#8B3A52',  // PRIMARY - logo bird/text color
          700: '#6B2D3E',  // DARK - tagline color
          800: '#4a1f2b',
          900: '#2d1219',
          950: '#1a0a10',
        },
        blush: {
          50:  '#fef8f9',
          100: '#fdf0f3',
          200: '#F2C4CE',  // SECONDARY - logo circle background
          300: '#e8a0b0',
          400: '#d97a92',
          500: '#c4526e',
        },
        // Keep coffee for backward compat but map to brand
        coffee: {
          50:  '#fdf4f6',
          100: '#fae8ed',
          200: '#f5d0da',
          300: '#edaabb',
          400: '#d97a92',
          500: '#c4526e',
          600: '#8B3A52',
          700: '#6B2D3E',
          800: '#4a1f2b',
          900: '#2d1219',
          950: '#1a0a10',
        },
        cream: {
          50:  '#fffbfc',
          100: '#fef6f8',
          200: '#fdeef2',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Lato"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        fadeUp:     { from:{ opacity:0, transform:'translateY(24px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:     { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp:    { from:{ opacity:0, transform:'translateY(100%)' }, to:{ opacity:1, transform:'translateY(0)' } },
        scaleIn:    { from:{ opacity:0, transform:'scale(0.95)' }, to:{ opacity:1, transform:'scale(1)' } },
        bounceSoft: { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':   'scaleIn 0.3s ease forwards',
        'bounce-soft':'bounceSoft 2.4s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
