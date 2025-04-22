import React, { useState, useEffect } from 'react';
import Modal from '../ui/modal/Modal';
import ModalNavSidebar from './ModalNavSidebar';
import { CreditCard, Plus, Bank, Trash, CheckCircle } from '@phosphor-icons/react';
import './profile-modals.scss';

// Sample payment method data for demonstration
const SAMPLE_PAYMENT_METHODS = [
  {
    id: 'pm_1',
    type: 'credit_card',
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'credit_card',
    brand: 'Mastercard',
    last4: '8888',
    expMonth: 8,
    expYear: 2024,
    isDefault: false
  }
];

const PaymentModal = ({ isOpen, onClose, initialSection = 'payment' }) => {
  const [paymentMethods, setPaymentMethods] = useState(SAMPLE_PAYMENT_METHODS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && showAddForm) {
      setShowAddForm(false);
    }
  }, [isOpen, showAddForm]);

  const handleSectionChange = (section) => {
    // If we need to navigate to other modals entirely
    if (section !== 'payment' && onClose) {
      onClose(section);
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!newCard.cardNumber) newErrors.cardNumber = 'Le numéro de carte est requis';
    if (!newCard.cardName) newErrors.cardName = 'Le nom du titulaire est requis';
    if (!newCard.expMonth) newErrors.expMonth = 'Le mois d\'expiration est requis';
    if (!newCard.expYear) newErrors.expYear = 'L\'année d\'expiration est requise';
    if (!newCard.cvv) newErrors.cvv = 'Le code de sécurité est requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, you would send this to an API
    // For demo, we'll just add a mock card
    const mockNewCard = {
      id: `pm_${Math.random().toString(36).substring(2, 9)}`,
      type: 'credit_card',
      brand: 'Visa', // We'd determine this from the card number in a real app
      last4: newCard.cardNumber.slice(-4),
      expMonth: parseInt(newCard.expMonth),
      expYear: parseInt(newCard.expYear),
      isDefault: paymentMethods.length === 0 // Make default if it's the first card
    };

    setPaymentMethods([...paymentMethods, mockNewCard]);
    setShowAddForm(false);
    setNewCard({
      cardNumber: '',
      cardName: '',
      expMonth: '',
      expYear: '',
      cvv: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({
      ...newCard,
      [name]: value
    });

    // Clear error when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleDeleteCard = (id) => {
    // In a real app, you would call an API
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefault = (id) => {
    // In a real app, you would call an API
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const getCardIcon = (brand) => {
    // In a real app, you might use different icons per brand
    return <CreditCard size={20} weight="duotone" />;
  };

  // Render payment content
  const renderPaymentContent = () => {
    return (
      <div className="payment-modal">
        {showAddForm ? (
          <div className="add-payment-form">
            <h4>Ajouter une nouvelle carte</h4>
            <form onSubmit={handleAddCard}>
              <div className="form-group">
                <label htmlFor="cardNumber">Numéro de carte</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={handleInputChange}
                  className={errors.cardNumber ? 'error' : ''}
                  maxLength={19}
                />
                {errors.cardNumber && <div className="error-text">{errors.cardNumber}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="cardName">Nom du titulaire</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="Jean Dupont"
                  value={newCard.cardName}
                  onChange={handleInputChange}
                  className={errors.cardName ? 'error' : ''}
                />
                {errors.cardName && <div className="error-text">{errors.cardName}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expMonth">Mois d'expiration</label>
                  <select
                    id="expMonth"
                    name="expMonth"
                    value={newCard.expMonth}
                    onChange={handleInputChange}
                    className={errors.expMonth ? 'error' : ''}
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                    ))}
                  </select>
                  {errors.expMonth && <div className="error-text">{errors.expMonth}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="expYear">Année d'expiration</label>
                  <select
                    id="expYear"
                    name="expYear"
                    value={newCard.expYear}
                    onChange={handleInputChange}
                    className={errors.expYear ? 'error' : ''}
                  >
                    <option value="">AAAA</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                  {errors.expYear && <div className="error-text">{errors.expYear}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={handleInputChange}
                    className={errors.cvv ? 'error' : ''}
                    maxLength={4}
                  />
                  {errors.cvv && <div className="error-text">{errors.cvv}</div>}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Ajouter la carte
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="payment-methods-list">
              {paymentMethods.length === 0 ? (
                <div className="no-payment-methods">
                  <Bank size={48} weight="duotone" />
                  <p>Vous n'avez pas encore ajouté de moyen de paiement.</p>
                </div>
              ) : (
                paymentMethods.map(method => (
                  <div key={method.id} className="payment-method-card">
                    <div className="payment-method-info">
                      <div className="card-icon">
                        {getCardIcon(method.brand)}
                      </div>
                      <div className="card-details">
                        <div className="card-brand">
                          {method.brand} •••• {method.last4}
                          {method.isDefault && (
                            <span className="default-badge">
                              <CheckCircle size={12} weight="fill" />
                              Par défaut
                            </span>
                          )}
                        </div>
                        <div className="card-expiry">
                          Expire le {String(method.expMonth).padStart(2, '0')}/{method.expYear}
                        </div>
                      </div>
                    </div>
                    <div className="payment-method-actions">
                      {!method.isDefault && (
                        <button
                          className="set-default-btn"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Définir par défaut
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCard(method.id)}
                      >
                        <Trash size={18} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="add-payment-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Ajouter un moyen de paiement
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mon Compte"
      sidebar={<ModalNavSidebar activeSection="payment" onSectionChange={handleSectionChange} />}
    >
      {renderPaymentContent()}
    </Modal>
  );
};

export default PaymentModal;