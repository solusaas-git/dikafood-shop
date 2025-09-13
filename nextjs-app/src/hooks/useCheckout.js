import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

/**
 * Custom hook to handle checkout and order placement
 */
export function useCheckout() {
  const router = useRouter();
  const { cart, clear: clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  // Checkout flow state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    // Contact info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Address info
    address: '',
    city: '',
    country: 'MA',
    postalCode: '',
    // Delivery info
    deliveryMethodId: '',
    shopId: '',
    // Payment info
    paymentMethod: '',
    bankId: '',
  });

  // Load saved data from localStorage after component mounts
  useEffect(() => {
    // Load saved form data
    const savedFormData = localStorage.getItem('checkout-form-data');
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    // Load saved current step (but don't load step 3 unless there's an order)
    const savedCurrentStep = localStorage.getItem('checkout-current-step');
    if (savedCurrentStep) {
      const stepNumber = parseInt(savedCurrentStep, 10);
      // Don't restore step 3 (confirmation) unless we have order details
      if (stepNumber === 3 && !orderPlaced) {
        setCurrentStep(0); // Reset to first step
      } else if (stepNumber <= 2) {
        setCurrentStep(stepNumber);
      }
    }

    // Load saved completed steps
    const savedCompletedSteps = localStorage.getItem('checkout-completed-steps');
    if (savedCompletedSteps) {
      try {
        setCompletedSteps(JSON.parse(savedCompletedSteps));
      } catch (error) {
        console.error('Error parsing completed steps:', error);
      }
    }
  }, []);
  
  // Checkout data
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    deliveryMethods: false,
    paymentMethods: false,
  });

  // No initial data loading - load on demand when reaching specific steps

  // Load delivery methods when reaching step 1 (delivery step)
  useEffect(() => {
    if (currentStep === 1) {
      loadDeliveryMethods(formData.city);
    }
  }, [currentStep]);

  // Load payment methods when reaching step 2 (payment step)
  useEffect(() => {
    if (currentStep === 2) {
      loadPaymentMethods();
    }
  }, [currentStep]);

  // Reload delivery methods when city changes (only if already on step 1 or later)
  useEffect(() => {
    if (currentStep >= 1 && formData.city) {
      loadDeliveryMethods(formData.city);
    }
  }, [formData.city]);

  // Form data management with localStorage persistence
  const updateFormData = (updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      // Save to localStorage
      localStorage.setItem('checkout-form-data', JSON.stringify(newData));
      return newData;
    });
  };

  // Step navigation with localStorage persistence
  const nextStep = () => {
    const newCompletedSteps = [...completedSteps];
    if (!newCompletedSteps.includes(currentStep)) {
      newCompletedSteps.push(currentStep);
    }
    setCompletedSteps(newCompletedSteps);
    const newStep = Math.min(currentStep + 1, 3);
    setCurrentStep(newStep);
    
    // Save to localStorage
    localStorage.setItem('checkout-completed-steps', JSON.stringify(newCompletedSteps));
    localStorage.setItem('checkout-current-step', newStep.toString());
  };

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 0);
    setCurrentStep(newStep);
    
    // Save to localStorage
    localStorage.setItem('checkout-current-step', newStep.toString());
  };

  // Load delivery methods
  const loadDeliveryMethods = async (city = null) => {
    setLoadingStates(prev => ({ ...prev, deliveryMethods: true }));
    try {
      let url = '/api/delivery-methods?active=true';
      if (city) {
        url += `&city=${encodeURIComponent(city)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const methods = data.data || [];
        setDeliveryMethods(methods);
        
        // Clear selected delivery method if it's not available for this city
        if (formData.deliveryMethodId && !methods.find(m => m._id === formData.deliveryMethodId)) {
          const updatedData = { ...formData, deliveryMethodId: '', shopId: '' };
          setFormData(prev => updatedData);
          localStorage.setItem('checkout-form-data', JSON.stringify(updatedData));
        }
      } else {
        throw new Error(data.message || 'Failed to load delivery methods');
      }
    } catch (error) {
      console.error('Failed to load delivery methods:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, deliveryMethods: false }));
    }
  };

  // Load payment methods
  const loadPaymentMethods = async () => {
    setLoadingStates(prev => ({ ...prev, paymentMethods: true }));
    try {
      const response = await fetch('/api/payment-methods?active=true');
      const data = await response.json();
      
      if (data.success) {
        const methods = data.data || [];
        setPaymentMethods(methods);
        
        // Clear selected payment method if it's not available
        if (formData.paymentMethod && !methods.find(m => m._id === formData.paymentMethod)) {
          const updatedData = { ...formData, paymentMethod: '', selectedBankId: '' };
          setFormData(prev => updatedData);
          localStorage.setItem('checkout-form-data', JSON.stringify(updatedData));
        }
      } else {
        throw new Error(data.message || 'Failed to load payment methods');
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, paymentMethods: false }));
    }
  };


  /**
   * Place an order with the backend
   * @param {object} orderFormData - Collected from checkout steps (optional, uses internal formData if not provided)
   */
  const placeOrder = async (orderFormData = formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get cart data - ensure we have cart items
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('Votre panier est vide');
      }
      
      // Get city delivery fee
      const getCityDeliveryFee = async (cityName) => {
        if (!cityName) return 0;
        
        try {
          const response = await fetch(`/api/cities?name=${encodeURIComponent(cityName)}`);
          const data = await response.json();
          
          if (data.success && data.data?.cities?.length > 0) {
            const city = data.data.cities.find(c => c.name === cityName);
            return city?.deliveryFee || 0;
          }
          return 0;
        } catch (error) {
          console.error('Failed to fetch city delivery fee:', error);
          return 0; // Default to 0 if fetch fails
        }
      };
      
      // Calculate proper delivery fees
      const calculateDeliveryFee = async () => {
        let totalDeliveryFee = 0;
        
        // Add city delivery fee if city is selected
        if (orderFormData.city) {
          const cityFee = await getCityDeliveryFee(orderFormData.city);
          totalDeliveryFee += cityFee;
        }
        
        // Add delivery method additional cost if selected
        if (orderFormData.deliveryMethodId) {
          const selectedMethod = deliveryMethods.find(m => m._id === orderFormData.deliveryMethodId);
          if (selectedMethod) {
            totalDeliveryFee += (selectedMethod.price || 0);
          }
        }
        
        return totalDeliveryFee;
      };
      
      // Calculate totals with proper delivery fee
      const subtotal = cart.totalAmount || 0;
      const shipping = await calculateDeliveryFee();
      const tax = 0; // No tax for now
      const total = subtotal + shipping + tax;
      
      // Format phone number to international format
      const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // If it starts with 212, it's already in international format
        if (cleaned.startsWith('212')) {
          return `+${cleaned}`;
        }
        
        // If it starts with 0, replace with +212
        if (cleaned.startsWith('0')) {
          return `+212${cleaned.substring(1)}`;
        }
        
        // If it's a 9-digit number (Moroccan mobile without prefix)
        if (cleaned.length === 9) {
          return `+212${cleaned}`;
        }
        
        // Default: assume it needs +212 prefix
        return `+212${cleaned}`;
      };
      
      // Map frontend data to backend order schema according to API expectations
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product?.id || item.productId,
          variant: {
            id: item.variant?.id || item.variantId,
            size: item.variant?.size || item.size,
            sku: item.variant?.sku || item.sku,
            price: item.variant?.price,
            promotionalPrice: item.variant?.promotionalPrice,
            imageUrl: item.variant?.imageUrl,
            imageUrls: item.variant?.imageUrls || []
          },
          quantity: item.quantity,
          price: item.price, // Current unit price (could be promotional)
          regularPrice: item.variant?.price || item.price, // Regular price from variant
          promotionalPrice: item.variant?.promotionalPrice || null, // Promotional price if available
          total: item.total || (item.price * item.quantity),
          name: item.product?.name || item.name,
          productName: item.product?.name || item.name,
          sku: item.variant?.sku || item.sku,
          size: item.variant?.size || item.size,
          imageUrl: item.variant?.imageUrl,
          imageUrls: item.variant?.imageUrls || []
        })),
        customerInfo: {
          firstName: orderFormData.firstName,
          lastName: orderFormData.lastName,
          email: orderFormData.email,
          phone: formatPhoneNumber(orderFormData.phone),
        },
        billingAddress: {
          type: 'billing',
          label: 'Adresse de facturation',
          street: orderFormData.address,
          city: orderFormData.city,
          country: orderFormData.country === 'Maroc' ? 'Morocco' : orderFormData.country, // Convert to English for model
          postalCode: orderFormData.postalCode || '00000', // Default postal code if not provided
          isDefault: true
        },
        deliveryAddress: {
          type: 'shipping',
          label: 'Adresse de livraison',
          street: orderFormData.address,
          city: orderFormData.city,
          country: orderFormData.country === 'Maroc' ? 'Morocco' : orderFormData.country, // Convert to English for model
          postalCode: orderFormData.postalCode || '00000', // Default postal code if not provided
          instructions: orderFormData.notes || '',
          isDefault: true
        },
        paymentMethod: (() => {
          // Find the selected payment method to get its type
          const selectedPaymentMethod = paymentMethods.find(pm => pm._id === orderFormData.paymentMethod);
          if (!selectedPaymentMethod) return 'cash_on_delivery'; // fallback
          
          // Map payment method types to Order model enum values
          const typeMapping = {
            'cash': 'cash_on_delivery',
            'cash-on-delivery': 'cash_on_delivery',
            'card': 'credit_card',
            'stripe': 'credit_card',
            'bank_transfer': 'bank_transfer',
            'bank': 'bank_transfer',
            'digital_wallet': 'credit_card', // treat as credit card
            'other': 'cash_on_delivery' // fallback
          };
          
          return typeMapping[selectedPaymentMethod.type] || 'cash_on_delivery';
        })(),
        deliveryMethod: orderFormData.deliveryMethodId,
        notes: orderFormData.notes || '',
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        currency: 'MAD'
      };
      
      
      
      const response = await api.createOrder(orderData);
      
      if (response.success && response.data?.order) {
        setOrderDetails(response.data.order);
        setOrderId(response.data.order._id);
        setOrderPlaced(true);
        
        // Clear the cart after successful order
        clearCart();
        
        // Clear checkout data from localStorage
        localStorage.removeItem('checkout-form-data');
        localStorage.removeItem('checkout-current-step');
        localStorage.removeItem('checkout-completed-steps');
        
        // Redirect to secure confirmation page
        if (response.data.confirmationUrl) {
          router.push(response.data.confirmationUrl);
        } else {
          // Fallback: move to confirmation step (step 3)
          setCurrentStep(3);
          localStorage.setItem('checkout-current-step', '3');
        }
        
        return response.data.order;
      } else {
        throw new Error(response.message || 'Échec de la création de commande');
      }
    } catch (err) {
      console.error('❌ Order placement error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Loading states
    isLoading,
    error,
    loadingStates,
    
    // Order state
    orderId,
    orderDetails,
    orderPlaced,
    
    // Step navigation
    currentStep,
    setCurrentStep,
    completedSteps,
    nextStep,
    prevStep,
    
    // Form management
    formData,
    updateFormData,
    errors,
    
    // Checkout data
    deliveryMethods,
    paymentMethods,
    
    // Actions
    placeOrder,
  };
}
