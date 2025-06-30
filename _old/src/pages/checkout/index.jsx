import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Pencil, ArrowSquareOut, X, Tag, NumberCircleOne, NumberCircleTwo, NumberCircleThree, ArrowUpRight, Info, Warning, Plus, Minus, CaretDown, Truck, Clock, CurrencyCircleDollar } from '@phosphor-icons/react';
import CheckoutSteps from './components/CheckoutSteps';
import MobileBottomNav from './components/MobileBottomNav';
import ContactLocationForm from './components/ContactLocationForm';
import PaymentShippingForm from './components/PaymentForm';
import RecapForm from './components/RecapForm';
import OrderConfirmation from './components/OrderConfirmation';
import { products, formatPrice } from '../../data/products';
import './checkout.scss';
import './styles_modular/cart-summary.scss';

// Create mock cart items using real products
const mockCartItems = [
  {
    id: products[0].variants[0].id,
    name: products[0].name,
    price: products[0].variants[0].price,
    quantity: 1,
    image: products[0].variants[0].image,
    variant: products[0].variants[0].size,
    productId: products[0].id // Add productId for linking to product page
  },
  {
    id: products[2].variants[1].id,
    name: products[2].name,
    price: products[2].variants[1].price,
    quantity: 2,
    image: products[2].variants[1].image,
    variant: products[2].variants[1].size,
    productId: products[2].id // Add productId for linking to product page
  }
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 576);
  // Use mock cart instead of redux state for demo
  const [cart, setCart] = useState({
    items: mockCartItems
  });
  const [isItemsListVisible, setIsItemsListVisible] = useState(!isMobile);
  const [isTotalsVisible, setIsTotalsVisible] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Format with MAD currency
  const formatMAD = (value) => formatPrice(value, 'MAD');

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = window.innerWidth <= 768;
      const smallMobileWidth = window.innerWidth <= 576;

      setIsMobile(mobileWidth);
      setIsSmallMobile(smallMobileWidth);

      // Only auto-collapse items list on initial mobile view
      if (!isItemsListVisible && !mobileWidth) {
        setIsItemsListVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isItemsListVisible]);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    differentShipping: false,
    shippingAddress: '',
    shippingMethod: 'free',
    paymentMethod: 'cashOnDelivery',
  });

  // Calculate shipping cost and tax
  const getShippingCost = () => {
    switch(formData.shippingMethod) {
      case 'express': return 15.00;
      case 'premium': return 48.00;
      case 'free':
      default: return 0.00;
    }
  };

  const shippingCost = getShippingCost();
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Step navigation functions
  const nextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 0) {
      // Go back to cart page
      navigate('/cart');
    } else {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle order placement
  const placeOrder = () => {
    // Here you would submit the order to your backend
    // For now we'll just simulate by generating an order number
    const orderNumber = `ORD-${Math.floor(Math.random() * 10000000)}`;

    // Move to the confirmation step
    window.scrollTo(0, 0);
    setCurrentStep(3);
  };

  // Handle item edit button click
  const handleEditItem = (itemId) => {
    console.log(`Edit item ${itemId}`);
    // Here you would implement the edit functionality
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Contact & Location
        return <ContactLocationForm formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
      case 1: // Payment & Shipping
        return <PaymentShippingForm formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
      case 2: // Recap
        return (
          <RecapForm
            formData={formData}
            cart={cart}
            shippingCost={shippingCost}
            tax={tax}
            placeOrder={placeOrder}
            prevStep={prevStep}
          />
        );
      case 3: // Confirmation
        return (
          <OrderConfirmation
            orderNumber={`ORD-${Math.floor(Math.random() * 10000000)}`}
            orderDate={new Date()}
            formData={formData}
            cart={cart}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            email={formData.email}
          />
        );
      default:
        return <ContactLocationForm formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
    }
  };

  // Add these functions for handling quantity changes
  const increaseQuantity = (itemId) => {
    const updatedItems = cart.items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    setCart({ items: updatedItems });
    // Recalculate totals will happen automatically on re-render
  };

  const decreaseQuantity = (itemId) => {
    const updatedItems = cart.items.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    setCart({ items: updatedItems });
    // Recalculate totals will happen automatically on re-render
  };

  // Toggle visibility of cart items list
  const toggleItemsList = () => {
    setIsItemsListVisible(!isItemsListVisible);
  };

  // Toggle visibility of totals section
  const toggleTotals = () => {
    setIsTotalsVisible(!isTotalsVisible);
  };

  // Determine total number of steps (needed for mobile nav)
  const totalSteps = 3; // Contact, Payment, Recap

  return (
    <div className="checkout-page">
      <div className="page-container">
        {currentStep < 3 ? (
          <div className="checkout-content">
            <div className="checkout-main">
              <div className="checkout-section">
                {renderStepContent()}
              </div>
            </div>
            <div className="checkout-sidebar">
              <div className="sidebar-content">
                <div className="cart-summary">
                  <div
                    className={`summary-header collapsible ${isItemsListVisible ? 'open' : 'closed'}`}
                    onClick={toggleItemsList}
                  >
                    <ShoppingBag size={isSmallMobile ? 16 : 20} weight="duotone" />
                    <h3>Votre Commande {cart.items.length > 0 && `(${cart.items.length})`}</h3>
                    <CaretDown
                      size={isSmallMobile ? 14 : 16}
                      className={`toggle-icon ${isItemsListVisible ? 'open' : 'closed'}`}
                    />
                  </div>

                  {isItemsListVisible && (
                    <div className="cart-items-list">
                      {cart.items.map((item, index) => (
                        <div className="cart-item" key={index}>
                          <div className="item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="item-content">
                            <div className="item-title">
                              <h4>{item.name}</h4>
                              <p className="item-variant">{item.variant}</p>
                            </div>
                            <div className="item-actions">
                              <div className="quantity-controls">
                                <button
                                  className="quantity-btn minus"
                                  onClick={() => decreaseQuantity(item.id)}
                                  disabled={item.quantity <= 1}
                                  aria-label="Diminuer la quantité"
                                >
                                  <Minus size={isSmallMobile ? 14 : 16} weight="bold" />
                                </button>
                                <span className="quantity">{item.quantity}</span>
                                <button
                                  className="quantity-btn plus"
                                  onClick={() => increaseQuantity(item.id)}
                                  aria-label="Augmenter la quantité"
                                >
                                  <Plus size={isSmallMobile ? 14 : 16} weight="bold" />
                                </button>
                              </div>
                              <div className="item-price">
                                {formatMAD(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`summary-totals-header collapsible ${isTotalsVisible ? 'open' : 'closed'}`}
                    onClick={toggleTotals}
                  >
                    <CurrencyCircleDollar size={isSmallMobile ? 16 : 20} weight="duotone" />
                    <h3>Totaux</h3>
                    <CaretDown
                      size={isSmallMobile ? 14 : 16}
                      className={`toggle-icon ${isTotalsVisible ? 'open' : 'closed'}`}
                    />
                  </div>

                  {isTotalsVisible && (
                    <div className="summary-totals">
                      <div className="summary-row">
                        <span>Sous-total</span>
                        <span>{formatMAD(subtotal)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Livraison</span>
                        <span>{shippingCost === 0 ? 'Gratuit' : formatMAD(shippingCost)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Taxes estimées</span>
                        <span>{formatMAD(tax)}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total</span>
                        <span>{formatMAD(total)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {currentStep === 1 && (
                  <div className="shipping-info-panel">
                    <h3>Informations de Livraison</h3>
                    <div className="info-row">
                      <Clock size={20} weight="duotone" />
                      <div>
                        <span>Délai de Livraison Estimé</span>
                        <p>
                          {formData.shippingMethod === 'free' && '7 à 10 jours'}
                          {formData.shippingMethod === 'express' && '3 à 5 jours'}
                          {formData.shippingMethod === 'premium' && '24 heures'}
                        </p>
                      </div>
                    </div>
                    <div className="info-row">
                      <Truck size={20} weight="duotone" />
                      <div>
                        <span>Méthode de Livraison</span>
                        <p>
                          {formData.shippingMethod === 'free' && 'Standard'}
                          {formData.shippingMethod === 'express' && 'Express'}
                          {formData.shippingMethod === 'premium' && 'Premium'}
                        </p>
                      </div>
                    </div>
                    <div className="info-row">
                      <CurrencyCircleDollar size={20} weight="duotone" />
                      <div>
                        <span>Frais de Livraison</span>
                        <p>
                          {formData.shippingMethod === 'free' && 'Gratuit'}
                          {formData.shippingMethod === 'express' && '15 MAD'}
                          {formData.shippingMethod === 'premium' && '48 MAD'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="checkout-content confirmation">
            {renderStepContent()}
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        {currentStep < 3 && (
          <MobileBottomNav
            currentStep={currentStep}
            totalSteps={totalSteps}
            prevStep={prevStep}
            nextStep={nextStep}
            placeOrder={placeOrder}
            cart={cart}
            subtotal={subtotal}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            formatMAD={formatMAD}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            formData={formData}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;