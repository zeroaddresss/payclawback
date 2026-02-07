import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0c0f14',
          raised: '#13161d',
          overlay: '#1a1e27',
        },
        accent: {
          DEFAULT: '#4a9090',
          foreground: '#e8e6e3',
        },
        warm: {
          DEFAULT: '#c27c5e',
          foreground: '#e8e6e3',
        },
        background: '#0c0f14',
        foreground: '#e8e6e3',
        card: {
          DEFAULT: '#13161d',
          foreground: '#e8e6e3',
        },
        popover: {
          DEFAULT: '#13161d',
          foreground: '#e8e6e3',
        },
        primary: {
          DEFAULT: '#4a9090',
          foreground: '#e8e6e3',
        },
        secondary: {
          DEFAULT: '#1a1e27',
          foreground: '#a1a1aa',
        },
        muted: {
          DEFAULT: '#1a1e27',
          foreground: '#71717a',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#e8e6e3',
        },
        border: '#242830',
        input: '#242830',
        ring: '#4a9090',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
