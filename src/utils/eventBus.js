import React from 'react';

/**
 * Centralized Event Bus for DikaFood App
 * Manages communication between Auth, Cart, and other contexts
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event).add(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data = {}) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`📡 EventBus: Error in "${event}" listener:`, error);
        }
      });
    }
    
    // Also dispatch as DOM event for components outside React context
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  /**
   * Subscribe once to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });
    
    return unsubscribe;
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (this.listeners.has(event)) {
      this.listeners.delete(event);
    }
  }

  /**
   * Get list of all active events
   */
  getActiveEvents() {
    return Array.from(this.listeners.keys());
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   */
  getListenerCount(event) {
    return this.listeners.has(event) ? this.listeners.get(event).size : 0;
  }
}

// Create singleton instance
export const eventBus = new EventBus();

// Event constants for type safety
export const EVENTS = {
  // Auth events - Core
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout', 
  AUTH_PROFILE_UPDATED: 'auth:profile_updated',
  AUTH_SESSION_EXPIRED: 'auth:session_expired',
  AUTH_STATE_CHANGED: 'auth:state_changed',
  
  // Auth events - Detailed lifecycle
  AUTH_INITIALIZATION_STARTED: 'auth:initialization_started',
  AUTH_INITIALIZATION_COMPLETED: 'auth:initialization_completed',
  AUTH_CHECK_STARTED: 'auth:check_started',
  AUTH_CHECK_COMPLETED: 'auth:check_completed',
  AUTH_CHECK_FAILED: 'auth:check_failed',
  AUTH_LOGIN_ATTEMPT: 'auth:login_attempt',
  AUTH_LOGIN_SUCCESS: 'auth:login_success',
  AUTH_LOGIN_FAILED: 'auth:login_failed',
  AUTH_LOGIN_ERROR: 'auth:login_error',
  AUTH_LOGOUT_ATTEMPT: 'auth:logout_attempt',
  AUTH_LOGOUT_SUCCESS: 'auth:logout_success',
  AUTH_LOGOUT_FAILED: 'auth:logout_failed',
  AUTH_LOGOUT_ERROR: 'auth:logout_error',
  AUTH_SIGNUP_ATTEMPT: 'auth:signup_attempt',
  AUTH_SIGNUP_SUCCESS: 'auth:signup_success',
  AUTH_SIGNUP_FAILED: 'auth:signup_failed',
  AUTH_SIGNUP_ERROR: 'auth:signup_error',
  AUTH_PROFILE_REFRESH_STARTED: 'auth:profile_refresh_started',
  AUTH_PROFILE_REFRESH_SUCCESS: 'auth:profile_refresh_success',
  AUTH_PROFILE_REFRESH_FAILED: 'auth:profile_refresh_failed',
  AUTH_PROFILE_REFRESH_ERROR: 'auth:profile_refresh_error',
  
  // Cart events
  CART_UPDATED: 'cart:updated',
  CART_ITEM_ADDED: 'cart:item_added',
  CART_ITEM_REMOVED: 'cart:item_removed',
  CART_ITEM_UPDATED: 'cart:item_updated',
  CART_CLEARED: 'cart:cleared',
  CART_SYNC_REQUESTED: 'cart:sync_requested',
  
  // API events
  API_ERROR: 'api:error',
  API_SUCCESS: 'api:success',
  API_RATE_LIMIT: 'api:rate_limit',
  API_SESSION_EXPIRED: 'api:session_expired',
  
  // UI events
  UI_NOTIFICATION: 'ui:notification',
  UI_MODAL_OPEN: 'ui:modal_open',
  UI_MODAL_CLOSE: 'ui:modal_close',
  
  // Checkout events
  CHECKOUT_STARTED: 'checkout:started',
  CHECKOUT_COMPLETED: 'checkout:completed',
  CHECKOUT_FAILED: 'checkout:failed',
  
  // Session events
  SESSION_TRANSITION: 'session:transition',
  SESSION_CLEARED: 'session:cleared',
  SESSION_GUEST_CREATED: 'session:guest_created',
  SESSION_AUTH_CREATED: 'session:auth_created'
};

// Helper functions for common event patterns
export const authEvents = {
  login: (userData) => eventBus.emit(EVENTS.AUTH_LOGIN, userData),
  logout: () => eventBus.emit(EVENTS.AUTH_LOGOUT),
  signup: (userData) => eventBus.emit(EVENTS.AUTH_SIGNUP_SUCCESS, userData),
  profileUpdated: (userData) => eventBus.emit(EVENTS.AUTH_PROFILE_UPDATED, userData),
  sessionExpired: () => eventBus.emit(EVENTS.AUTH_SESSION_EXPIRED),
  stateChanged: (authState) => eventBus.emit(EVENTS.AUTH_STATE_CHANGED, authState)
};

export const cartEvents = {
  updated: (cartData) => eventBus.emit(EVENTS.CART_UPDATED, cartData),
  itemAdded: (item) => eventBus.emit(EVENTS.CART_ITEM_ADDED, item),
  itemRemoved: (itemId) => eventBus.emit(EVENTS.CART_ITEM_REMOVED, { itemId }),
  itemUpdated: (item) => eventBus.emit(EVENTS.CART_ITEM_UPDATED, item),
  cleared: () => eventBus.emit(EVENTS.CART_CLEARED),
  syncRequested: () => eventBus.emit(EVENTS.CART_SYNC_REQUESTED)
};

export const apiEvents = {
  error: (error) => eventBus.emit(EVENTS.API_ERROR, error),
  success: (response) => eventBus.emit(EVENTS.API_SUCCESS, response)
};

// React hook for using event bus
export const useEventBus = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  const subscribe = React.useCallback((event, callback) => {
    return eventBus.on(event, callback);
  }, []);
  
  const emit = React.useCallback((event, data) => {
    eventBus.emit(event, data);
  }, []);
  
  const once = React.useCallback((event, callback) => {
    return eventBus.once(event, callback);
  }, []);
  
  return { subscribe, emit, once, eventBus };
};

export default eventBus; 