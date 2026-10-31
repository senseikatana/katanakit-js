/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}",
    "./packages/ui/**/*.{js,ts,jsx,tsx,scss}"
  ],
  theme: {
    extend: {
      // Aquí puedes extender el tema de TailwindCSS
      // Por ejemplo, puedes añadir colores de Bulma
      colors: {
        'bulma-primary': '#00d1b2',
        'bulma-secondary': '#209cee',
        'bulma-dark': '#23d160',
        'bulma-light': '#3273dc',
      }
    }
  },
  plugins: []
}