import React, { useState } from 'react';
import { CaretLeft, CaretRight, CreditCard, Bank, Timer, Truck, Clock, CurrencyCircleDollar, CreditCard as CreditCardIcon, Money, Storefront, ShieldCheck, CheckCircle, QrCode, Info } from '@phosphor-icons/react';
import attijariwafalogo from '../../../assets/images/banks/Logo_AWB.svg';
import bmceLogo from '../../../assets/images/banks/bmce.png';
import cihLogo from '../../../assets/images/banks/Cih-bank.png';
import attijariwaQr from '../../../assets/images/qr-codes/attijariwafa-qr.svg';
import bmceQr from '../../../assets/images/qr-codes/bmce-qr.svg';
import cihQr from '../../../assets/images/qr-codes/cih-qr.svg';

const PaymentShippingForm = ({ formData, handleChange, nextStep, prevStep }) => {
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [selectedBank, setSelectedBank] = useState('');

  // Sample bank information
  const banks = [
    {
      id: 'attijariwafa',
      name: 'Attijariwafa Bank',
      accountNumber: 'MA123456789012345678901234',
      iban: 'MA01234567890123456789012345',
      swift: 'BCMAMAMCXXX',
      qrCode: attijariwaQr,
      logo: attijariwafalogo
    },
    {
      id: 'bmce',
      name: 'BMCE Bank',
      accountNumber: 'MA987654321098765432109876',
      iban: 'MA09876543210987654321098765',
      swift: 'BMCEMAMC',
      qrCode: bmceQr,
      logo: bmceLogo
    },
    {
      id: 'cih',
      name: 'CIH Bank',
      accountNumber: 'MA567890123456789012345678',
      iban: 'MA05678901234567890123456789',
      swift: 'CIHMAMC',
      qrCode: cihQr,
      logo: cihLogo
    }
  ];

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCardInfo({
      ...creditCardInfo,
      [name]: value
    });
  };

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="payment-shipping-form">
      <div className="checkout-section-header">
        <CreditCard size={22} weight="duotone" />
        <h2>Payment & Shipping</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="options-section">
          <div className="shipping-options">
            <h3>
              <Truck size={18} weight="duotone" />
              Mode de Livraison
            </h3>

            <div className="options-row">
              <div className="shipping-option">
                <input
                  type="radio"
                  id="free"
                  name="shippingMethod"
                  value="free"
                  checked={formData.shippingMethod === 'free'}
                  onChange={handleChange}
                />
                <label htmlFor="free">
                  <div className="option-info">
                    <span className="option-name">Gratuit</span>
                    <span className="option-description">5-7 jours ouvrables</span>
                  </div>
                  <span className="option-price">0 MAD</span>
                </label>
              </div>

              <div className="shipping-option">
                <input
                  type="radio"
                  id="express"
                  name="shippingMethod"
                  value="express"
                  checked={formData.shippingMethod === 'express'}
                  onChange={handleChange}
                />
                <label htmlFor="express">
                  <div className="option-info">
                    <span className="option-name">Express</span>
                    <span className="option-description">2-3 jours ouvrables</span>
                  </div>
                  <span className="option-price">15 MAD</span>
                </label>
              </div>

              <div className="shipping-option">
                <input
                  type="radio"
                  id="premium"
                  name="shippingMethod"
                  value="premium"
                  checked={formData.shippingMethod === 'premium'}
                  onChange={handleChange}
                />
                <label htmlFor="premium">
                  <div className="option-info">
                    <span className="option-name">Premium</span>
                    <span className="option-description">Livraison le lendemain</span>
                  </div>
                  <span className="option-price">48 MAD</span>
                </label>
              </div>
            </div>
          </div>

          <div className="payment-options">
            <h3>
              <CreditCardIcon size={18} weight="duotone" />
              Mode de Paiement
            </h3>

            <div className="options-row payment-row">
              <div className="payment-option">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  checked={formData.paymentMethod === 'cashOnDelivery'}
                  onChange={handleChange}
                />
                <label htmlFor="cashOnDelivery">
                  <div className="option-info">
                    <span className="option-name">Paiement à la Livraison</span>
                    <span className="option-description">Payez en espèces à la réception</span>
                  </div>
                  <Money size={24} weight="duotone" />
                </label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  checked={formData.paymentMethod === 'creditCard'}
                  onChange={handleChange}
                />
                <label htmlFor="creditCard">
                  <div className="option-info">
                    <span className="option-name">Carte de Crédit</span>
                    <span className="option-description">Visa, Mastercard, Amex</span>
                  </div>
                  <CreditCardIcon size={24} weight="duotone" />
                </label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="bankTransfer"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={formData.paymentMethod === 'bankTransfer'}
                  onChange={handleChange}
                />
                <label htmlFor="bankTransfer">
                  <div className="option-info">
                    <span className="option-name">Virement Bancaire</span>
                    <span className="option-description">Paiement direct</span>
                  </div>
                  <Bank size={24} weight="duotone" />
                </label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="inStore"
                  name="paymentMethod"
                  value="inStore"
                  checked={formData.paymentMethod === 'inStore'}
                  onChange={handleChange}
                />
                <label htmlFor="inStore">
                  <div className="option-info">
                    <span className="option-name">En Magasin</span>
                    <span className="option-description">Au retrait</span>
                  </div>
                  <Storefront size={24} weight="duotone" />
                </label>
              </div>
            </div>
          </div>

          {formData.paymentMethod === 'creditCard' && (
            <div className="payment-details credit-card-details">
              <h3>
                <CreditCardIcon size={18} weight="duotone" />
                Détails de la Carte
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardNumber">Numéro de Carte</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={creditCardInfo.cardNumber}
                    onChange={handleCreditCardChange}
                    maxLength="19"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardHolder">Titulaire de la Carte</label>
                  <input
                    type="text"
                    id="cardHolder"
                    name="cardHolder"
                    placeholder="PRÉNOM NOM"
                    value={creditCardInfo.cardHolder}
                    onChange={handleCreditCardChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Date d'Expiration</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={creditCardInfo.expiryDate}
                    onChange={handleCreditCardChange}
                    maxLength="5"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={creditCardInfo.cvv}
                    onChange={handleCreditCardChange}
                    maxLength="4"
                  />
                </div>
              </div>

              <div className="card-security-notice">
                <ShieldCheck size={18} weight="duotone" />
                <p>Toutes les informations de votre carte sont cryptées et sécurisées.</p>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'bankTransfer' && (
            <div className="payment-details bank-transfer-details">
              <h3>
                <Bank size={18} weight="duotone" />
                Détails du Virement Bancaire
              </h3>

              <div className="form-group">
                <label htmlFor="bankSelection">Sélectionnez votre banque</label>
                <select
                  id="bankSelection"
                  name="bankSelection"
                  value={selectedBank}
                  onChange={handleBankChange}
                >
                  <option value="">Choisissez une banque</option>
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
              </div>

              {selectedBank && (
                <div className="bank-info">
                  {banks.filter(bank => bank.id === selectedBank).map(bank => (
                    <div key={bank.id} className="bank-details">
                      <div className="bank-account-info">
                        <div className="bank-logo">
                          <img src={bank.logo} alt={`Logo ${bank.name}`} />
                        </div>
                        <div className="info-row">
                          <span className="info-label">Banque:</span>
                          <span className="info-value">{bank.name}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Numéro de Compte:</span>
                          <span className="info-value">{bank.accountNumber}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">IBAN:</span>
                          <span className="info-value">{bank.iban}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">SWIFT/BIC:</span>
                          <span className="info-value">{bank.swift}</span>
                        </div>
                      </div>

                      <div className="bank-qr-code">
                        <div className="qr-wrapper">
                          <img src={bank.qrCode} alt={`QR Code pour ${bank.name}`} />
                        </div>
                        <div className="qr-title">
                          <QrCode size={16} weight="duotone" />
                          <span>Code QR de Paiement</span>
                        </div>
                        <p>Scannez ce QR code avec l'application de votre banque pour effectuer le virement facilement.</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bank-transfer-notice">
                <Info size={18} weight="duotone" />
                <p>Après avoir effectué le virement, votre commande sera traitée dès réception du paiement.</p>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-actions">
          <button type="button" className="btn-secondary" onClick={prevStep}>
            <CaretLeft weight="duotone" />
            Retour
          </button>
          <button type="submit" className="btn-primary">
            Suivant
            <CaretRight weight="duotone" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentShippingForm;