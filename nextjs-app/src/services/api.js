/**
 * 🔌 DikaFood API Service - Clean Integration
 * Modern API service matching the new backend endpoints
 */

import config from '../config.js';
import sessionService from './SessionService.js';

// API Error class for consistent error handling
export class ApiError extends Error {
  constructor(message, status = 500, code = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Main API service class
class ApiService {
  constructor() {
    this.baseURL = config.API.baseURL;
    this.timeout = config.API.timeout;
    this.isRefreshing = false;
    this.failedQueue = [];
    // Enable API calls - connect to real backend
    this.API_DISABLED = config.API.useMockApi || false;
    // Simple cache for categories and brands (they don't change often)
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  // 🔧 Cache helper methods
  getCached(key) {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  setCached(key, value) {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  // 🔧 Core request method
  async request(endpoint, options = {}) {
    // Return mock responses when API is disabled
    if (this.API_DISABLED) {
      return this.getMockResponse(endpoint, options);
    }

    const {
      method = 'GET',
      body = null,
      headers = {},
      timeout = this.timeout,
      skipTokenRefresh = false,
      useCache = false
    } = options;

    // Check cache for GET requests on cacheable endpoints
    if (method === 'GET' && useCache) {
      const cached = this.getCached(endpoint);
      if (cached) {
        return cached;
      }
    }

    // Check if token needs refresh before making request (unless explicitly skipped)
    if (!skipTokenRefresh && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
      await this.ensureValidToken();
    }

    // Build request headers
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Add session and auth headers via SessionService
    const sessionHeaders = sessionService.getSessionHeaders();
    Object.assign(requestHeaders, sessionHeaders);

    const url = `${this.baseURL}${endpoint}`;

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal,
        credentials: 'include'
      });

      clearTimeout(timeoutId);

      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle errors
      if (!response.ok) {
        // Handle 401 errors (unauthorized) - try to refresh token
        if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login') && !skipTokenRefresh) {
          const refreshResult = await this.handleTokenRefresh();
          if (refreshResult.success) {
            // Retry the original request with new token
            return this.request(endpoint, { ...options, skipTokenRefresh: true });
          } else {
            // Refresh failed, clear tokens and redirect to login
            this.clearLocalData();
            throw new ApiError('Session expired', 401, 'TOKEN_EXPIRED');
          }
        }

        const message = data?.message || data?.error || `HTTP ${response.status}`;
        throw new ApiError(message, response.status, data?.code);
      }

      // Session ID is now managed by SessionService

      // Cache successful GET responses for cacheable endpoints
      if (method === 'GET' && useCache && data) {
        this.setCached(endpoint, data);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message, 0, 'NETWORK_ERROR');
    }
  }

  // 🔐 Authentication Endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData
    });

    // Store tokens if registration successful (same as login)
    if (response.success && response.data?.tokens) {
      const { accessToken, refreshToken, expiresIn } = response.data.tokens;
      
      // Store tokens (only on client side)
      if (typeof window !== 'undefined') {
        // Store access token
        localStorage.setItem(config.AUTH.tokenKey, accessToken);
        
        // Store refresh token
        localStorage.setItem(config.AUTH.refreshTokenKey, refreshToken);
        
        // Calculate and store expiry time
        const expiryTime = Date.now() + (expiresIn * 1000); // Convert seconds to milliseconds
        localStorage.setItem(config.AUTH.tokenExpiryKey, expiryTime.toString());
      }
      
    }

    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });

    // Store tokens if login successful
    if (response.success && response.data?.tokens) {
      const { accessToken, refreshToken, expiresIn } = response.data.tokens;
      
      // Store tokens (only on client side)
      if (typeof window !== 'undefined') {
        // Store access token
        localStorage.setItem(config.AUTH.tokenKey, accessToken);
        
        // Store refresh token
        localStorage.setItem(config.AUTH.refreshTokenKey, refreshToken);
        
        // Calculate and store expiry time
        const expiryTime = Date.now() + (expiresIn * 1000); // Convert seconds to milliseconds
        localStorage.setItem(config.AUTH.tokenExpiryKey, expiryTime.toString());
      }
      
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      // Clear session completely (tokens + session data)
      sessionService.clearSession();
    }
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: profileData
    });
  }

  async refreshToken() {
    if (typeof window === 'undefined') {
      throw new ApiError('Cannot refresh token on server side', 401, 'SSR_NO_REFRESH');
    }
    const refreshToken = localStorage.getItem(config.AUTH.refreshTokenKey);
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
    }

    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: { refreshToken }, // Send refresh token in request body as expected by backend
      skipTokenRefresh: true
    });

    // Update stored tokens if refresh successful
    if (response.success && response.data?.tokens) {
      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.tokens;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(config.AUTH.tokenKey, accessToken);
        localStorage.setItem(config.AUTH.refreshTokenKey, newRefreshToken);
        
        // Update expiry time
        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem(config.AUTH.tokenExpiryKey, expiryTime.toString());
      }
      
    }

    return response;
  }

  // 📦 Product Endpoints
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getProductVariants(id) {
    return this.request(`/products/${id}/variants`);
  }

  async getFeaturedProducts() {
    return this.request('/products/featured');
  }

  async getFeaturedVariants() {
    return this.request('/products/featured?type=variants');
  }

  async searchProducts(query, filters = {}) {
    const params = { q: query, ...filters };
    const searchParams = new URLSearchParams(params);
    return this.request(`/products/search?${searchParams.toString()}`);
  }

  async getCategories() {
    return this.request('/products/categories', { useCache: true });
  }

  async getBrands() {
    return this.request('/products/brands', { useCache: true });
  }

  // 🛒 Cart Endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(item) {
    return this.request('/cart', {
      method: 'POST',
      body: item
    });
  }

  async updateCartItem(itemId, data) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: data
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE'
    });
  }

  async getCartSummary() {
    return this.request('/cart/summary');
  }

  async mergeCart(strategy = 'merge', guestSessionId = null) {
    // Get the guest session ID that was stored during login transition or use provided one
    const sessionIdToMerge = guestSessionId || sessionService.getGuestSessionIdForMerge();
    
    
    const response = await this.request('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({
        strategy,
        guestSessionId: sessionIdToMerge
      })
    });
    
    
    // Clear the stored guest session ID after merge attempt
    if (!guestSessionId) {
      sessionService.clearGuestSessionIdForMerge();
    }
    
    return response;
  }

  // 📄 Catalog Endpoints
  async getCatalog(language = 'fr') {
    try {
      const response = await fetch(`${this.baseURL}/catalogs/${language}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download URL
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `catalogue-dikafood-${language}.pdf`;
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return {
        success: true,
        message: 'Catalog downloaded successfully'
      };
      
    } catch (error) {
      console.error('Catalog download error:', error);
      return {
        success: false,
        error: error.message || 'Failed to download catalog'
      };
    }
  }

  // 📝 Order Endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData
    });
  }

  // Track order by order number and customer info
  async trackOrder(orderNumber, email, phone = null) {
    const params = new URLSearchParams({
      ...(email && { email }),
      ...(phone && { phone })
    });
    
    return this.request(`/orders/${orderNumber}?${params}`, {
      method: 'GET'
    });
  }

  // 🔄 Token Management Methods
  
  // Check if token is expired or about to expire (within 5 minutes)
  isTokenExpired() {
    if (typeof window === 'undefined') return true; // SSR compatibility
    const expiryTime = localStorage.getItem(config.AUTH.tokenExpiryKey);
    if (!expiryTime) return true;
    
    const expiry = parseInt(expiryTime);
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    return Date.now() >= (expiry - bufferTime);
  }

  // Ensure we have a valid token, refresh if needed
  async ensureValidToken() {
    if (this.API_DISABLED) return false; // API disabled
    if (typeof window === 'undefined') return false; // SSR compatibility
    const token = localStorage.getItem(config.AUTH.tokenKey);
    if (!token) return false;

    if (this.isTokenExpired()) {
      const refreshResult = await this.handleTokenRefresh();
      return refreshResult.success;
    }

    return true;
  }

  // Handle token refresh with queue management for concurrent requests
  async handleTokenRefresh() {
    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.failedQueue.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const result = await this.refreshToken();
      
      // Process queued requests
      this.failedQueue.forEach(resolve => resolve({ success: true }));
      this.failedQueue = [];
      
      return { success: true };
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // Process queued requests with failure
      this.failedQueue.forEach(resolve => resolve({ success: false }));
      this.failedQueue = [];
      
      return { success: false };
    } finally {
      this.isRefreshing = false;
    }
  }

  // 🔍 Utility method to check if user is authenticated
  isAuthenticated() {
    if (this.API_DISABLED) return false; // API disabled
    if (typeof window === 'undefined') return false; // SSR compatibility
    const token = localStorage.getItem(config.AUTH.tokenKey);
    const refreshToken = localStorage.getItem(config.AUTH.refreshTokenKey);
    return !!(token && refreshToken);
  }

  // 🧹 Clear all local data (including session ID)
  // Use this only for complete reset (e.g., session expired, security clear)
  clearLocalData() {
    sessionService.clearSession();
    console.log('🧹 All local data cleared via SessionService');
  }

  // 🎭 Mock response generator for disabled API
  getMockResponse(endpoint, options = {}) {
    const method = options.method || 'GET';
    
    // Mock responses for different endpoints
    if (endpoint.includes('/cart')) {
      if (method === 'GET') {
        return Promise.resolve({
          success: true,
          data: { cart: { items: [], totalAmount: 0, itemCount: 0 } }
        });
      }
      return Promise.resolve({ success: true, data: { cart: { items: [], totalAmount: 0, itemCount: 0 } } });
    }
    
    if (endpoint.includes('/auth/profile') || endpoint.includes('/profile')) {
      return Promise.resolve({
        success: false,
        message: 'Not authenticated (API disabled)'
      });
    }
    
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
      return Promise.resolve({
        success: false,
        message: 'Authentication disabled in development'
      });
    }
    
    if (endpoint.includes('/products')) {
      return Promise.resolve({
        success: true,
        data: { products: [] }
      });
    }
    
    // Default mock response
    return Promise.resolve({
      success: true,
      data: {},
      message: 'Mock response (API disabled)'
    });
  }
}

// Helper to get product image URL from backend (async)
export async function getProductImageUrlById(imageId) {
  if (!imageId) throw new Error('No image id provided');
  let cleanId = imageId;
  if (/^https?:\/\//.test(imageId)) {
    cleanId = imageId.split('/').pop() || imageId;
  } else {
    cleanId = imageId.replace(/^\/api\/files\/product-images\//, '').replace(/^\//, '');
  }
  // Use fetch directly since this is a utility
  const res = await fetch(`/api/files/product-images/url/${cleanId}`);
  const data = await res.json();
  const url = data.url || '';
  if (url.startsWith('/')) {
    let base = config.API.baseURL || '';
    base = base.replace(/\/api$/, '');
    return `${base}${url}`;
  }
  return url;
}

// Export singleton instance
export const api = new ApiService();
export default api;