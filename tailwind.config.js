/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf6f8',
          100: '#faeaee',
          200: '#f3cdd6',
          300: '#e8a4b4',
          400: '#d97090',
          500: '#c4526e',
          600: '#8B3A52',  // PRIMARY logo color
          700: '#6B2D3E',  // DARK logo color
          800: '#4a1f2b',
          900: '#2d1219',
          950: '#1a0a10',
        },
        blush: {
          50:  '#fef8f9',
          100: '#fdf0f3',
          200: '#F2C4CE',  // Logo circle color
          300: '#e8a0b0',
        },
        cream: {
          50:  '#fdfaf8',
          100: '#faf4ef',
          200: '#f5e8df',
        },
        warm: {
          50:  '#faf8f5',
          100: '#f3ede6',
          200: '#e8ddd3',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Lato"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        fadeUp:     { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:     { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp:    { from:{ opacity:0, transform:'translateY(100%)' }, to:{ opacity:1, transform:'translateY(0)' } },
        scaleIn:    { from:{ opacity:0, transform:'scale(0.95)' }, to:{ opacity:1, transform:'scale(1)' } },
        bounceSoft: { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-6px)' } },
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
