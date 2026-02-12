/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const generateSpacing = () => {
  const spacings = [];
  for (let i = 0; i < 48; i += 1) {
    spacings.push(i);
  }
  for (let i = 48; i < 80; i += 2) {
    spacings.push(i);
  }
  for (let i = 80; i <= 160; i += 4) {
    spacings.push(i);
  }
  const spacingObj = {};
  spacings.forEach((i) => {
    spacingObj[i] = `${i / 10}rem`;
  });
  return spacingObj;
};

module.exports = {
  corePlugins: { preflight: false }, // this line resolves a conflict with mui and tailwind
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
    spacing: {
      ...generateSpacing(),
      200: "20rem",
      440: "4.4rem",
    },
    screens: {
      xl: "1600px",
      lg: "1024px",
      md: "768px",
      sm: "350px",
    },

    // placeholder colors
    colors: {
      grey: {
        light: "#D9D9D9",
        medium: "#6A6775",
        dark: "#434547",
        soft: "#7a797e",
      },
      green: "#055935",
      sepia: "#F1EEC0",
      brown: "#806C6C",
      white: "#ffffff",
      purple: "#9974E7",
      red: "#d32f2f",
    },
  },
  plugins: [
    function ({ addComponents, addBase }) {
      addComponents({
        ".default-grid": {
          display: "grid",
          "grid-template-columns": "repeat(4, minmax(0, 1fr))",
          "column-gap": "2rem",
          "@screen md": {
            "grid-template-columns": "repeat(12, minmax(0, 1fr))",
            "column-gap": "2rem",
          },
        },
        ".container": {
          maxWidth: "100%",
          padding: "0 20px",
          "@screen md": {
            margin: "0 auto",
            padding: "0 40px",
          },
          "@screen xl": {
            maxWidth: "1440px",
            padding: "0 40px",
          },
        },
        ".font-headline-big": {
          fontFamily: "Inter",
          fontSize: "5.2rem",
          fontWeight: "900",
          "@screen md": {
            fontFamily: "Inter",
            fontSize: "10.4rem",
            fontWeight: "900",
          },
        },
        ".font-headline": {
          fontFamily: "Inter",
          fontSize: "4.8rem",
          letterSpacing: "4.8px",
          fontWeight: "900",
        },
        ".font-headline-small": {
          fontFamily: "Inter",
          fontSize: "2.4rem",
          fontWeight: "700",
        },
        ".font-body": {
          fontFamily: "Inter",
          fontSize: "1.4rem",
          fontWeight: "400",
        },
        ".font-body-bold": {
          fontFamily: "Inter",
          fontSize: "1.4rem",
          fontWeight: "700",
        },
        ".font-eyebrow": {
          fontFamily: "Inter",
          fontSize: "1.2rem",
          fontWeight: "500",
          letterSpacing: "1.2px",
        },
      });
    },
  ],
};
