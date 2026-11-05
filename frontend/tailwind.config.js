/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bodo-yellow': '#FFE600',
        'bodo-accent-red': '#8B2635',
        'bodo-terracotta': '#A64B2A',
        'bg-warm': '#FAF8F5',
        'paper-card': '#F4EFE6',
        'ink-black': '#171513',
      },
    },
  },
  plugins: [],
};
