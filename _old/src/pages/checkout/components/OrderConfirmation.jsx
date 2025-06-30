import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Printer, CalendarBlank, CheckCircle, Receipt, HashStraight } from '@phosphor-icons/react';
import { products, formatPrice } from '../../../data/products';

// Mock cart items using real products
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

const OrderConfirmation = ({
  orderId = "ORD29875",
  orderDate = new Date(),
  cart = { items: mockCartItems },
  email = "client@example.com",
  shippingCost = 15.00,
  tax = 9.99,
  total = 157.27
}) => {
  const navigate = useNavigate();
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Format with MAD currency
  const formatMAD = (value) => formatPrice(value, 'MAD');

  const formattedDate = new Date(orderDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <div className="confirmation-icon">
          <CheckCircle size={48} weight="duotone" />
        </div>
        <h2>Commande Confirmée</h2>
        <p className="thank-you-message">
          Merci pour votre commande ! Un e-mail de confirmation a été envoyé à <strong>{email}</strong>.
        </p>
      </div>

      <div className="confirmation-body">
        <div className="order-confirmation">
          <div className="order-details">
            <div className="order-info-grid">
              <div className="order-info-item">
                <span className="order-info-label">
                  <HashStraight size={16} weight="duotone" />
                  Numéro de Commande
                </span>
                <span className="order-info-value">#{orderId}</span>
              </div>

              <div className="order-info-item">
                <span className="order-info-label">
                  <CalendarBlank size={16} weight="duotone" />
                  Date de Commande
                </span>
                <span className="order-info-value">{formattedDate}</span>
              </div>

              <div className="order-info-item">
                <span className="order-info-label">
                  <Receipt size={16} weight="duotone" />
                  Total
                </span>
                <span className="order-info-value">{formatMAD(total)}</span>
              </div>
            </div>
          </div>

          <div className="order-summary">
            <h3>Résumé de la Commande</h3>

            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <div className="item-meta">
                      <span className="item-variant">{item.variant}</span>
                      <div className="item-price-row">
                        <span className="item-quantity">Qté: {item.quantity}</span>
                        <span className="item-price">{formatMAD(item.price)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-total">
                    {formatMAD(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="totals-row">
                <span>Sous-total</span>
                <span>{formatMAD(subtotal)}</span>
              </div>
              <div className="totals-row">
                <span>Livraison</span>
                <span>{formatMAD(shippingCost)}</span>
              </div>
              <div className="totals-row">
                <span>Taxes</span>
                <span>{formatMAD(tax)}</span>
              </div>
              <div className="totals-row total">
                <span>Total</span>
                <span>{formatMAD(total)}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="btn-secondary" onClick={() => window.print()}>
              <Printer weight="duotone" /> Imprimer le Reçu
            </button>
            <button className="btn-primary" onClick={() => navigate('/shop')}>
              Continuer les Achats <ShoppingBag weight="duotone" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;