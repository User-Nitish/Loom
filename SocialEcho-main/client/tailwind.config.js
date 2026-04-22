/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      letterSpacing: {
        'tightest': '-0.075em',
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'extra-wide': '0.4em',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'minimal': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(255, 255, 255, 0.08)',
        'glass-card': '0 4px 16px 0 rgba(255, 255, 255, 0.04)',
        'glow': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-lg': '0 0 40px rgba(6, 182, 212, 0.4)',
      },
      colors: {
        // Flattened Vintage Palette for better PostCSS compatibility
        'v-maroon': '#3E1515',
        'v-brick': '#7D1616',
        'v-red': '#FA2626',
        'v-orange': '#FA9A17',
        'v-yellow': '#FADB17',
        'v-cyan': '#1BCEDC',
        'v-teal': '#417E8C',
        'v-paper': '#FDFBF7',
        'v-ink': '#2A1F1D',
        
        neutral: {
          50: '#FDFBF7',
          100: '#F4F1E1',
          200: '#E5DFCD',
          300: '#C9C2AA',
          400: '#A19A82',
          500: '#7D7661',
          600: '#5A5443',
          700: '#417E8C',
          800: '#3E1515',
          900: '#2A1F1D',
          950: '#17110F',
        },
        secondary: {
          50: '#fdf4f6',
          100: '#fae4e8',
          200: '#f4c3cd',
          300: '#ea99a8',
          400: '#db657b',
          500: '#7D1616',  // Brick Red
          600: '#a30822',
          700: '#83061b',
          800: '#640515',
          900: '#3E1515',  // Maroon
          950: '#330310',
        },
        accent: {
          50: '#ebfdfb',
          100: '#ccfbf4',
          200: '#9ff5ea',
          300: '#67ecda',
          400: '#FA2626', // Vibrant Red
          500: '#FA9A17', // Orange
          600: '#FADB17', // Yellow
          700: '#069085',
          800: '#1BCEDC', // Cyan
          900: '#045f59',
          950: '#023835',
        },
        // Semantic colors
        background: 'var(--theme-bg)',
        surface: 'var(--theme-surface)',
        card: 'var(--theme-card)',
        border: 'var(--theme-border)',
        text: {
          primary: 'var(--theme-text-primary)',
          secondary: 'var(--theme-text-secondary)',
          tertiary: 'var(--theme-text-tertiary)',
        },
        success: '#10b981',
        warning: '#FA9A17',
        error: '#FA2626',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },

  plugins: [],
};
