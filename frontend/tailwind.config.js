/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true
    },
    extend: {
      flexBasis: {
        '1/10': '10%',
        '9/10': '90%'
      },
      fontSize: {
        med: '40px',
        super: '100px'
      }
    },
  },
  plugins: [],
}