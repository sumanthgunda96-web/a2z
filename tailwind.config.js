/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#dc2626', // red-600
          light: '#ef4444', // red-500
          dark: '#991b1b', // red-800
        },
        secondary: {
          DEFAULT: '#fbbf24', // amber-400
          light: '#fcd34d', // amber-300
          dark: '#f59e0b', // amber-500
        },
        cream: {
          DEFAULT: '#fdfbf7',
          dark: '#f5f0e6',
        },
        slate: {
          DEFAULT: '#1f2937',
          light: '#374151',
        },
        night: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
