/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        midnight: '#0a0d18',
        nebula: '#1b1f33',
        stardust: '#9aa4b2',
        arcane: '#7dd3fc',
        arcaneDeep: '#0284c7',
        ember: '#f59e0b',
        emerald: '#34d399',
      },
      boxShadow: {
        glow: '0 0 30px rgba(125, 211, 252, 0.35)',
        ember: '0 0 35px rgba(245, 158, 11, 0.35)',
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(125, 211, 252, 0.25)' },
          '50%': { boxShadow: '0 0 32px rgba(125, 211, 252, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        levelUp: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '20%': { opacity: 1, transform: 'scale(1.05)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        floatIn: 'floatIn 0.6s ease-out both',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        levelUp: 'levelUp 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
