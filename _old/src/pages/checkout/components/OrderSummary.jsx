import React from 'react';
import { User, House, Truck, CreditCard } from '@phosphor-icons/react';
import { products, formatPrice } from '../../../data/products';

// Mock cart items using real products from products.js
const mockCartItems = [
  {
    id: products[0].variants[0].id,
    name: products[0].name,
    price: products[0].variants[0].price,
    quantity: 1,
    image: products[0].variants[0].image,
    variant: products[0].variants[0].size
  },
  {
    id: products[2].variants[1].id,
    name: products[2].name,
    price: products[2].variants[1].price,
    quantity: 2,
    image: products[2].variants[1].image,
    variant: products[2].variants[1].size
  }
];

// Default form data
const defaultFormData = {
  shippingMethod: 'standard',
  paymentMethod: 'creditCard'
};

const OrderSummary = ({
  cart = { items: mockCartItems },
  formData = defaultFormData,
  currentStep = 1,
  shippingCost = 15.00,
  tax = 9.99
}) => {
  // Calculate totals
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost + tax;

  // Format with MAD currency
  const formatMAD = (value) => formatPrice(value, 'MAD');

  return (
    <div className="order-summary">
      <div className="summary-header">
        <h3>Récapitulatif de Commande</h3>
      </div>

      {/* Show cart items */}
      <div className="cart-items-list">
        {cart.items.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h4>{item.name}</h4>
              <div className="item-variant">{item.variant}</div>
              <div className="item-price-qty">
                <span className="item-price">{formatMAD(item.price)}</span>
                <span>×</span>
                <span>{item.quantity}</span>
              </div>
            </div>
            <div className="item-total">
              {formatMAD(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="summary-totals">
        <div className="summary-row">
          <span>Sous-total</span>
          <span>{formatMAD(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Frais de livraison</span>
          <span>{formatMAD(shippingCost)}</span>
        </div>
        <div className="summary-row">
          <span>Taxes</span>
          <span>{formatMAD(tax)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatMAD(total)}</span>
        </div>
      </div>

      {currentStep >= 1 && (
        <div className="shipping-info-panel">
          <div className="info-row">
            <Truck size={18} weight="duotone" />
            <div>
              <span>Mode de livraison</span>
              <p>
                {formData.shippingMethod === 'standard' && 'Livraison Standard (3-5 jours)'}
                {formData.shippingMethod === 'express' && 'Livraison Express (1-2 jours)'}
                {formData.shippingMethod === 'sameDay' && 'Livraison le Jour Même'}
              </p>
            </div>
          </div>

          {currentStep >= 1 && formData.paymentMethod && (
            <div className="info-row">
              <CreditCard size={18} weight="duotone" />
              <div>
                <span>Moyen de paiement</span>
                <p>
                  {formData.paymentMethod === 'creditCard' && 'Carte de Crédit'}
                  {formData.paymentMethod === 'paypal' && 'PayPal'}
                  {formData.paymentMethod === 'bankTransfer' && 'Virement Bancaire'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;