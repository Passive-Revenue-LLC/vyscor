import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vyscor brand palette
        vyscor: {
          purple: '#6B00F0',
          'purple-light': '#7C4CFF',
          'purple-dark': '#5A00CC',
          black: '#1B1B1B',
          white: '#FFFFFF',
        },
        // Backgrounds — dark-first
        bg: {
          primary: '#111111',
          secondary: '#1B1B1B',
          tertiary: '#1B1B1B',
          card: '#1B1B1B',
        },
        // Legacy "cyber" tokens remapped to Vyscor purple/grays so existing
        // class names keep working with brand-correct colors.
        cyber: {
          cyan: '#7C4CFF',
          cyan2: '#6B00F0',
          purple: '#6B00F0',
          purple2: '#7C4CFF',
          green: '#7C4CFF',
          amber: '#AAAAAA',
          red: '#6B00F0',
          pink: '#7C4CFF',
        },
        border: {
          DEFAULT: '#252525',
          hover: '#3A3A3A',
        },
        muted: '#6B6B6B',
      },
      fontFamily: {
        // Single brand font: Syncopate
        syncopate: ['Syncopate', 'sans-serif'],
        orbitron: ['Syncopate', 'sans-serif'],
        mono: ['Syncopate', 'sans-serif'],
        body: ['Syncopate', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.05em',
        'brand-label': '0.1em',
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
};
export default config;
