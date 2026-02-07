import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 900: '#0a0a0f', 800: '#111827', 700: '#1f2937' },
      },
    },
  },
  plugins: [],
} satisfies Config;
