/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sciFi: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

