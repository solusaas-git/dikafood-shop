/**
 * 🎯 SessionService - Centralized Session Management
 * Manages both guest sessions and authenticated user sessions
 * Handles the transition between guest and authenticated states
 */

import { eventBus, EVENTS } from '../utils/eventBus.js';
import config from '../config.js';

class SessionService {
  constructor() {
    this.sessionId = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.sessionType = 'guest'; // 'guest' | 'authenticated'
    this.guestSessionIdForMerge = null; // Stores guest session ID during login for cart merge
    this.listeners = new Map();
    
    // Initialize session on creation
    this.initializeSession();
    
    // Listen for auth events
    this.setupEventListeners();
  }

  /**
   * Initialize session - guest or authenticated
   */
  initializeSession() {
    // Try to restore authenticated session first
    const token = localStorage.getItem(config.AUTH.tokenKey);
    if (token && !this.isTokenExpired(token)) {
      this.sessionType = 'authenticated';
      this.isAuthenticated = true;
      // sessionId will be extracted from token when needed
    } else {
      // Initialize as guest session
      this.sessionType = 'guest';
      this.isAuthenticated = false;
      this.sessionId = this.getOrCreateGuestSessionId();
    }

    console.log(`🎯 Session initialized: ${this.sessionType}`, {
      sessionId: this.sessionId,
      isAuthenticated: this.isAuthenticated
    });
  }

  /**
   * Get or create guest session ID
   */
  getOrCreateGuestSessionId() {
    let sessionId = localStorage.getItem('dikafood_session_id');
    if (!sessionId) {
      sessionId = this.generateGuestSessionId();
      localStorage.setItem('dikafood_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate unique guest session ID
   */
  generateGuestSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `guest_${timestamp}_${random}`;
  }

  /**
   * Get current session ID for API calls
   */
  getSessionId() {
    if (this.sessionType === 'authenticated') {
      // Extract sessionId from JWT token
      const token = localStorage.getItem(config.AUTH.tokenKey);
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.sessionId;
        } catch (error) {
          console.warn('Failed to extract sessionId from token:', error);
          // Fallback to guest session
          return this.getOrCreateGuestSessionId();
        }
      }
    }
    
    return this.sessionId || this.getOrCreateGuestSessionId();
  }

  /**
   * Get current user ID (only for authenticated sessions)
   */
  getUserId() {
    if (!this.isAuthenticated) return null;
    
    const token = localStorage.getItem(config.AUTH.tokenKey);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (error) {
        console.warn('Failed to extract userId from token:', error);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Get session headers for API calls
   */
  getSessionHeaders() {
    const headers = {};
    
    // Always include session ID for cart operations
    const sessionId = this.getSessionId();
    if (sessionId) {
      headers['x-session-id'] = sessionId;
    }
    
    // Include auth token if authenticated
    if (this.isAuthenticated) {
      const token = localStorage.getItem(config.AUTH.tokenKey);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  /**
   * Transition from guest to authenticated session
   */
  async transitionToAuthenticated(loginResponse) {
    const previousSessionId = this.sessionId;
    const previousType = this.sessionType;
    
    console.log('🔄 Transitioning from guest to authenticated session', {
      previousSessionId,
      previousType,
      newUser: loginResponse.user?.id
    });

    // Store guest session ID for cart merge before changing session type
    this.guestSessionIdForMerge = previousSessionId;
    console.log('💾 Stored guest session ID for merge:', this.guestSessionIdForMerge);

    // Update session state
    this.sessionType = 'authenticated';
    this.isAuthenticated = true;
    this.userId = loginResponse.user?.id;
    
    // Emit session transition event
    eventBus.emit(EVENTS.SESSION_TRANSITION, {
      from: { type: previousType, sessionId: previousSessionId },
      to: { type: 'authenticated', userId: this.userId, sessionId: this.getSessionId() },
      guestSessionId: previousSessionId
    });
    
    console.log('✅ Session transitioned to authenticated');
  }

  /**
   * Transition from authenticated to guest session
   */
  async transitionToGuest() {
    const previousUserId = this.userId;
    const previousSessionId = this.getSessionId();
    
    console.log('🔄 Transitioning from authenticated to guest session');

    // Update session state
    this.sessionType = 'guest';
    this.isAuthenticated = false;
    this.userId = null;
    
    // Keep existing guest session ID or create new one
    this.sessionId = this.getOrCreateGuestSessionId();
    
    // Emit session transition event
    eventBus.emit(EVENTS.SESSION_TRANSITION, {
      from: { type: 'authenticated', userId: previousUserId, sessionId: previousSessionId },
      to: { type: 'guest', sessionId: this.sessionId }
    });
    
    console.log('✅ Session transitioned to guest');
  }

  /**
   * Clear session completely (for security/logout)
   */
  clearSession() {
    console.log('🧹 Clearing session completely');
    
    // Clear all session data
    this.sessionId = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.sessionType = 'guest';
    this.guestSessionIdForMerge = null; // Clear merge session ID
    
    // Clear localStorage
    localStorage.removeItem(config.AUTH.tokenKey);
    localStorage.removeItem(config.AUTH.refreshTokenKey);
    localStorage.removeItem(config.AUTH.tokenExpiryKey);
    localStorage.removeItem('dikafood_session_id');
    
    // Re-initialize as fresh guest session
    this.initializeSession();
    
    // Emit session cleared event
    eventBus.emit(EVENTS.SESSION_CLEARED);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true; // Treat invalid tokens as expired
    }
  }

  /**
   * Get guest session ID for cart merge operations
   */
  getGuestSessionIdForMerge() {
    return this.guestSessionIdForMerge;
  }

  /**
   * Clear the stored guest session ID after merge is complete
   */
  clearGuestSessionIdForMerge() {
    this.guestSessionIdForMerge = null;
  }

  /**
   * Get session info for debugging/display
   */
  getSessionInfo() {
    return {
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      sessionType: this.sessionType,
      isAuthenticated: this.isAuthenticated,
      guestSessionIdForMerge: this.guestSessionIdForMerge
    };
  }

  /**
   * Setup event listeners for auth state changes
   */
  setupEventListeners() {
    // Listen for login success
    eventBus.on(EVENTS.AUTH_LOGIN_SUCCESS, (data) => {
      this.transitionToAuthenticated(data);
    });

    // Listen for logout
    eventBus.on(EVENTS.AUTH_LOGOUT, () => {
      this.transitionToGuest();
    });

    // Listen for session expiry
    eventBus.on(EVENTS.AUTH_SESSION_EXPIRED, () => {
      this.transitionToGuest();
    });
  }

  /**
   * Subscribe to session changes
   */
  onSessionChange(callback) {
    const id = Math.random().toString(36);
    this.listeners.set(id, callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }

  /**
   * Notify listeners of session changes
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Session listener error:', error);
      }
    });
  }
}

// Create singleton instance
export const sessionService = new SessionService();

// Add new session events to eventBus
export const SESSION_EVENTS = {
  TRANSITION: 'session:transition',
  CLEARED: 'session:cleared',
  GUEST_SESSION_CREATED: 'session:guest_created',
  AUTH_SESSION_CREATED: 'session:auth_created'
};

// Export for use in other services
export default sessionService; 