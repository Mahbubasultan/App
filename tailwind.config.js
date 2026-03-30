/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#065F46',
          dark: '#064E3B',
          light: '#047857',
        },
        secondary: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
        },
        accent: {
          orange: '#F97316',
          blue: '#3B82F6',
          red: '#EF4444',
          purple: '#A855F7',
          yellow: '#F59E0B',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: {
          white: '#FFFFFF',
          gray: '#F9FAFB',
          light: '#F3F4F6',
        },
        text: {
          dark: '#111827',
          gray: '#6B7280',
          light: '#9CA3AF',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
        'gradient-orange': 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        'gradient-red': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        'gradient-purple': 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'green': '0 4px 12px rgba(6, 95, 70, 0.2)',
        'orange': '0 4px 12px rgba(249, 115, 22, 0.2)',
        'blue': '0 4px 12px rgba(59, 130, 246, 0.2)',
        'red': '0 4px 12px rgba(239, 68, 68, 0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'spin-wheel': 'spinWheel 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spinWheel: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(1440deg)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
