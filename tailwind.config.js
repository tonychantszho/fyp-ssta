/** @type {import('tailwindcss').Config} */
module.exports = {
  jit: false,
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        digital: ["digital"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}