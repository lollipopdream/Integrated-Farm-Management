/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#2d6a4f',
          'green-light': '#52b788',
          'green-pale': '#d8f3dc',
          yellow: '#f4a261',
          'yellow-light': '#fde8c8',
          brown: '#6b4226',
          sky: '#0077b6',
          'sky-light': '#90e0ef',
          red: '#e63946',
          'red-light': '#ffd6d6',
          gray: '#f8f9fa',
        }
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
