/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      screens: {
        'max-mobileS': { max: '320px' },
        'max-mobileM': { max: '375px' },
        'max-mobileL': { max: '425px' },
        'max-tablet': { max: '768px' },
        'max-laptop': { max: '1024px' },
        'max-laptopL': { max: '1560px' },
      },
    },
    animation: {
      'fade-in': 'fadeIn 300ms ease-in-out',
      glow: 'glow 1.5s infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, filter: 'blur(30px)' },
        '100%': { opacity: 1, filter: 'blur(0px)' },
      },
      glow: {
        '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
        '50%': { transform: 'scale(1.2)', opacity: '1' },
      },
    },
    filter: {
      blur: 'blur(5px)',
    },
    txSh: {
      sm: '1px 1px 2px rgba(0, 0, 0, 0.5)', // Маленькая тень
      '-sm': '-1px -1px 2px rgba(0, 0, 0, 0.5)',
      df: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Стандартная тень
      '-df': '-2px -2px 4px rgba(0, 0, 0, 0.6)',
      lg: '3px 3px 6px rgba(0, 0, 0, 0.6)', // Большая тень
      '-lg': '-3px -3px 6px rgba(0, 0, 0, 0.6)',
      xl: '4px 4px 8px rgba(0, 0, 0, 0.6)', // Очень большая тень
      '-xl': '-4px -4px 8px rgba(0, 0, 0, 0.6)',
    },
  },
  plugins: [],
}
