/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        neuropol: ['Neuropol', 'sans-serif'],  // Ovo se podudara sa @font-face
      },
    },
  },
  plugins: [],
};