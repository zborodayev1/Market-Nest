/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      screens: {
        'max-mobileS': {max: '320px'},
        'max-mobileM': {max: '375px'},
        'max-mobileL': {max: '425px'},
        'max-tablet': {max: '768px'},
        'max-laptop': {max: '1024px'},
        'max-laptopL': {max: '1560px'}
      },
    },
    animation: {
      'fade-in': 'fadeIn 300ms ease-in-out'
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, filter: 'blur(30px)' },
        '100%': { opacity: 1, filter: 'blur(0px)' },
      },
    },
    filter: {
      'blur': 'blur(5px)',
    },
  },
  plugins: [],
}

