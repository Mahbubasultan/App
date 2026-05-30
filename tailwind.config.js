/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fintech color palette
        sidebar: '#14532D',
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A', // Primary Action Color
          700: '#15803D',
          800: '#166534',
          900: '#145231',
          DEFAULT: '#16A34A',
          dark: '#15803D',
          light: '#4ADE80',
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
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#145231',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        background: {
          white: '#FFFFFF',
          light: '#F0FDF4', // Very light green
          gray: '#F9FAFB',
        },
        text: {
          primary: '#1F2937',   // Primary text
          secondary: '#6B7280', // Secondary text
          dark: '#111827',
          gray: '#6B7280',
          light: '#9CA3AF',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
        'gradient-green': 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
        'gradient-orange': 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        'gradient-red': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        'gradient-purple': 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'green': '0 4px 12px rgba(22, 163, 74, 0.15)',
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
