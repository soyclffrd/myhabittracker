/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#030303",
        primary: "#6366f1",
        secondary: "#ec4899",
      },
    },
  },
  plugins: [],
};