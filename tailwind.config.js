/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A192F', // Bleu nuit profond
          light: '#F8FAFC', // Blanc cassé / pur
          gold: '#C5A059', // Accents dorés
          emerald: '#10B981', // Accents émeraudes
          dark: '#020C1B'
        }
      }
    },
  },
  plugins: [],
}
