'use client';

/**
 * 🔐 Clean Auth Context - Simple & Effective
 * Manages authentication state with the new API service
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import config from '../config.js';
import sessionService from '../services/SessionService.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus(true); // Force initial auth check
    
    // Set up automatic token refresh check every 5 minutes
    const refreshInterval = setInterval(() => {
      if (api.isAuthenticated() && api.isTokenExpired()) {
        api.ensureValidToken().catch(error => {
          console.error('Background token refresh failed:', error);
          logout(); // Force logout if refresh fails
        });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  // Add throttling to prevent excessive API calls
  const [lastAuthCheck, setLastAuthCheck] = useState(0);
  const AUTH_CHECK_THROTTLE = 30000; // 30 seconds minimum between auth checks

  const checkAuthStatus = async (force = false) => {
    const now = Date.now();
    
    // Throttle auth checks unless forced
    if (!force && (now - lastAuthCheck) < AUTH_CHECK_THROTTLE) {
      return;
    }

    try {
      setLastAuthCheck(now);
      
      if (!api.isAuthenticated()) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Ensure we have a valid token before checking profile
      const tokenValid = await api.ensureValidToken();
      if (!tokenValid) {
        api.clearLocalData();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const response = await api.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        // Profile fetch failed, clear tokens
        api.clearLocalData();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Handle different types of auth errors gracefully
      if (error.code === 'TOKEN_EXPIRED') {
      } else if (error.message?.includes('Access token required')) {
      } else if (error.status === 401) {
      }
      
      // Clear potentially invalid tokens
      api.clearLocalData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await api.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Emit login success event for SessionService to handle session transition
        eventBus.emit(EVENTS.AUTH_LOGIN_SUCCESS, response.data);
        
        // Wait a bit for session transition to complete, then merge cart
        setTimeout(async () => {
          try {
            const cartMergeResponse = await api.mergeCart();
            if (cartMergeResponse.success) {
              // Trigger cart refresh to show merged items
              eventBus.emit(EVENTS.CART_SYNC_REQUESTED);
            } else {
              console.warn('Cart merge returned error:', cartMergeResponse.message);
            }
          } catch (mergeError) {
            console.warn('⚠️ Cart merge failed:', mergeError);
          }
        }, 300); // Small delay to ensure session transition completes

        // User data is already current from login response
        // No need to fetch profile again

        return { success: true, user: response.data.user, tokens: response.data.tokens };
      } else {
        console.error('❌ Login failed:', response.message);
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      
      if (response.success && response.data) {
        // Store tokens (same as login)
        const { accessToken, refreshToken, expiresIn } = response.data.tokens;
        localStorage.setItem(config.AUTH.tokenKey, accessToken);
        localStorage.setItem(config.AUTH.refreshTokenKey, refreshToken);
        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem(config.AUTH.tokenExpiryKey, expiryTime.toString());

        // Set user state
        setUser(response.data.user);
        setIsAuthenticated(true);

        // Emit login success event for SessionService to handle session transition
        eventBus.emit(EVENTS.AUTH_LOGIN_SUCCESS, response.data);

        // Wait a bit for session transition to complete, then merge cart
        setTimeout(async () => {
          try {
            const cartMergeResponse = await api.mergeCart();
            if (cartMergeResponse.success) {
              // Trigger cart refresh to show merged items
              eventBus.emit(EVENTS.CART_SYNC_REQUESTED);
            } else {
              console.warn('Cart merge returned error:', cartMergeResponse.message);
            }
          } catch (mergeError) {
            console.warn('⚠️ Cart merge failed:', mergeError);
          }
        }, 300); // Small delay to ensure session transition completes

        return { success: true, user: response.data.user, tokens: response.data.tokens };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
      // Clear tokens manually as backup
      api.clearLocalData();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      
      // Emit logout event (though clearSession already handles this)
      eventBus.emit(EVENTS.AUTH_LOGOUT);
      
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.updateProfile(profileData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        console.error('Profile update failed:', response.message);
        return { success: false, error: response.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Handle token expiry during profile update
      if (error.code === 'TOKEN_EXPIRED') {
        logout();
      }
      
      return { success: false, error: error.message || 'Profile update failed' };
    }
  };

  // Expose a method to refresh the user profile from /auth/me
  const refreshProfile = async (force = false) => {
    const now = Date.now();
    
    // Throttle profile refreshes unless forced
    if (!force && (now - lastAuthCheck) < AUTH_CHECK_THROTTLE) {
      return { success: true, user: user };
    }

    try {
      setLastAuthCheck(now);
      const response = await api.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: response.message || 'Failed to refresh profile' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to refresh profile' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    signup: register, // Alias for backwards compatibility with components
    logout,
    updateProfile,
    checkAuthStatus,
    refreshProfile,
    isLoggedIn: Boolean(user && isAuthenticated),
    eventBus, // Add eventBus to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 