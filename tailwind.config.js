/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080b26',
          900: '#0b0f2e',
          800: '#12163a',
          700: '#1a1f45',
          600: '#252b55',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e8c468',
        },
        cream: {
          DEFAULT: '#f5f3ec',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'scroll-slow': 'scroll 45s linear infinite',
        'scroll-reverse': 'scroll 30s linear infinite reverse',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
}
