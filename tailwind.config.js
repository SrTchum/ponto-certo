/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          0: "#071427",
          1: "#0a1b33",
          2: "#0e2542",
        },
        surface: {
          1: "#14283f",
          2: "#1b314a",
        },
        border: {
          1: "#203a57",
          2: "#2a4a6b",
        },
        text: {
          1: "#e7eef9",
          2: "#b9c7da",
          3: "#7f93ae",
        },
        primary: "#f97316",
        accentBlue: "#2563eb",
        success: "#22c55e",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}