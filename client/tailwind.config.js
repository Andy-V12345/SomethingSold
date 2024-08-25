/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-purple": "#D6C1FF",
        "primary-gray": "#545454",
        "secondary-gray": "#D9D9D9"
      }
    },
  },
  plugins: [],
}

