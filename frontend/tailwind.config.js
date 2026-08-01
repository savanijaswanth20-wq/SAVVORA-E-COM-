/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        'background-dark': '#111827',
        surface: '#F8FAFC',
        'surface-dark': '#1F2937',
        savvora: {
          black: '#111827',
          white: '#FFFFFF',
          blue: '#2563EB',
          gray: '#F8FAFC',
          border: '#E5E7EB',
          text: '#111827',
          muted: '#6B7280',
        },
        apple: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          dark: '#111827',
          gray: '#6B7280',
          light: '#F8FAFC',
          border: '#E5E7EB',
        },
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
        grotesk: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        pill:  '9999px',
        apple: '20px',
        '2xl': '16px',
        '3xl': '24px',
      },
      height: {
        navpill: '44px',
      },
      boxShadow: {
        pill:           '0 4px 14px 0 rgba(0, 0, 0, 0.06)',
        'pill-hover':   '0 6px 20px rgba(37, 99, 235, 0.15)',
        'apple-card':   '0 8px 30px rgba(0, 0, 0, 0.04)',
        'auth-card':    '0 40px 80px -20px rgba(0,0,0,0.80), 0 20px 40px -15px rgba(99,102,241,0.18)',
        'auth-btn':     '0 10px 24px -6px rgba(99,102,241,0.55)',
      },
      keyframes: {
        'aurora-shift': {
          '0%,100%': { backgroundPosition: '0% 50%'   },
          '25%':     { backgroundPosition: '50% 100%' },
          '50%':     { backgroundPosition: '100% 50%' },
          '75%':     { backgroundPosition: '50% 0%'   },
        },
        'orb-float': {
          '0%,100%': { transform: 'translate(0,0) scale(1)'          },
          '33%':     { transform: 'translate(18px,-28px) scale(1.04)' },
          '66%':     { transform: 'translate(-14px,20px) scale(0.97)' },
        },
        'orb-pulse': {
          '0%,100%': { opacity: '0.55' },
          '50%':     { opacity: '0.75' },
        },
        'particle-drift': {
          '0%':   { transform: 'translateY(0) translateX(0) scale(1)',        opacity: '0'   },
          '10%':  { opacity: '1'   },
          '90%':  { opacity: '0.6' },
          '100%': { transform: 'translateY(-120px) translateX(30px) scale(0.6)', opacity: '0' },
        },
      },
      animation: {
        'aurora-shift':    'aurora-shift 18s ease infinite',
        'orb-float':       'orb-float 20s ease-in-out infinite',
        'orb-pulse':       'orb-pulse 8s ease-in-out infinite',
        'particle-drift':  'particle-drift 10s linear infinite',
      },
    },
  },
  plugins: [],
}



