/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6B1D2F',
          dark: '#521523',
          light: '#842C3F',
        },
        ivory: {
          DEFAULT: '#FDF6EC',
          dark: '#F5EAD4',
          light: '#FFFDF9',
        },
        gold: {
          DEFAULT: '#C9993B',
          dark: '#B0832F',
          light: '#DDB158',
        },
        charcoal: {
          DEFAULT: '#2C2C2C',
          dark: '#1A1A1A',
          light: '#404040',
        },
        rose: {
          DEFAULT: '#F2D9D9',
          light: '#FBEBEB',
          dark: '#E2B8B8',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
