import { useEffect } from 'react';
import { eventBus, EVENTS } from '../utils/eventBus.js';

/**
 * Custom hook to manage cart panel auto-open functionality
 * @param {Function} setActiveMenu - Function to set the active menu state
 * @param {boolean} isMobile - Whether current view is mobile
 * @param {number} autoCloseDelay - Delay in milliseconds before auto-closing (0 = no auto-close)
 */
export const useCartPanel = (setActiveMenu, isMobile = false, autoCloseDelay = 4000) => {
  useEffect(() => {
    let timeoutId = null;

    // Listen for cart item added events
    const handleCartItemAdded = (data) => {
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Determine which cart menu to open based on screen size
      const cartMenuKey = isMobile ? 'cart-mobile' : 'cart-desktop';
      
      // Open the cart panel
      setActiveMenu(cartMenuKey);
      
      // Auto-close after specified delay (if enabled)
      if (autoCloseDelay > 0) {
        timeoutId = setTimeout(() => {
          setActiveMenu(null);
        }, autoCloseDelay);
      }
    };

    // Subscribe to cart item added events
    const unsubscribe = eventBus.on(EVENTS.CART_ITEM_ADDED, handleCartItemAdded);

    // Cleanup subscription and timeout on unmount
    return () => {
      unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [setActiveMenu, isMobile, autoCloseDelay]);
};

export default useCartPanel;
