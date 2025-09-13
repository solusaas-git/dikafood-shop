/**
 * DikaFood Design System Tokens
 *
 * These tokens define the core design elements for the DikaFood UI
 */

// Color System
export const colors = {
  // Primary brand colors
  'dark-yellow': {
    1: '#EBEB47', // Primary CTA color
    2: '#E6E642',
    3: '#EDED62',
    4: '#F3F380',
    5: '#F9F99F',
  },
  'light-yellow': {
    1: '#FFF8D1',
    2: '#FFF9DE',
    3: '#FFFAE9',
    4: '#FFFCF5',
    5: '#FFFEFA',
  },
  // Green color palette
  'dark-green': {
    1: '#0A5C25', // From original, matches logo
    2: '#0D732F',
    3: '#0F8A38',
    4: '#12A141',
    5: '#006622',
    6: '#226600',
    7: '#08451C', // Dark text color
    8: '#339900',
  },
  'light-green': {
    1: '#E8FCEF', // From original
    2: '#D1FADF',
    3: '#BAF7CF',
    4: '#A3F5BE',
    5: '#DDFFCC',
    6: '#E2F0DB',
  },
  // Logo specific colors
  'logo': {
    'green': '#0A5C26', // From logo SVG
    'lime': '#AACC00', // From logo SVG - lime green
    'brown': '#8B5A2B', // Brown accent color
  },
  // Purple color palette (from original)
  'dark-purple': {
    1: '#410A5C',
    2: '#520D73',
    3: '#610F8A',
    4: '#7112A1',
    5: '#440066',
  },
  'light-purple': {
    1: '#F6E8FC',
    2: '#ECD1FA',
    3: '#E3BAF7',
    4: '#DAA3F5',
    5: '#F6E5FF',
    6: '#FBF5FF',
  },
  // UI colors
  'neutral': {
    50: '#FFFFFF',
    100: '#F9F9F9',
    200: '#F1F1F1',
    300: '#E1E1E1',
    400: '#CFCFCF',
    500: '#B1B1B1',
    600: '#8D8D8D',
    700: '#707070',
    800: '#4D4D4D',
    900: '#2A2A2A',
    950: '#0D0D0D',
  },
  // Semantic colors
  'feedback': {
    success: '#2D865D',
    warning: '#F8B84A',
    error: '#E84646',
    info: '#3D88CF',
  }
};

// Gradients system
export const gradients = {
  // Hero section gradient overlay
  'hero-overlay': 'linear-gradient(to bottom, rgba(90, 131, 30, 0.5), rgba(45, 58, 15, 0.9))',

  // Dark overlay for images
  'dark-overlay': 'linear-gradient(to bottom, rgba(45, 58, 15, 0.3), rgba(45, 58, 15, 0.8))',

  // Light overlay for images
  'light-overlay': 'linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.95))',

  // Brand green gradient
  'brand-green': 'linear-gradient(135deg, #80AF2C, #2D3A0F)',

  // Brand yellow gradient
  'brand-yellow': 'linear-gradient(135deg, #EBEB47, #E6E642)',

  // Light green gradient for cards
  'light-green': 'linear-gradient(135deg, #F4F9E9, #E7F2D3)',

  // Lime accent gradient
  'lime-accent': 'linear-gradient(135deg, #AACC00, #80AF2C)',

  // Purple gradient
  'purple': 'linear-gradient(135deg, #410A5C, #610F8A)',

  // Vignette effect
  'vignette': 'radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.5) 150%)',
};

// Spacing system
export const spacing = {
  desktop: {
    'padding-y': '80px',
    'padding-x': '40px',
    'gap': '40px',
  },
  tablet: {
    'padding-y': '60px',
    'padding-x': '32px',
    'gap': '32px',
  },
  mobile: {
    'padding-y': '40px',
    'padding-x': '24px',
    'gap': '24px',
  }
};

// Layout variables
export const layout = {
  'max-width': '1440px',
  'section-padding': '5%',
  'navbar-height': '80px',
  'navbar-height-mobile': '64px',
};

// Typography
export const typography = {
  'font-family': {
    'base': '"Satoshi-Variable", "Satoshi-Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'heading': '"Chillax-Variable", "Chillax-Medium", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'brand': '"Chillax-Bold", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  'line-height': {
    'tight': '1.15',
    'base': '1.5',
    'relaxed': '1.75',
  },
  'font-weight': {
    'light': '300',
    'regular': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Breakpoints
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  widescreen: 1440,
};