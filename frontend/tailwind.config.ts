import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-dark': '#141A26',
        'cosmic-blue': '#42708C',
        'cosmic-light': '#80ADBF',
        'cosmic-gold': '#F2BF91',
        'cosmic-red': '#733C3C',
        'cosmic-white': '#E8F1F5',
        'cosmic-gray': '#9BADB8',
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #1e2a3a 0%, #141A26 60%, #0a0e17 100%)',
        'cosmic-header': 'linear-gradient(135deg, #141A26 0%, #1a2535 50%, #141A26 100%)',
        'cosmic-key-correct': 'linear-gradient(135deg, #F2BF91 0%, #d4a06a 100%)',
        'cosmic-key-present': 'linear-gradient(135deg, #42708C 0%, #2d5269 100%)',
        'cosmic-key-absent': 'linear-gradient(135deg, #1e2a3a 0%, #141A26 100%)',
        'tile-correct': 'linear-gradient(135deg, #F2BF91 0%, #d4a06a 100%)',
        'tile-present': 'linear-gradient(135deg, #42708C 0%, #2d5269 100%)',
        'tile-absent': 'linear-gradient(135deg, #2a3545 0%, #1e2a3a 100%)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shooting-star': 'shootingStar 3s linear infinite',
        'tile-flip': 'tileFlip 0.5s ease-in-out',
        'tile-bounce': 'tileBounce 0.3s ease-out',
        'tile-shake': 'tileShake 0.5s ease-out',
        'key-press': 'keyPress 0.1s ease-out',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.2', transform: 'scale(0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #F2BF91, 0 0 10px #F2BF91' },
          '100%': { boxShadow: '0 0 15px #F2BF91, 0 0 30px #F2BF91, 0 0 45px #F2BF91' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(-100px) translateY(0px)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateX(calc(100vw + 200px)) translateY(200px)', opacity: '0' },
        },
        tileFlip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        },
        tileBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        tileShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-4px)' },
          '30%, 70%': { transform: 'translateX(4px)' },
        },
        keyPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
