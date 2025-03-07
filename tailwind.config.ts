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
        primary: "#1763F3",
        secondary: "#0C1B2A",
        text1: "#ffff",
        text2: "#91B3F6",
        text3: "#4F73B8",
        gra: {
          100: "#1767FF",
          200: "#1B4DAC",
        },
        cardbg: "#12263A",
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
