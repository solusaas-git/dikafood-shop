/**
 * Global Checkout Error Handler
 * Handles order state synchronization issues between frontend and backend
 */

export const CheckoutErrorCodes = {
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  ORDER_COMPLETED: 'ORDER_COMPLETED', 
  ORDER_EXPIRED: 'ORDER_EXPIRED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  CART_OUTDATED: 'CART_OUTDATED',
  PRODUCT_UNAVAILABLE: 'PRODUCT_UNAVAILABLE',
  STOCK_VALIDATION_FAILED: 'STOCK_VALIDATION_FAILED',
  STOCK_RESERVATION_FAILED: 'STOCK_RESERVATION_FAILED',
  PENDING_ORDERS_FOUND: 'PENDING_ORDERS_FOUND',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK'
};

export class CheckoutErrorHandler {
  
  /**
   * Handle checkout-specific errors with appropriate user feedback and state cleanup
   * @param {Error} error - The error object
   * @param {Function} showError - Error notification function
   * @param {Function} showInfo - Info notification function
   * @param {Object} options - Additional options
   */
  static handle(error, showError, showInfo, options = {}) {
    const errorCode = error.response?.data?.code;
    const errorMessage = error.response?.data?.message || error.message;
    


    switch (errorCode) {
      case CheckoutErrorCodes.ORDER_CANCELLED:
        return this.handleOrderCancelled(showError, showInfo, options);
        
      case CheckoutErrorCodes.ORDER_COMPLETED:
        return this.handleOrderCompleted(showError, showInfo, options);
        
      case CheckoutErrorCodes.ORDER_EXPIRED:
        return this.handleOrderExpired(showError, showInfo, options);
        
      case CheckoutErrorCodes.SESSION_EXPIRED:
        return this.handleSessionExpired(showError, showInfo, options);
        
      case CheckoutErrorCodes.CART_OUTDATED:
        return this.handleCartOutdated(showError, showInfo, options);
        
      case CheckoutErrorCodes.PRODUCT_UNAVAILABLE:
        return this.handleProductUnavailable(showError, showInfo, options);
        
      case CheckoutErrorCodes.STOCK_VALIDATION_FAILED:
        return this.handleStockValidationFailed(error, showError, showInfo, options);
        
      case CheckoutErrorCodes.STOCK_RESERVATION_FAILED:
        return this.handleStockReservationFailed(error, showError, showInfo, options);
        
      case CheckoutErrorCodes.PENDING_ORDERS_FOUND:
        return this.handlePendingOrdersFound(error, showError, showInfo, options);
        
      case CheckoutErrorCodes.INSUFFICIENT_STOCK:
        return this.handleInsufficientStock(error, showError, showInfo, options);
        
      default:
        // Check for stock-related errors by message content
        if (this.isStockRelatedError(error)) {
          return this.handleGenericStockError(error, showError, showInfo, options);
        }
        
        // Generic error handling
        showError(errorMessage || 'Une erreur inattendue s\'est produite');
        return false;
    }
  }

  /**
   * Handle cancelled order - clear state and redirect to cart/shop
   */
  static handleOrderCancelled(showError, showInfo, options = {}) {
    showError('Cette commande a été annulée. Redémarrage du processus...');
    
    // Clear all checkout-related state
    this.clearCheckoutState();
    
    // Redirect strategy based on context
    setTimeout(() => {
      if (options.hasCartItems) {
        // If user has cart items, go back to cart
        window.location.href = '/cart';
      } else {
        // Otherwise go to shop
        window.location.href = '/shop';
      }
    }, 1500);
    
    return true;
  }

  /**
   * Handle completed order - clear state and redirect to orders
   */
  static handleOrderCompleted(showError, showInfo, options = {}) {
    showInfo('Cette commande a déjà été finalisée.');
    
    this.clearCheckoutState();
    
    setTimeout(() => {
      window.location.href = '/profile/orders';
    }, 1500);
    
    return true;
  }

  /**
   * Handle expired order - clear state and offer to restart
   */
  static handleOrderExpired(showError, showInfo, options = {}) {
    showError('Cette commande a expiré. Veuillez recommencer votre commande.');
    
    this.clearCheckoutState();
    
    setTimeout(() => {
      if (options.hasCartItems) {
        window.location.href = '/cart';
      } else {
        window.location.href = '/shop';
      }
    }, 2000);
    
    return true;
  }

  /**
   * Handle session expiry - redirect to login or continue as guest
   */
  static handleSessionExpired(showError, showInfo, options = {}) {
    showError('Votre session a expiré. Veuillez vous reconnecter ou continuer en tant qu\'invité.');
    
    // Don't clear checkout state immediately - user might want to continue as guest
    setTimeout(() => {
      if (options.requireAuth) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      } else {
        // Refresh page to get new guest session
        window.location.reload();
      }
    }, 2000);
    
    return true;
  }

  /**
   * Handle outdated cart - offer to refresh cart
   */
  static handleCartOutdated(showError, showInfo, options = {}) {
    showError('Votre panier n\'est plus à jour. Redirection vers le panier...');
    
    // Clear checkout state but keep cart
    localStorage.removeItem('checkout_orderId');
    localStorage.removeItem('checkout_step');
    sessionStorage.removeItem('checkout_formData');
    
    setTimeout(() => {
      window.location.href = '/cart';
    }, 1500);
    
    return true;
  }

  /**
   * Handle unavailable products - redirect to cart for review
   */
  static handleProductUnavailable(showError, showInfo, options = {}) {
    showError('Certains articles ne sont plus disponibles. Veuillez vérifier votre panier.');
    
    this.clearCheckoutState();
    
    setTimeout(() => {
      window.location.href = '/cart';
    }, 1500);
    
    return true;
  }

  /**
   * Clear all checkout-related state from storage
   */
  static clearCheckoutState() {
    // Clear checkout-specific data
    localStorage.removeItem('checkout_orderId');
    localStorage.removeItem('checkout_step');
    sessionStorage.removeItem('checkout_formData');
    sessionStorage.removeItem('checkout_contactData');
    sessionStorage.removeItem('checkout_deliveryData');
    sessionStorage.removeItem('checkout_paymentData');
    
    // Optionally clear cart if order was successfully started
    // (Don't clear if user just wants to restart)
    // localStorage.removeItem('cart_items');
    

  }

  /**
   * Handle stock validation failures with detailed conflict resolution
   */
  static handleStockValidationFailed(error, showError, showInfo, options = {}) {
    const errorData = error.response?.data?.data;
    
    if (errorData && errorData.unavailableItems) {
      const unavailableCount = errorData.unavailableItems.length;
      const hasPartialStock = errorData.unavailableItems.some(item => item.availableStock > 0);
      
      if (hasPartialStock) {
        showError(`${unavailableCount} article(s) avec stock insuffisant. Ajustement des quantités recommandé.`);
        // Could trigger a modal here for quantity adjustment
        this.triggerStockConflictModal(errorData, options);
      } else {
        showError(`${unavailableCount} article(s) non disponible(s). Redirection vers le panier...`);
        setTimeout(() => window.location.href = '/cart', 2000);
      }
    } else {
      showError('Validation du stock échouée. Veuillez vérifier votre panier.');
      setTimeout(() => window.location.href = '/cart', 1500);
    }
    
    return true;
  }

  /**
   * Handle stock reservation failures during checkout
   */
  static handleStockReservationFailed(error, showError, showInfo, options = {}) {
    showError('Stock épuisé pendant le traitement de votre commande. Veuillez réessayer.');
    
    // Clear current checkout state and refresh cart
    this.clearCheckoutState();
    
    setTimeout(() => {
      window.location.href = '/cart';
    }, 2000);
    
    return true;
  }

  /**
   * Handle pending orders found during checkout start
   */
  static handlePendingOrdersFound(error, showError, showInfo, options = {}) {
    const errorData = error.response?.data?.data;
    
    if (errorData && errorData.pendingOrders) {
      const pendingCount = errorData.pendingOrders.length;
      showInfo(`Vous avez ${pendingCount} commande(s) en attente. Veuillez les finaliser ou les annuler.`);
      
      // Could trigger a pending orders modal here
      this.triggerPendingOrdersModal(errorData.pendingOrders, options);
    } else {
      showError('Commandes en attente détectées. Veuillez finaliser vos commandes précédentes.');
    }
    
    return true;
  }

  /**
   * Handle insufficient stock errors
   */
  static handleInsufficientStock(error, showError, showInfo, options = {}) {
    const errorMessage = error.response?.data?.message || error.message;
    showError(errorMessage);
    
    // Refresh cart to show updated stock levels
    setTimeout(() => {
      if (options.refreshCart) {
        options.refreshCart();
      } else {
        window.location.reload();
      }
    }, 1500);
    
    return true;
  }

  /**
   * Handle generic stock-related errors
   */
  static handleGenericStockError(error, showError, showInfo, options = {}) {
    const errorMessage = error.response?.data?.message || error.message;
    
    if (errorMessage.toLowerCase().includes('stock')) {
      showError('Problème de stock détecté. Vérification de votre panier...');
      setTimeout(() => window.location.href = '/cart', 1500);
    } else {
      showError(errorMessage);
    }
    
    return true;
  }

  /**
   * Check if an error is stock-related
   */
  static isStockRelatedError(error) {
    const errorMessage = (error.response?.data?.message || error.message || '').toLowerCase();
    const stockKeywords = ['stock', 'inventory', 'unavailable', 'insufficient', 'depleted', 'reserved'];
    
    return stockKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Trigger stock conflict resolution modal
   */
  static triggerStockConflictModal(errorData, options = {}) {
    // Dispatch custom event for stock conflict
    const event = new CustomEvent('stockConflict', {
      detail: {
        unavailableItems: errorData.unavailableItems,
        suggestions: this.generateStockSuggestions(errorData.unavailableItems),
        options
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Trigger pending orders modal
   */
  static triggerPendingOrdersModal(pendingOrders, options = {}) {
    const event = new CustomEvent('pendingOrdersFound', {
      detail: {
        pendingOrders,
        options
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Generate user-friendly suggestions for stock conflicts
   */
  static generateStockSuggestions(unavailableItems) {
    return unavailableItems.map(item => {
      if (item.availableStock > 0) {
        return {
          type: 'adjust_quantity',
          productId: item.productId,
          size: item.size,
          message: `Réduire à ${item.availableStock} disponible(s)`,
          newQuantity: item.availableStock
        };
      } else {
        return {
          type: 'remove_item',
          productId: item.productId,
          size: item.size,
          message: 'Retirer du panier'
        };
      }
    });
  }

  /**
   * Check if an error is checkout-related and should be handled specially
   */
  static isCheckoutError(error) {
    const errorCode = error.response?.data?.code;
    return Object.values(CheckoutErrorCodes).includes(errorCode) || this.isStockRelatedError(error);
  }

  /**
   * Validate checkout state on page load/navigation
   */
  static async validateCheckoutState(orderId, checkoutService = null) {
    // TODO: Implement validation when checkout service is ready
    console.log('[CheckoutErrorHandler] Checkout validation disabled - orderId:', orderId);
    return { valid: true };
  }

  /**
   * Auto-recovery: attempt to sync state with backend
   */
  static async attemptAutoRecovery(checkoutService = null, showInfo) {
    // TODO: Implement auto-recovery when checkout service is ready
    console.log('[CheckoutErrorHandler] Auto-recovery disabled');
    return { recovered: false };
  }
}

export default CheckoutErrorHandler; 