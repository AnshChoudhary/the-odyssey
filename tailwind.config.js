/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#f9f6ed',
          200: '#f3ecd9',
          300: '#ebe0c5',
          400: '#dcc9a3',
          500: '#c9af81',
        },
        ink: {
          900: '#1a1512',
          800: '#2d2419',
          700: '#3f3320',
        },
        ocean: {
          100: '#e6f2f5',
          300: '#99d5e0',
          500: '#4db8cc',
          700: '#2a6b7a',
          900: '#1a4048',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
