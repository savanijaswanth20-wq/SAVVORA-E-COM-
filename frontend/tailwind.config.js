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
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        apple: '20px',
        '2xl': '16px',
        '3xl': '24px',
      },
      height: {
        navpill: '44px',
      },
      boxShadow: {
        pill: '0 4px 14px 0 rgba(0, 0, 0, 0.06)',
        'pill-hover': '0 6px 20px rgba(37, 99, 235, 0.15)',
        'apple-card': '0 8px 30px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}



