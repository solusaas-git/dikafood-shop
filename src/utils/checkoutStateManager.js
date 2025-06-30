/**
 * Advanced Checkout State Manager
 * Handles state synchronization, conflict resolution, and automatic recovery
 */

// Checkout service removed - functionality disabled until backend implementation
import CheckoutErrorHandler from './checkoutErrorHandler';

export class CheckoutStateManager {
  static STORAGE_KEYS = {
    ORDER_ID: 'dikafood_checkout_order_id',
    CURRENT_STEP: 'dikafood_checkout_current_step', 
    FORM_DATA: 'dikafood_checkout_form_data',
    COMPLETED_STEPS: 'dikafood_checkout_completed_steps',
    CHECKOUT_TIMESTAMP: 'dikafood_checkout_timestamp',
    SYNC_TOKEN: 'dikafood_checkout_sync_token'
  };

  static EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes
  static SYNC_INTERVAL = 60 * 1000; // 1 minute
  static MAX_RETRY_ATTEMPTS = 3;

  static syncInterval = null;
  static isOnline = navigator.onLine;
  static pendingOperations = [];

  /**
   * Initialize the state manager with real-time sync
   */
  static initialize(errorHandler, infoHandler) {
    this.errorHandler = errorHandler;
    this.infoHandler = infoHandler;
    
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Listen for storage events (multi-tab sync)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Start background sync
    this.startBackgroundSync();
    
    return this;
  }

  /**
   * Save state with conflict detection
   */
  static async saveState(orderId, currentStep, formData, completedSteps) {
    const timestamp = Date.now();
    const syncToken = this.generateSyncToken();
    
    const stateData = {
      orderId, currentStep, formData, completedSteps, timestamp, syncToken
    };

    try {
      // Save locally first (optimistic update)
      this.saveToStorage(stateData);
      
      // Queue for background sync if offline
      if (!this.isOnline) {
        this.queueOperation('saveState', stateData);
        return { success: true, synced: false };
      }
      
      return { success: true, synced: true };
    } catch (error) {
      console.error('[CheckoutStateManager] Error saving state:', error);
      return { success: true, synced: false, error: error.message };
    }
  }

  /**
   * Load state with automatic backend validation
   */
  static async loadState(options = {}) {
    try {
      const localState = this.loadFromStorage();
      
      if (!localState) {
        return null;
      }
      
      // Check if session has expired
      if (this.isExpired(localState.timestamp)) {

        this.clearState();
        return null;
      }
      
      // Skip backend validation until checkout is implemented
      if (!this.isOnline || options.skipValidation || true) { // Always skip for now
        return localState;
      }
      
      return localState;
    } catch (error) {
      console.error('[CheckoutStateManager] Error loading state:', error);
      const localState = this.loadFromStorage();
      return localState?.timestamp && !this.isExpired(localState.timestamp) ? localState : null;
    }
  }

  /**
   * Handle online event - resume sync operations
   */
  static handleOnline() {

    this.isOnline = true;
    this.processPendingOperations();
  }

  /**
   * Handle offline event - queue operations
   */
  static handleOffline() {

    this.isOnline = false;
  }

  /**
   * Handle storage changes from other tabs
   */
  static handleStorageChange(event) {
    if (Object.values(this.STORAGE_KEYS).includes(event.key)) {

      
      // Notify the app about state changes
      window.dispatchEvent(new CustomEvent('checkoutStateChanged', {
        detail: {
          key: event.key,
          newValue: event.newValue,
          oldValue: event.oldValue
        }
      }));
    }
  }

  /**
   * Clear all checkout state
   */
  static clearState() {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Clear pending operations
      this.pendingOperations = [];
      

    } catch (error) {
      console.warn('[CheckoutStateManager] Failed to clear state:', error);
    }
  }

  /**
   * Start background synchronization
   */
  static startBackgroundSync() {
    if (this.syncInterval) {
      return; // Already running
    }
    
    this.syncInterval = setInterval(async () => {
      if (this.isOnline) {
        await this.performBackgroundSync();
        await this.processPendingOperations();
      }
    }, this.SYNC_INTERVAL);
  }

  /**
   * Stop background synchronization
   */
  static stopBackgroundSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Private helper methods
  static saveToStorage(stateData) {
    localStorage.setItem(this.STORAGE_KEYS.ORDER_ID, stateData.orderId || '');
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_STEP, stateData.currentStep.toString());
    localStorage.setItem(this.STORAGE_KEYS.CHECKOUT_TIMESTAMP, stateData.timestamp.toString());
    localStorage.setItem(this.STORAGE_KEYS.SYNC_TOKEN, stateData.syncToken);
    
    sessionStorage.setItem(this.STORAGE_KEYS.FORM_DATA, JSON.stringify(stateData.formData));
    sessionStorage.setItem(this.STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(stateData.completedSteps));
  }

  static loadFromStorage() {
    try {
      const orderId = localStorage.getItem(this.STORAGE_KEYS.ORDER_ID);
      const currentStep = parseInt(localStorage.getItem(this.STORAGE_KEYS.CURRENT_STEP) || '0');
      const timestamp = parseInt(localStorage.getItem(this.STORAGE_KEYS.CHECKOUT_TIMESTAMP) || '0');
      const syncToken = localStorage.getItem(this.STORAGE_KEYS.SYNC_TOKEN);
      const formData = JSON.parse(sessionStorage.getItem(this.STORAGE_KEYS.FORM_DATA) || '{}');
      const completedSteps = JSON.parse(sessionStorage.getItem(this.STORAGE_KEYS.COMPLETED_STEPS) || '{}');

      return orderId ? { orderId, currentStep, timestamp, syncToken, formData, completedSteps } : null;
    } catch (error) {
      console.warn('[CheckoutStateManager] Failed to load from storage:', error);
      return null;
    }
  }

  static async validateWithBackend(localState) {
    // TODO: Implement backend validation when checkout endpoints are ready
    // For now, assume local state is valid
    return { valid: true };
  }

  static isExpired(timestamp) {
    return Date.now() - timestamp > this.EXPIRY_TIME;
  }

  static generateSyncToken() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static queueOperation(operation, data) {
    this.pendingOperations.push({ operation, data, timestamp: Date.now() });
  }

  static async processPendingOperations() {
    if (this.pendingOperations.length === 0) {
      return;
    }


    
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];
    
    for (const op of operations) {
      try {
        if (op.operation === 'saveState') {
          await this.syncWithBackend(op.data);
        }
      } catch (error) {
        console.error('[CheckoutStateManager] Failed to process pending operation:', error);
        // Re-queue if critical
        if (Date.now() - op.timestamp < this.EXPIRY_TIME) {
          this.pendingOperations.push(op);
        }
      }
    }
  }

  static async performBackgroundSync() {
    const localState = this.loadFromStorage();
    
    if (localState?.orderId) {
      const validationResult = await this.validateWithBackend(localState);
      
      if (!validationResult.valid) {
        this.handleValidationFailure(localState, validationResult);
      }
    }
  }

  static handleValidationFailure(localState, validationResult) {
    console.warn('[CheckoutStateManager] Validation failed:', validationResult);
    
    if (validationResult.shouldRestart) {
      this.clearState();
      return null;
    }
    
    if (validationResult.shouldRedirect) {
      window.location.href = validationResult.shouldRedirect;
      return null;
    }
    
    return localState; // Keep local state if no clear action
  }
}

export default CheckoutStateManager; 