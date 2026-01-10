/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Deep Slate
          light: '#334155',   // Lighter slate
        },
        accent: {
          DEFAULT: '#f59e0b', // Industrial Amber
          hover: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'], // Added for Arabic pages
      },
    },
  },
  plugins: [],
}