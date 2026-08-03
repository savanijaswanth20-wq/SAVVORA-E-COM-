/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        savvora: {
          bg: "#0B0B10",
          blue: "#2563EB",
          gold: "#F5B301",
          cardBg: "rgba(18, 18, 28, 0.75)",
          border: "rgba(255, 255, 255, 0.12)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
