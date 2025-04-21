import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingCart,
  ArrowLeft,
  Trash,
  CaretRight,
  CreditCard,
  Bank,
  Money,
  Truck,
  ClockClockwise,
  Shield,
  CheckCircle,
  Tag
} from "@phosphor-icons/react";
import './checkout.scss';
import NavBar from '../../sections/shared/navbar/NavBar';

const Checkout = () => {
  // Mock cart data - in a real app this would come from a cart context or redux store
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Huile d'Olive Extra Vierge",
      variant: "500ml",
      price: 149,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2561&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Miel de Thym",
      variant: "250g",
      price: 89,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=3087&auto=format&fit=crop"
    }
  ]);

  const [step, setStep] = useState('cart'); // cart, shipping, payment, confirmation
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(30);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Form state for shipping details
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Morocco'
  });

  // Calculate subtotal whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cartItems]);

  // Calculate total
  const total = subtotal + shippingCost - discount;

  // Handle quantity change
  const handleQuantityChange = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Toggle promo code visibility
  const togglePromoCode = () => {
    setShowPromoCode(!showPromoCode);
    if (!showPromoCode) {
      // Reset promo code and discount when hiding the field
      setPromoCode('');
      setDiscount(0);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    // Mock promo code functionality
    if (promoCode.toUpperCase() === 'WELCOME10') {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      alert('Promo code applied successfully!');
    } else {
      alert('Invalid promo code');
    }
  };

  // Handle shipping form change
  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 'cart') {
      setStep('shipping');
    } else if (step === 'shipping') {
      // Validate shipping form
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
      const missingFields = requiredFields.filter(field => !shippingDetails[field]);

      if (missingFields.length > 0) {
        alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
        return;
      }

      setStep('payment');
    } else if (step === 'payment') {
      // Simulate payment processing
      // In a real app, this would call a payment API
      setTimeout(() => {
        setStep('confirmation');
      }, 1500);
    }
  };

  // Render the cart items
  const renderCartItems = () => (
    <div className="cart-items">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart size={64} weight="duotone" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/shop" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      ) : (
        cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-variant">{item.variant}</p>
              <div className="item-price">{item.price} Dh</div>
            </div>
            <div className="item-quantity">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.id, -1)}
                disabled={item.quantity <= 1}
              >-</button>
              <span className="quantity">{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.id, 1)}
              >+</button>
            </div>
            <div className="item-total">
              {item.price * item.quantity} Dh
            </div>
            <button className="remove-btn" onClick={() => removeItem(item.id)}>
              <Trash weight="duotone" />
            </button>
          </div>
        ))
      )}
    </div>
  );

  // Render the cart summary
  const renderCartSummary = () => (
    <div className="cart-summary">
      <h2 className="summary-title">Order Summary</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{subtotal} Dh</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>{shippingCost} Dh</span>
      </div>
      {discount > 0 && (
        <div className="summary-row discount">
          <span>Discount</span>
          <span>-{discount.toFixed(2)} Dh</span>
        </div>
      )}
      <div className="summary-row total">
        <span>Total</span>
        <span>{total.toFixed(2)} Dh</span>
      </div>

      {step === 'cart' && (
        <div className="promo-section">
          <div className="promo-toggle">
            <label className="promo-checkbox">
              <input
                type="checkbox"
                checked={showPromoCode}
                onChange={togglePromoCode}
              />
              <span className="checkmark"></span>
              <span className="toggle-label">
                <Tag weight="duotone" />
                I have a promo code
              </span>
            </label>
          </div>

          {showPromoCode && (
            <div className="promo-code">
              <div className="promo-input">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  className="apply-btn"
                  onClick={applyPromoCode}
                  disabled={!promoCode}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {cartItems.length > 0 && (
        <button
          className="checkout-btn"
          onClick={handleSubmit}
          disabled={cartItems.length === 0}
        >
          {step === 'cart' && 'Proceed to Checkout'}
          {step === 'shipping' && 'Continue to Payment'}
          {step === 'payment' && 'Place Order'}
          <CaretRight weight="duotone" />
        </button>
      )}

      {step !== 'cart' && (
        <button
          className="back-btn"
          onClick={() => step === 'shipping' ? setStep('cart') : step === 'payment' ? setStep('shipping') : null}
        >
          <ArrowLeft weight="duotone" />
          Back to {step === 'shipping' ? 'Cart' : step === 'payment' ? 'Shipping' : ''}
        </button>
      )}

      <div className="secure-checkout">
        <Shield weight="duotone" />
        <span>Secure Checkout</span>
      </div>
    </div>
  );

  // Render shipping form
  const renderShippingForm = () => (
    <div className="shipping-form">
      <h2>Shipping Information</h2>
      <form>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={shippingDetails.firstName}
              onChange={handleShippingInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={shippingDetails.lastName}
              onChange={handleShippingInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={shippingDetails.email}
              onChange={handleShippingInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingDetails.phone}
              onChange={handleShippingInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address*</label>
          <input
            type="text"
            id="address"
            name="address"
            value={shippingDetails.address}
            onChange={handleShippingInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingDetails.city}
              onChange={handleShippingInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={shippingDetails.zipCode}
              onChange={handleShippingInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="country">Country*</label>
          <select
            id="country"
            name="country"
            value={shippingDetails.country}
            onChange={handleShippingInputChange}
            required
          >
            <option value="Morocco">Morocco</option>
            <option value="Algeria">Algeria</option>
            <option value="Tunisia">Tunisia</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
          </select>
        </div>

        <div className="shipping-options">
          <h3>Shipping Method</h3>
          <div className="shipping-option">
            <input
              type="radio"
              id="standard"
              name="shippingMethod"
              checked
              readOnly
            />
            <label htmlFor="standard">
              <div className="option-details">
                <div className="option-name">
                  <Truck weight="duotone" />
                  Standard Shipping
                </div>
                <div className="option-description">Delivery in 3-5 business days</div>
              </div>
              <div className="option-price">30 Dh</div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );

  // Render payment form
  const renderPaymentForm = () => (
    <div className="payment-form">
      <h2>Payment Method</h2>

      <div className="payment-options">
        <div className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          <label htmlFor="card">
            <CreditCard weight="duotone" />
            Credit/Debit Card
          </label>
        </div>

        <div className={`payment-option ${paymentMethod === 'bank' ? 'active' : ''}`}>
          <input
            type="radio"
            id="bank"
            name="paymentMethod"
            checked={paymentMethod === 'bank'}
            onChange={() => setPaymentMethod('bank')}
          />
          <label htmlFor="bank">
            <Bank weight="duotone" />
            Bank Transfer
          </label>
        </div>

        <div className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
          <input
            type="radio"
            id="cash"
            name="paymentMethod"
            checked={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
          />
          <label htmlFor="cash">
            <Money weight="duotone" />
            Cash on Delivery
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="card-details">
          <div className="form-group">
            <label htmlFor="cardName">Cardholder Name</label>
            <input type="text" id="cardName" name="cardName" placeholder="Name on card" />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input type="text" id="cvv" name="cvv" placeholder="123" />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'bank' && (
        <div className="bank-details">
          <div className="bank-info">
            <h3>Bank Transfer Details</h3>
            <p>Please transfer the total amount to the following bank account:</p>
            <div className="account-details">
              <div className="detail-row">
                <span className="label">Bank:</span>
                <span className="value">Bank Al-Maghrib</span>
              </div>
              <div className="detail-row">
                <span className="label">Account Name:</span>
                <span className="value">DikaFood SARL</span>
              </div>
              <div className="detail-row">
                <span className="label">Account Number:</span>
                <span className="value">123456789012345</span>
              </div>
              <div className="detail-row">
                <span className="label">IBAN:</span>
                <span className="value">MA123456789012345678901234</span>
              </div>
              <div className="detail-row">
                <span className="label">Reference:</span>
                <span className="value">ORDER-{Date.now().toString().slice(-8)}</span>
              </div>
            </div>
            <p className="note">Your order will be processed once the payment is confirmed.</p>
          </div>
        </div>
      )}

      {paymentMethod === 'cash' && (
        <div className="cash-details">
          <div className="cash-info">
            <p>You will pay the delivery person when your order arrives. An additional fee of 10 Dh will be applied.</p>
          </div>
        </div>
      )}
    </div>
  );

  // Render order confirmation
  const renderOrderConfirmation = () => (
    <div className="order-confirmation">
      <div className="confirmation-icon">
        <div className="check-icon">
          <CheckCircle size={48} weight="duotone" />
        </div>
      </div>
      <h2>Thank You For Your Order!</h2>
      <p className="order-id">Order #ORD-{Date.now().toString().slice(-8)}</p>
      <p className="confirmation-message">
        Your order has been received and is now being processed.
        You will receive a confirmation email shortly.
      </p>

      <div className="order-details">
        <h3>Order Details</h3>

        <div className="detail-row">
          <span className="label">Order Date:</span>
          <span className="value">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="detail-row">
          <span className="label">Payment Method:</span>
          <span className="value">
            {paymentMethod === 'card' ? 'Credit/Debit Card' :
             paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Shipping Address:</span>
          <span className="value">
            {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.country}
          </span>
        </div>

        <div className="detail-row total">
          <span className="label">Total:</span>
          <span className="value">{total.toFixed(2)} Dh</span>
        </div>
      </div>

      <div className="shipping-estimate">
        <ClockClockwise weight="duotone" />
        <span>Estimated delivery: 3-5 business days</span>
      </div>

      <div className="confirmation-buttons">
        <Link to="/shop" className="continue-shopping">
          Continue Shopping
        </Link>
        <Link to="/" className="back-home">
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`checkout-page ${step}-step`}>
      <Helmet>
        <title>{step === 'confirmation' ? 'Order Confirmation' : 'Checkout'} | DikaFood</title>
      </Helmet>

      <NavBar />

      <div className="checkout-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Checkout</h1>
            <p>Complete your purchase with our secure checkout process</p>
          </div>
        </div>
      </div>

      <div className="container">
        {step !== 'confirmation' && (
          <div className="checkout-header">
            <h1>
              {step === 'cart' && 'Shopping Cart'}
              {step === 'shipping' && 'Shipping Information'}
              {step === 'payment' && 'Payment Method'}
            </h1>

            <div className="checkout-steps">
              <div className={`step ${step === 'cart' ? 'active' : step === 'shipping' || step === 'payment' ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <span className="step-name">Cart</span>
              </div>
              <div className="step-divider"></div>
              <div className={`step ${step === 'shipping' ? 'active' : step === 'payment' ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <span className="step-name">Shipping</span>
              </div>
              <div className="step-divider"></div>
              <div className={`step ${step === 'payment' ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span className="step-name">Payment</span>
              </div>
            </div>
          </div>
        )}

        <div className="checkout-content">
          {step === 'cart' && (
            <div className="cart-container">
              {renderCartItems()}
            </div>
          )}

          {step === 'shipping' && (
            <div className="shipping-container">
              {renderShippingForm()}
            </div>
          )}

          {step === 'payment' && (
            <div className="payment-container">
              {renderPaymentForm()}
            </div>
          )}

          {step === 'confirmation' && (
            <div className="confirmation-container">
              {renderOrderConfirmation()}
            </div>
          )}

          {step !== 'confirmation' && (
            <div className="summary-container">
              {renderCartSummary()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;