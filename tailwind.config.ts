/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: "#8594D6",
          700: "#4B4ADB",
          800: "#3C3DBF",
        },
        gray: {
          100: "#f3f4f6",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
        PeydaThin: ["PEYDA-REGULAR", "cursive"],
        PeydaRegular: ["PEYDA-THIN", "cursive"],
        PeydaBold: ["PEYDA-BOLD", "cursive"],
        PeydaBlack: ["PEYDA-BLACK", "cursive"],
        PeydaMedium: ["PEYDA-MEDIUM", "cursive"],
      },
    },
  },
  plugins: [],
};
