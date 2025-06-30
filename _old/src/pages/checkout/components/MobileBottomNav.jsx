import React, { useState, useEffect } from 'react';
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ArrowRight, ShoppingBagOpen, CaretDown, ShoppingBag, CurrencyCircleDollar, Plus, Minus, Clock, Truck, ShoppingCartSimple, X } from '@phosphor-icons/react';

const MobileBottomNav = ({
  currentStep,
  totalSteps,
  prevStep,
  nextStep,
  placeOrder,
  cart,
  subtotal,
  shippingCost,
  tax,
  total,
  formatMAD,
  increaseQuantity,
  decreaseQuantity,
  formData
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isItemsListVisible, setIsItemsListVisible] = useState(true);
  const [isTotalsVisible, setIsTotalsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  const steps = [
    { name: 'Contact', icon: <MapPin size={20} weight="duotone" /> },
    { name: 'Paiement', icon: <CreditCard size={20} weight="duotone" /> },
    { name: 'Récap', icon: <CheckCircle size={20} weight="duotone" /> }
  ];

  const isRecapStep = currentStep === 2;
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  // Check if we're on desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);

      // Auto-close sidebar on desktop transition
      if (window.innerWidth >= 992 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleItemsList = () => {
    setIsItemsListVisible(!isItemsListVisible);
  };

  const toggleTotals = () => {
    setIsTotalsVisible(!isTotalsVisible);
  };

  // Prevent background scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen, isDesktop]);

  // Handle escape key press to close sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {!isDesktop && (
        <div
          className={`mobile-sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`}
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      <div className="mobile-bottom-nav">
        <div className="mobile-steps-container">
          <div className="mobile-nav-actions">
            <button
              className="nav-btn btn-back"
              onClick={prevStep}
              disabled={currentStep === 0}
              aria-label="Étape précédente"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
          </div>

          <div className="mobile-steps">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const stepClassName = `mobile-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;

              return (
                <div className={stepClassName} key={index}>
                  <div className="step-icon">
                    {isCompleted ? <CheckCircle size={20} weight="duotone" /> : step.icon}
                  </div>
                  <span className="step-label">{step.name}</span>
                </div>
              );
            })}
          </div>

          <div className="mobile-nav-actions">
            {isRecapStep ? (
              <button
                className="nav-btn btn-order"
                onClick={placeOrder}
                aria-label="Passer commande"
              >
                <ShoppingBagOpen size={20} weight="bold" />
              </button>
            ) : (
              <button
                className="nav-btn btn-next"
                onClick={nextStep}
                disabled={currentStep === totalSteps - 1}
                aria-label="Étape suivante"
              >
                <ArrowRight size={20} weight="bold" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer toggle button with close button */}
        <div
          className={`toggle-drawer ${isSidebarOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Masquer le récapitulatif" : "Voir le récapitulatif"}
          aria-expanded={isSidebarOpen}
        >
          <div className={`drawer-icon ${isSidebarOpen ? 'open' : ''}`}>
            <CaretDown size={16} weight="bold" />
            {!isSidebarOpen && (
              <span className="cart-count">Détails de la commande ({itemCount})</span>
            )}
          </div>

          {isSidebarOpen && (
            <button
              className="drawer-close"
              onClick={(e) => {
                e.stopPropagation();
                closeSidebar();
              }}
              aria-label="Fermer le récapitulatif"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Sidebar Content */}
      <div className={`mobile-sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-scroll">
          <div className="mobile-sidebar-content">
            <div className="cart-summary">
              <div
                className={`summary-header collapsible ${isItemsListVisible ? 'open' : 'closed'}`}
                onClick={toggleItemsList}
              >
                <ShoppingBag size={16} weight="duotone" />
                <h3>Votre Commande {cart.items.length > 0 && `(${cart.items.length})`}</h3>
                <CaretDown
                  size={14}
                  className={`toggle-icon ${isItemsListVisible ? 'open' : 'closed'}`}
                />
              </div>

              {isItemsListVisible && (
                <div className="cart-items-list">
                  {cart.items.length > 0 ? (
                    cart.items.map((item, index) => (
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
                                <Minus size={14} weight="bold" />
                              </button>
                              <span className="quantity">{item.quantity}</span>
                              <button
                                className="quantity-btn plus"
                                onClick={() => increaseQuantity(item.id)}
                                aria-label="Augmenter la quantité"
                              >
                                <Plus size={14} weight="bold" />
                              </button>
                            </div>
                            <div className="item-price">
                              {formatMAD(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-cart-message">
                      Votre panier est vide
                    </div>
                  )}
                </div>
              )}

              <div
                className={`summary-totals-header collapsible ${isTotalsVisible ? 'open' : 'closed'}`}
                onClick={toggleTotals}
              >
                <CurrencyCircleDollar size={16} weight="duotone" />
                <h3>Totaux</h3>
                <CaretDown
                  size={14}
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
    </>
  );
};

export default MobileBottomNav;