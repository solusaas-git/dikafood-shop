import { useState } from 'react';
import { api } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

/**
 * Custom hook to handle checkout and order placement
 */
export function useCheckout() {
  const { cart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // Example: formData should be managed by the checkout page/component
  // and passed to this hook as needed

  /**
   * Place an order with the backend
   * @param {object} formData - Collected from checkout steps
   */
  const placeOrder = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Map frontend data to backend order schema
      const orderData = {
        items: cart.items.map(item => ({
          product: item.productId || item._id || item.id,
          variant: item.variantId || item.variant || item.selectedVariantId,
          quantity: item.quantity,
          price: item.price,
          currency: item.currency || 'MAD',
        })),
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        billingAddress: {
          street: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode || '',
        },
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode || '',
        },
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethodId,
        notes: formData.notes || '',
        total: formData.total,
      };
      const response = await api.createOrder(orderData);
      if (response.success && response.data?.order) {
        setOrderId(response.data.order._id);
        clearCart();
        return response.data.order;
      } else {
        throw new Error(response.message || 'Order creation failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    orderId,
    placeOrder,
  };
}
