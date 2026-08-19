import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          DEFAULT: '#1A3630',
          light: '#1E4038',
          dark: '#16302A',
        },
        card: {
          DEFAULT: '#F2ECDE',
          warm: '#EDE7D9',
          border: '#D9D0BE',
        },
        gold: {
          DEFAULT: '#D4A72C',
          light: '#E7BE3E',
          dark: '#C9A227',
          muted: '#A8841F',
        },
        pin: {
          DEFAULT: '#C0392B',
          light: '#E74C3C',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        label: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 6px 16px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
        pin: '0 1px 3px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'card-in': 'card-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
