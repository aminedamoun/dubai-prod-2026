/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./pages/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        'jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      colors: {
        'cyber-dark': '#000000',
        'cyber-cyan': '#00f2ff',
        'cyber-magenta': '#ff00ff',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 242, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4), 0 0 60px rgba(0, 242, 255, 0.2)',
      },
    },
  },
  plugins: [],
}