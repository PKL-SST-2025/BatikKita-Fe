/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
            transitionProperty: {
        spacing: "margin, padding",
            },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        scaleFade: "scaleFade 0.8s ease-out forwards",
        orbit: "spin 12s linear infinite",
        'spin-slow': 'spin 5s linear infinite',
        'orbit': 'orbit 10s linear infinite',
        'orbit-reverse': 'orbit-reverse 12s linear infinite',
        'fade-in': 'fadeIn 1s ease-in-out both',
        'float': 'float 8s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        scaleFade: {
    "0%": { opacity: 0, transform: "scale(0.6)" },
    "100%": { opacity: 1, transform: "scale(1)" },
        },
        orbit: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '100%': { transform: 'translate(0, 0) rotate(360deg)' },
        },
        'orbit-reverse': {
          '0%': { transform: 'translate(0, 0) rotate(360deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwindcss-animate'),
  ],
};
