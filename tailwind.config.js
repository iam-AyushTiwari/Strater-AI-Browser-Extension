/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./**/*.tsx",
    "!./node_modules/**/*",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dc3545"
      }
    }
  },
  plugins: []
}
