/**
 * 🛒 Clean Cart Context - Simple & Effective
 * Manages shopping cart state with the new API service
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import sessionService from '../services/SessionService.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart on component mount (for both guest and authenticated users)
  useEffect(() => {
    loadCart();
  }, []);

  // Listen to session transition events
  useEffect(() => {
    const unsubscribeTransition = eventBus.on(EVENTS.SESSION_TRANSITION, (data) => {
      
      // Reload cart after session transition
      // Small delay to let auth/merge operations complete
      setTimeout(() => {
        loadCart();
      }, 200);
    });

    const unsubscribeCleared = eventBus.on(EVENTS.SESSION_CLEARED, () => {
      // Reset cart to empty state
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
    });

    const unsubscribeSyncRequest = eventBus.on(EVENTS.CART_SYNC_REQUESTED, () => {
      loadCart();
    });

    // Cleanup listeners
    return () => {
      unsubscribeTransition();
      unsubscribeCleared();
      unsubscribeSyncRequest();
    };
  }, []);

  // Update derived values when cart changes
  useEffect(() => {
    if (cart?.items) {
      setItemCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
      setTotalAmount(cart.totalAmount || 0);
    } else {
      setItemCount(0);
      setTotalAmount(0);
    }
  }, [cart]);

  const loadCart = async () => {
    try {
      setLoading(true);
      
      const response = await api.getCart();
      
      if (response.success && response.data?.cart) {
        const cartData = response.data.cart;
        
        // Transform API response to match expected format
        const transformedCart = {
          id: cartData.id,
          items: cartData.items || [],
          totalAmount: cartData.subtotal || 0,
          itemCount: cartData.itemCount || 0,
          currency: cartData.currency || 'MAD',
          isEmpty: cartData.isEmpty || cartData.items?.length === 0
        };
        
        setCart(transformedCart);
      } else {
        setCart({ items: [], totalAmount: 0, itemCount: 0, isEmpty: true });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCart({ items: [], totalAmount: 0, itemCount: 0, isEmpty: true });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      setLoading(true);
      
      // Map frontend item structure to backend expected structure
      const backendItem = {
        productId: item.product?.id || item.product?._id || item.productId,
        variantId: item.variant?._id || item.variant?.id || item.variantId,
        quantity: item.quantity || 1
      };


      // Validate required fields
      if (!backendItem.productId || !backendItem.variantId || !backendItem.quantity) {
        console.error('Missing required cart item fields:', backendItem);
        return { success: false, error: 'Missing required product information' };
      }

      // Call API to add item to cart
      const response = await api.addToCart(backendItem);
      
      if (response.success && response.data?.cart) {
        const cartData = response.data.cart;
        
        // Transform API response to match expected format
        const transformedCart = {
          id: cartData.id,
          items: cartData.items || [],
          totalAmount: cartData.subtotal || 0,
          itemCount: cartData.itemCount || 0,
          currency: cartData.currency || 'MAD',
          isEmpty: cartData.isEmpty || cartData.items?.length === 0
        };
        
        setCart(transformedCart);
        
        // Emit cart item added event for UI updates (like opening cart panel)
        eventBus.emit(EVENTS.CART_ITEM_ADDED, {
          item: backendItem,
          cart: transformedCart
        });
        
        return { success: true };
      } else {
        console.error('Failed to add item to cart:', response);
        return { success: false, error: response.message || 'Failed to add item to cart' };
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      return { success: false, error: error.message || 'Failed to add item' };
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, data) => {
    try {
      setLoading(true);
      
      
      const response = await api.updateCartItem(itemId, data);
      
      if (response.success && response.data?.cart) {
        const cartData = response.data.cart;
        
        // Transform API response to match expected format
        const transformedCart = {
          id: cartData.id,
          items: cartData.items || [],
          totalAmount: cartData.subtotal || 0,
          itemCount: cartData.itemCount || 0,
          currency: cartData.currency || 'MAD',
          isEmpty: cartData.isEmpty || cartData.items?.length === 0
        };
        
        setCart(transformedCart);
        return { success: true };
      } else {
        console.error('Failed to update cart item:', response);
        return { success: false, error: response.message || 'Failed to update item' };
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      return { success: false, error: error.message || 'Failed to update item' };
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      
      
      const response = await api.removeFromCart(itemId);
      
      if (response.success && response.data?.cart) {
        const cartData = response.data.cart;
        
        // Transform API response to match expected format
        const transformedCart = {
          id: cartData.id,
          items: cartData.items || [],
          totalAmount: cartData.subtotal || 0,
          itemCount: cartData.itemCount || 0,
          currency: cartData.currency || 'MAD',
          isEmpty: cartData.isEmpty || cartData.items?.length === 0
        };
        
        setCart(transformedCart);
        return { success: true };
      } else {
        console.error('Failed to remove cart item:', response);
        return { success: false, error: response.message || 'Failed to remove item' };
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      return { success: false, error: error.message || 'Failed to remove item' };
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    try {
      setLoading(true);
      
      
      const response = await api.clearCart();
      
      if (response.success) {
        setCart({ items: [], totalAmount: 0, itemCount: 0, isEmpty: true });
        return { success: true };
      } else {
        console.error('Failed to clear cart:', response);
        return { success: false, error: response.message || 'Failed to clear cart' };
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { success: false, error: error.message || 'Failed to clear cart' };
    } finally {
      setLoading(false);
    }
  };

  // Cart conflict resolution methods
  const mergeCart = async (strategy = 'merge', guestSessionId = null) => {
    try {
      setLoading(true);
      
      
      const response = await api.mergeCart(strategy, guestSessionId);
      
      if (response.success && response.data?.cart) {
        const cartData = response.data.cart;
        
        // Transform API response to match expected format
        const transformedCart = {
          id: cartData.id,
          items: cartData.items || [],
          totalAmount: cartData.subtotal || 0,
          itemCount: cartData.itemCount || 0,
          currency: cartData.currency || 'MAD',
          isEmpty: cartData.isEmpty || cartData.items?.length === 0
        };
        
        setCart(transformedCart);
        
        // Emit cart sync event to notify other components
        eventBus.emit(EVENTS.CART_SYNC_REQUESTED);
        
        return { 
          success: true, 
          mergeInfo: response.data.mergeInfo 
        };
      } else {
        console.error('❌ Failed to merge cart:', response);
        return { success: false, error: response.message || 'Failed to merge cart' };
      }
    } catch (error) {
      console.error('Failed to merge cart:', error);
      return { success: false, error: error.message || 'Failed to merge cart' };
    } finally {
      setLoading(false);
    }
  };

  const checkCartConflicts = async () => {
    try {
      // Check if there's a guest session that might have cart items
      const guestSessionId = sessionService.getGuestSessionIdForMerge();
      
      if (!guestSessionId) {
        return { hasConflicts: false };
      }
      
      // We could add a specific API endpoint to check for conflicts
      // For now, we'll assume conflicts exist if there's a guest session
      return { 
        hasConflicts: true, 
        guestSessionId,
        strategies: ['merge', 'replace', 'keep_existing']
      };
    } catch (error) {
      console.error('Failed to check cart conflicts:', error);
      return { hasConflicts: false };
    }
  };

  const getItemInCart = (productIdOrVariant, variantId = null) => {
    if (!cart?.items) return null;
    
    // Handle different parameter formats
    let productId, targetVariantId;
    
    if (typeof productIdOrVariant === 'object' && productIdOrVariant !== null) {
      // Called with variant object: getItemInCart(activeVariant)
      targetVariantId = productIdOrVariant._id || productIdOrVariant.id;
      // Try to find any item with this variantId
      return cart.items.find(item => item.variantId === targetVariantId);
    } else {
      // Called with separate parameters: getItemInCart(productId, variantId)
      productId = productIdOrVariant;
      targetVariantId = variantId;
      
      return cart.items.find(item => 
        item.productId === productId && 
        (targetVariantId ? item.variantId === targetVariantId : !item.variantId)
      );
    }
  };

  const calculateTotals = () => {
    const subtotal = cart?.totalAmount || 0;
    
    // Calculate regular subtotal (before promotions) for comparison
    let regularSubtotal = 0;
    let hasPromotions = false;
    
    if (cart?.items) {
      regularSubtotal = cart.items.reduce((sum, item) => {
        const regularPrice = item.variant?.price || item.price || 0;
        const promotionalPrice = item.variant?.promotionalPrice;
        
        // Check if this item has a promotion
        if (promotionalPrice && promotionalPrice < regularPrice) {
          hasPromotions = true;
        }
        
        return sum + (regularPrice * item.quantity);
      }, 0);
    }
    
    // For now, using simple shipping calculation
    // You can make this more sophisticated based on location, weight, etc.
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 MAD
    
    // Tax calculation (if applicable)
    const tax = 0; // No tax for now, can be added later
    
    const total = subtotal + shipping + tax;
    const regularTotal = regularSubtotal + shipping + tax;
    
    return {
      subtotal,
      regularSubtotal,
      shipping,
      tax,
      total,
      regularTotal,
      hasPromotions,
      savings: regularSubtotal - subtotal
    };
  };

  const value = {
    cart,
    loading,
    itemCount,
    totalAmount,
    addItem,
    updateItem,
    removeItem,
    clear,
    loadCart,
    refreshCart: loadCart,
    getItemInCart,
    setCart,
    calculateTotals,
    // Cart conflict resolution
    mergeCart,
    checkCartConflicts,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 