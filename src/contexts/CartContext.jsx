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
      console.log('🛒 Cart detected session transition:', data);
      
      // Reload cart after session transition
      // Small delay to let auth/merge operations complete
      setTimeout(() => {
        loadCart();
      }, 200);
    });

    const unsubscribeCleared = eventBus.on(EVENTS.SESSION_CLEARED, () => {
      console.log('🛒 Cart detected session cleared');
      // Reset cart to empty state
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
    });

    const unsubscribeSyncRequest = eventBus.on(EVENTS.CART_SYNC_REQUESTED, () => {
      console.log('🛒 Cart sync requested, reloading cart');
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
        setCart(response.data.cart);
      } else {
        setCart({ items: [], totalAmount: 0, itemCount: 0 });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
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

      console.log('🛒 CartContext - Adding item:', {
        originalItem: item,
        mappedBackendItem: backendItem,
        productSource: {
          'item.product?.id': item.product?.id,
          'item.product?._id': item.product?._id,
          'item.productId': item.productId
        },
        variantSource: {
          'item.variant?._id': item.variant?._id,
          'item.variant?.id': item.variant?.id,
          'item.variantId': item.variantId
        }
      });

      // Validate required fields
      if (!backendItem.productId || !backendItem.variantId || !backendItem.quantity) {
        console.error('❌ Missing required cart item fields:', backendItem);
        return { success: false, error: 'Missing required product information' };
      }

      const response = await api.addToCart(backendItem);
      
      if (response.success && response.data?.cart) {
        setCart(response.data.cart);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to add item' };
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
        setCart(response.data.cart);
        return { success: true };
      } else {
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
        setCart(response.data.cart);
        return { success: true };
      } else {
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
        setCart({ items: [], totalAmount: 0, itemCount: 0 });
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to clear cart' };
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { success: false, error: error.message || 'Failed to clear cart' };
    } finally {
      setLoading(false);
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
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 