/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'utah-red': '#cc0000',
      },
      screens: {
        '3xl': '1890px',
      },
    }
  },
  plugins: []
}