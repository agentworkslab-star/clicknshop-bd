import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1440px' } },
    extend: {
      colors: {
        // Map to new CSS variables (DARK MODE by default)
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        surface: { DEFAULT: 'var(--bg-primary)', 2: 'var(--bg-secondary)', 3: 'var(--bg-tertiary)' },
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',

        // Brand accents
        'accent-blue': '#3b82f6',
        'accent-purple': '#8b5cf6',
        'accent-cyan': '#06b6d4',
        'accent-green': '#10b981',
        'accent-pink': '#ec4899',

        // shadcn-style aliases
        primary: { DEFAULT: '#3b82f6', foreground: '#ffffff' },
        secondary: { DEFAULT: '#8b5cf6', foreground: '#ffffff' },
        muted: { DEFAULT: 'rgba(255,255,255,0.04)', foreground: '#94a3b8' },
        accent: { DEFAULT: '#3b82f6', foreground: '#ffffff' },
        destructive: { DEFAULT: '#ef4444', foreground: '#ffffff' },
        success: { DEFAULT: '#10b981', foreground: '#ffffff' },
        warning: { DEFAULT: '#f59e0b', foreground: '#ffffff' },
        card: { DEFAULT: 'var(--bg-card)', foreground: 'var(--text-primary)' },
        popover: { DEFAULT: 'var(--bg-tertiary)', foreground: 'var(--text-primary)' },
        border: 'rgba(255,255,255,0.08)',
        input: 'rgba(255,255,255,0.08)',
        ring: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        bangla: ['Hind Siliguri', 'Inter', 'sans-serif'],
      },
      borderRadius: { lg: '1rem', md: '0.625rem', sm: '0.375rem' },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(59, 130, 246, 0.35)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.35)',
        'card': '0 0 0 1px rgba(255,255,255,0.04)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'pulse-slow': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        'glow-pulse': { '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }, '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
