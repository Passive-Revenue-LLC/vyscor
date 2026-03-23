import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050508',
          secondary: '#0a0a12',
          tertiary: '#0f0f1a',
          card: '#0d0d1f',
        },
        cyber: {
          cyan: '#00f5ff',
          cyan2: '#00bcd4',
          purple: '#7c3aed',
          purple2: '#a855f7',
          green: '#00ff88',
          amber: '#ffaa00',
          red: '#ff3366',
          pink: '#f0abfc',
        },
        border: {
          DEFAULT: '#1a1a2e',
          hover: '#252540',
        },
        muted: '#6b6b8a',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
};
export default config;
