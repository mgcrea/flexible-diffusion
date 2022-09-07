/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: ["opacity-25", "opacity-75"],
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
};
