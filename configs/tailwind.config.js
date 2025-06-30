/** @type {import('tailwindcss').Config} */

const { colors, spacing, layout, typography, shadows, breakpoints, gradients } = require('../src/design-system/tokens');

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        ...colors['dark-yellow'],
        ...colors['light-yellow'],
        ...colors['dark-green'],
        ...colors['light-green'],
        ...colors['dark-purple'],
        ...colors['light-purple'],
        'dark-yellow': colors['dark-yellow'],
        'light-yellow': colors['light-yellow'],
        'dark-green': colors['dark-green'],
        'light-green': colors['light-green'],
        'dark-purple': colors['dark-purple'],
        'light-purple': colors['light-purple'],
        'logo-green': colors.logo.green,
        'logo-lime': colors.logo.lime,
        'logo-brown': '#8B5A2B',
        'neutral': colors['neutral'],
        'feedback': colors['feedback'],
        primary: {
          50: colors['light-green'][1],
          100: colors['light-green'][2],
          200: colors['light-green'][3],
          300: colors['light-green'][4],
          400: colors['dark-green'][4],
          500: colors['dark-green'][3],
          600: colors['dark-green'][2],
          700: colors['dark-green'][1],
          800: colors['dark-green'][7],
          900: colors['dark-green'][5],
        },
        blue: {
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        yellow: {
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
      spacing: {
        ...spacing.desktop,
        ...spacing.tablet,
        ...spacing.mobile,
        'navbar': '80px',
        'navbar-mobile': '56px',
      },
      maxWidth: {
        'layout': layout['max-width'],
      },
      padding: {
        'section': layout['section-padding'],
      },
      height: {
        'navbar': layout['navbar-height'],
        'navbar-mobile': layout['navbar-height-mobile'],
        'product-card': '400px',
      },
      aspectRatio: {
        'product-card': '0.7',
      },
      fontFamily: {
        sans: typography['font-family'].base.split(','),
        heading: typography['font-family'].heading.split(','),
        brand: typography['font-family'].brand.split(','),
        arabic: ['Cairo', ...typography['font-family'].base.split(',')],
        'arabic-heading': ['Cairo', ...typography['font-family'].heading.split(',')],
        catalog: ['Playfair Display', ...typography['font-family'].heading.split(',')],
      },
      lineHeight: {
        tight: typography['line-height'].tight,
        base: typography['line-height'].base,
        relaxed: typography['line-height'].relaxed,
      },
      fontWeight: {
        light: typography['font-weight'].light,
        regular: typography['font-weight'].regular,
        medium: typography['font-weight'].medium,
        semibold: typography['font-weight'].semibold,
        bold: typography['font-weight'].bold,
      },
      boxShadow: {
        ...shadows,
        'navbar-dropdown': '0 10px 25px rgba(0,0,0,0.2)',
        'navbar-control': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'hover-elevate': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        'xs': '420px', // Custom breakpoint for extra small screens
        'mobile': `${breakpoints.mobile}px`,
        'tablet': `${breakpoints.tablet}px`,
        'laptop': `${breakpoints.laptop}px`,
        'desktop': `${breakpoints.desktop}px`,
        'widescreen': `${breakpoints.widescreen}px`,
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.5) 150%)',
        'hero-overlay': gradients['hero-overlay'],
        'dark-overlay': gradients['dark-overlay'],
        'light-overlay': gradients['light-overlay'],
        'brand-green': gradients['brand-green'],
        'brand-yellow': gradients['brand-yellow'],
        'light-green': gradients['light-green'],
        'lime-accent': gradients['lime-accent'],
        'purple': gradients['purple'],
        'vignette': gradients['vignette'],
        // Custom gradients from CSS files
        'lime-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(170, 204, 0, 0.1) 50%, rgba(170, 204, 0, 0.05) 100%)',
        'radial-brands': 'radial-gradient(ellipse at center, rgba(170, 204, 0, 0.05) 0%, transparent 70%)',
        'glassmorphism': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        'glassmorphism': '12px',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'fade-out': 'fadeOut 0.3s ease forwards',
        'slide-in': 'slideInRight 0.3s ease forwards',
        'slide-out': 'slideOutRight 0.3s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'skeleton': 'skeleton-loading 1.5s infinite ease-in-out',
        // Custom animations from CSS files
        'fade-in-down': 'dropdownEnter 0.2s ease-out forwards',
        'dropdown': 'dropdownFadeIn 0.2s ease-out forwards',
        'toast-enter': 'toastEnter 0.3s ease forwards',
        'toast-exit': 'toastExit 0.3s ease forwards',
        'tooltip': 'tooltipAppear 0.2s ease forwards',
        'float-subtle': 'floatSubtle 6s ease-in-out infinite',
        'float-reverse': 'floatSubtle 6s ease-in-out infinite reverse',
        'cart-glow': 'cartTriggerGlow 2s infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'skeleton-loading': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        // Custom keyframes from CSS files
        dropdownEnter: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dropdownFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastEnter: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        toastExit: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        tooltipAppear: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        cartTriggerGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(170, 204, 0, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(170, 204, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(170, 204, 0, 0)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'transform-opacity': 'transform, opacity',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fast': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'base': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'slow': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      zIndex: {
        'content': '1',
        'backdrop': '10',
        'header': '50',
        'navbar': '60',
        'dropdown': '70',
        'modal': '80',
        'tooltip': '90',
        'mobile-menu': '180',
      },
    },
  },
  plugins: [
    // Custom plugin for utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Text utilities
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        // Hide scrollbar utility
        '.hide-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        // Glassmorphism utility
        '.glassmorphism': {
          'backdrop-filter': 'blur(12px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        // Hover effects
        '.hover-scale': {
          'transition': 'transform 0.2s ease',
          '&:hover': {
            'transform': 'scale(1.05)',
          },
        },
        '.hover-elevate': {
          'transition': 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        // Focus styles
        '.focus-outline': {
          '&:focus-visible': {
            'outline': '2px solid #AACC00',
            'outline-offset': '2px',
          },
        },
        // Border glow effects
        '.border-glow-lime': {
          'border': '1px solid rgba(168, 203, 56, 0.5)',
          'box-shadow': '0 0 15px rgba(168, 203, 56, 0.4)',
          'background-color': 'rgba(168, 203, 56, 0.05)',
        },
        '.border-glow-yellow': {
          'border': '1px solid rgba(250, 204, 21, 0.5)',
          'box-shadow': '0 0 15px rgba(250, 204, 21, 0.4)',
          'background-color': 'rgba(250, 204, 21, 0.05)',
        },
        '.border-glow-green': {
          'border': '1px solid rgba(34, 197, 94, 0.5)',
          'box-shadow': '0 0 15px rgba(34, 197, 94, 0.4)',
          'background-color': 'rgba(34, 197, 94, 0.05)',
        },
        '.border-glow-blue': {
          'border': '1px solid rgba(59, 130, 246, 0.5)',
          'box-shadow': '0 0 15px rgba(59, 130, 246, 0.4)',
          'background-color': 'rgba(59, 130, 246, 0.05)',
        },
        '.border-glow-purple': {
          'border': '1px solid rgba(168, 85, 247, 0.5)',
          'box-shadow': '0 0 15px rgba(168, 85, 247, 0.4)',
          'background-color': 'rgba(168, 85, 247, 0.05)',
        },
        '.border-glow-red': {
          'border': '1px solid rgba(239, 68, 68, 0.5)',
          'box-shadow': '0 0 15px rgba(239, 68, 68, 0.4)',
          'background-color': 'rgba(239, 68, 68, 0.05)',
        },
        // Phone input utilities
        '.phone-input-form': {
          '& .react-international-phone-input-container': {
            'height': '2.75rem',
            'border': '1px solid rgb(251 191 36 / 0.2)',
            'border-radius': '9999px',
            'background': 'white',
            'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            'transition': 'all 0.2s ease',
          },
          '& .react-international-phone-input-container:focus-within': {
            'border-color': 'rgba(139, 195, 74, 1)',
            'box-shadow': '0 0 0 2px rgba(139, 195, 74, 0.5)',
          },
          '&.error .react-international-phone-input-container': {
            'border-color': 'rgba(239, 68, 68, 1)',
            'box-shadow': '0 0 0 1px rgba(239, 68, 68, 0.3)',
          },
          '& .react-international-phone-country-selector-button': {
            'padding-left': '0.75rem',
            'border-right': '1px solid rgb(251 191 36 / 0.2)',
          },
          '& .react-international-phone-country-selector-button:hover': {
            'background': 'rgba(139, 195, 74, 0.05)',
          },
          '&.error .react-international-phone-country-selector-button': {
            'border-right-color': 'rgba(239, 68, 68, 0.6)',
          },
          '& .react-international-phone-input': {
            'padding': '0 1rem',
            'font-size': '1rem',
          },
        },
        '.phone-input-signup': {
          '& .react-international-phone-input-container': {
            'height': '3rem',
            'border': '1px solid rgba(170, 204, 0, 0.7)',
            'border-radius': '9999px',
            'background': 'white',
            'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            'transition': 'all 0.2s ease',
          },
          '& .react-international-phone-input-container:focus-within': {
            'border-color': 'rgba(170, 204, 0, 1)',
            'box-shadow': '0 0 0 1px rgba(170, 204, 0, 1)',
          },
          '&.error .react-international-phone-input-container': {
            'border-color': 'rgba(239, 68, 68, 0.6)',
            'box-shadow': '0 0 0 1px rgba(239, 68, 68, 0.3)',
          },
          '& .react-international-phone-country-selector-button': {
            'padding-left': '1rem',
            'padding-right': '0.5rem',
            'border-right': '1px solid rgba(170, 204, 0, 0.2)',
            'position': 'relative',
          },
          '& .react-international-phone-country-selector-button::after': {
            'content': '""',
            'position': 'absolute',
            'right': '-1px',
            'top': '50%',
            'transform': 'translateY(-50%)',
            'width': '1px',
            'height': '1rem',
            'background': 'rgba(170, 204, 0, 0.2)',
          },
          '& .react-international-phone-country-selector-button:hover': {
            'background': 'rgba(170, 204, 0, 0.05)',
          },
          '&.error .react-international-phone-country-selector-button': {
            'border-right-color': 'rgba(239, 68, 68, 0.6)',
          },
          '&.error .react-international-phone-country-selector-button::after': {
            'background': 'rgba(239, 68, 68, 0.3)',
          },
          '& .react-international-phone-input': {
            'padding': '0 1rem',
            'font-size': '0.9375rem',
            'color': 'rgba(34, 69, 34, 1)',
          },
          '& .react-international-phone-input::placeholder': {
            'color': 'rgba(34, 69, 34, 0.7)',
          },
        },
        '.phone-input-signup-compact': {
          '& .react-international-phone-input-container': {
            'height': '2.5rem',
          },
          '& .react-international-phone-country-selector-button': {
            'padding-left': '0.75rem',
            'padding-right': '0.375rem',
          },
          '& .react-international-phone-country-selector-button::after': {
            'height': '0.75rem',
          },
          '& .react-international-phone-input': {
            'padding': '0 0.75rem',
            'font-size': '0.875rem',
          },
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
};