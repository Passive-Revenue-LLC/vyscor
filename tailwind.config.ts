import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vyscor brand palette — blue primary
        vyscor: {
          primary: '#354FE3',
          'primary-light': '#3E60EA',
          'primary-dark': '#2A3FB8',
          // Legacy aliases (kept so old class names keep working)
          purple: '#354FE3',
          'purple-light': '#3E60EA',
          'purple-dark': '#2A3FB8',
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
        // Legacy "cyber" tokens remapped to the new blue primary + semantic
        // status colors. Existing class names keep working, content-level
        // color fixes are done per-component.
        cyber: {
          cyan: '#354FE3',
          cyan2: '#354FE3',
          purple: '#354FE3',
          purple2: '#3E60EA',
          green: '#10B981',
          amber: '#AAAAAA',
          red: '#354FE3',
          pink: '#354FE3',
        },
        border: {
          DEFAULT: '#252525',
          hover: '#3A3A3A',
        },
        muted: '#6B6B6B',
      },
      fontFamily: {
        // Syncopate: brand display font, always uppercase, titles/nav/logo only
        syncopate: ['Syncopate', 'sans-serif'],
        // Inter: content font — team names, scores, descriptions, everything else
        inter: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
        // Orbitron alias kept so existing class names keep resolving to
        // Syncopate for section headings.
        orbitron: ['Syncopate', 'sans-serif'],
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
