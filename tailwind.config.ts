/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      strokeWidth: {
        2: '2.5px',
        3: '3px',
        4: '4px',
        6: '6px',
      },
    },
  },
  plugins: [],
}
