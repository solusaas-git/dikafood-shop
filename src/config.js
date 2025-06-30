/**
 * DikaFood Frontend Configuration
 * Single source of truth for all application settings
 */

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Configuration
const getApiUrl = () => {
  // Allow override via environment variable for custom setups
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Production: use api.dikafood.com
  if (isProduction) {
    return 'https://api.dikafood.com/api';
  }
  
  // Development: use /api prefix to let Vite proxy handle routing to localhost:3000 (API server)
  return "/api";
};

const config = {
  // Environment info
  ENV: {
    isDevelopment,
    isProduction,
    mode: import.meta.env.MODE || 'development'
  },

  // Application
  APP_NAME: 'DikaFood',
  APP_VERSION: '1.0.0',

  // API Configuration
  API: {
    baseURL: getApiUrl(),
    timeout: 30000,
    useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
    // For internal use - actual backend URL (needed for some services)
    backendUrl: isProduction ? 'https://api.dikafood.com' : 'http://localhost:3000'
  },

  // Frontend URLs
  FRONTEND: {
    baseUrl: isProduction ? 'https://dikafood.com' : `http://localhost:${import.meta.env.VITE_PORT || 3000}`,
    assetsUrl: isProduction ? 'https://dikafood.com/assets' : '/assets'
  },

  // Authentication
  AUTH: {
    tokenKey: 'dikafood_auth_token',
    refreshTokenKey: 'dikafood_refresh_token',
    tokenExpiryKey: 'dikafood_token_expiry',
    userKey: 'dikafood_user'
  },

  // Localization
  I18N: {
    defaultLocale: 'fr',
    supportedLocales: ['fr', 'ar', 'en']
  },

  // Currency
  CURRENCY: {
    default: 'MAD',
    supported: [
    { code: 'MAD', symbol: 'DH', name: 'Dirham Marocain' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar Américain' }
    ]
  },

  // Storage
  STORAGE: {
    cartKey: 'dikafood_cart'
  },

  // UI/UX
  UI: {
    pagination: {
      defaultPageSize: 12
    },
    layout: {
      headerHeight: 80,
      footerHeight: 60,
      sidebarWidth: 280,
      mobileBreakpoint: 768
    }
  },

  // Debug
  DEBUG: isDevelopment
};

// Legacy compatibility exports (to avoid breaking existing imports)
export const API_URL = config.API.baseURL;
export const API_TIMEOUT = config.API.timeout;
export const USE_MOCK_API = config.API.useMockApi;
export const AUTH_TOKEN_KEY = config.AUTH.tokenKey;
export const AUTH_USER_KEY = config.AUTH.userKey;
export const DEFAULT_LOCALE = config.I18N.defaultLocale;
export const SUPPORTED_LOCALES = config.I18N.supportedLocales;
export const DEFAULT_CURRENCY = config.CURRENCY.default;
export const SUPPORTED_CURRENCIES = config.CURRENCY.supported;
export const CART_STORAGE_KEY = config.STORAGE.cartKey;
export const DEFAULT_PAGE_SIZE = config.UI.pagination.defaultPageSize;
export const HEADER_HEIGHT = config.UI.layout.headerHeight;
export const FOOTER_HEIGHT = config.UI.layout.footerHeight;
export const SIDEBAR_WIDTH = config.UI.layout.sidebarWidth;
export const MOBILE_BREAKPOINT = config.UI.layout.mobileBreakpoint;
export const DEBUG = config.DEBUG;

export default config;