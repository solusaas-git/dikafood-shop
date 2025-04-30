import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  CaretDown,
  Package,
  ShoppingBagOpen
} from '@phosphor-icons/react';
import './cart-dropdown.scss';

// Import actions
import { removeFromCart, updateQuantity } from '../../../store/actions/cartActions';

const CartDropdown = ({ onClose, isMobile = false, isNavbarMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (onClose && isOpen) {
      onClose();
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity, currentQuantity) => {
    const newQuantity = currentQuantity + quantity;
    if (newQuantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity(id, newQuantity));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const checkImageExists = (url) => {
    return url && url.trim() !== '';
  };

  return (
    <div className={`cart-dropdown ${isMobile ? 'mobile' : ''}`} ref={dropdownRef}>
      <button
        className={`dropdown-trigger ${isOpen ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="cart-icon">
          <ShoppingCart weight="duotone" size={isMobile ? 20 : 20} />
          {getCartCount() > 0 && (
            <span className="cart-count">{getCartCount()}</span>
          )}
        </span>
        {!isMobile && <span className="btn-text">Panier</span>}
        {(!isMobile || isNavbarMobile) && (
          <CaretDown
            weight="bold"
            className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
            size={isMobile ? 14 : 14}
          />
        )}
      </button>

      {isOpen && (
        <div className={`dropdown-container ${isMobile ? 'mobile' : ''} ${isNavbarMobile ? 'navbar-mobile' : ''}`}>
          <div className="cart-dropdown-content">
            <div className="dropdown-header">
              <h3>Mon Panier ({getCartCount()} articles)</h3>
              <button className="close-button" onClick={toggleDropdown} aria-label="Fermer le panier">
                <X size={18} weight="bold" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  <ShoppingCart size={isMobile ? 40 : 48} weight="duotone" />
                </div>
                <p>Votre panier est vide</p>
                <Link to="/shop" className="shop-link" onClick={toggleDropdown}>
                  Commencer vos achats
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className={`item-image ${!checkImageExists(item.image) ? 'no-image' : ''}`}>
                        {checkImageExists(item.image) ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <Package weight="duotone" size={isMobile ? 20 : 24} />
                        )}
                      </div>
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">{formatCurrency(item.price)}</span>
                        <div className="item-quantity">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={isMobile ? 12 : 14} weight="bold" />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={isMobile ? 12 : 14} weight="bold" />
                          </button>
                        </div>
                      </div>
                      <button
                        className="remove-item"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Retirer l'article"
                      >
                        <X size={isMobile ? 14 : 16} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="subtotal">
                    <span>Sous-total:</span>
                    <span className="amount">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="cart-actions">
                    <Link to="/shop" className="continue-shopping" onClick={toggleDropdown}>
                      Continuer
                    </Link>
                    <Link to="/checkout" className="checkout-button" onClick={toggleDropdown}>
                      <ShoppingBagOpen weight="duotone" size={isMobile ? 18 : 20} />
                      Commander
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;