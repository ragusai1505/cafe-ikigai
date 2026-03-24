/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coffee: { 50:'#fdf8f0',100:'#f9edd8',200:'#f2d9aa',300:'#e8be72',400:'#dc9f3e',500:'#c8851f',600:'#a96a16',700:'#8a5214',800:'#6b3d12',900:'#4a2a0d',950:'#2d1a07' },
        cream: { 50:'#fefcf8',100:'#fdf5e6',200:'#faecd0' }
      },
      fontFamily: {
        display: ['"Playfair Display"','Georgia','serif'],
        body: ['"Lato"','sans-serif'],
        mono: ['"DM Mono"','monospace'],
      },
      keyframes: {
        fadeUp:    { from:{ opacity:0, transform:'translateY(24px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:    { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp:   { from:{ opacity:0, transform:'translateY(100%)' }, to:{ opacity:1, transform:'translateY(0)' } },
        scaleIn:   { from:{ opacity:0, transform:'scale(0.95)' }, to:{ opacity:1, transform:'scale(1)' } },
        bounceSoft:{ '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
        shimmer:   { from:{ backgroundPosition:'200% center' }, to:{ backgroundPosition:'-200% center' } },
        spin:      { to:{ transform:'rotate(360deg)' } },
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':   'scaleIn 0.3s ease forwards',
        'bounce-soft':'bounceSoft 2.4s ease-in-out infinite',
        'shimmer':    'shimmer 3s linear infinite',
        'spin':       'spin 1s linear infinite',
      }
    }
  },
  plugins: [],
}
