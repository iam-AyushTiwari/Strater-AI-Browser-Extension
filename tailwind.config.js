/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./**/*.tsx", "!./node_modules/**/*"],
  theme: {
    extend: {
      colors: {
        primary: "#dc3545"
      }
    }
  },
  plugins: []
}
