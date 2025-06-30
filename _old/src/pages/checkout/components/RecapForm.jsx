import React from 'react';
import { CaretLeft, Tag, Truck, User, Envelope, Phone, House, MapPin, Clipboard, CurrencyCircleDollar, Check } from '@phosphor-icons/react';
import { formatPrice } from '../../../data/products';

const RecapForm = ({ formData, cart, shippingCost, tax, placeOrder, prevStep }) => {
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost + tax;

  // Format with MAD currency
  const formatMAD = (value) => formatPrice(value, 'MAD');

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder();
  };

  return (
    <div className="recap-form">
      <div className="checkout-section-header">
        <Clipboard size={22} weight="duotone" />
        <h2>Récapitulatif de Commande</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="recap-section">
          <h3>
            <User size={18} weight="duotone" />
            Informations Personnelles
          </h3>
          <div className="recap-info-grid">
            <div className="recap-info-row">
              <span className="info-label">Prénom</span>
              <span className="info-value">{formData.firstName}</span>
            </div>
            <div className="recap-info-row">
              <span className="info-label">Nom</span>
              <span className="info-value">{formData.lastName}</span>
            </div>
            <div className="recap-info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{formData.email}</span>
            </div>
            <div className="recap-info-row">
              <span className="info-label">Téléphone</span>
              <span className="info-value">{formData.phone}</span>
            </div>
          </div>
        </div>

        <div className="recap-section">
          <h3>
            <MapPin size={18} weight="duotone" />
            Adresse de Livraison
          </h3>
          <div className="recap-info-grid">
            <div className="recap-info-row">
              <span className="info-label">Pays</span>
              <span className="info-value">{formData.country}</span>
            </div>
            <div className="recap-info-row">
              <span className="info-label">Ville</span>
              <span className="info-value">{formData.city}</span>
            </div>
            <div className="recap-info-row">
              <span className="info-label">Adresse</span>
              <span className="info-value">{formData.address}</span>
            </div>
            {formData.differentShipping && (
              <div className="recap-info-row">
                <span className="info-label">Adresse de Livraison</span>
                <span className="info-value">{formData.shippingAddress}</span>
              </div>
            )}
          </div>
        </div>

        <div className="recap-section">
          <h3>
            <Truck size={18} weight="duotone" />
            Livraison & Paiement
          </h3>
          <div className="recap-info-grid">
            <div className="recap-info-row">
              <span className="info-label">Mode de Livraison</span>
              <span className="info-value">
                {formData.shippingMethod === 'free' && 'Standard (Gratuit)'}
                {formData.shippingMethod === 'express' && 'Express (15 MAD)'}
                {formData.shippingMethod === 'premium' && 'Premium (48 MAD)'}
              </span>
            </div>
            <div className="recap-info-row">
              <span className="info-label">Mode de Paiement</span>
              <span className="info-value">
                {formData.paymentMethod === 'cashOnDelivery' && 'Paiement à la Livraison'}
                {formData.paymentMethod === 'creditCard' && 'Carte de Crédit / Débit'}
                {formData.paymentMethod === 'bankTransfer' && 'Virement Bancaire'}
                {formData.paymentMethod === 'inStore' && 'Paiement en Magasin'}
              </span>
            </div>
          </div>
        </div>

        <div className="order-summary-compact">
          <h3>
            <CurrencyCircleDollar size={18} weight="duotone" />
            Résumé de la Commande
          </h3>
          <div className="summary-row">
            <span>Sous-total</span>
            <span className="price">{formatMAD(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Frais de livraison</span>
            <span className="price">{formatMAD(shippingCost)}</span>
          </div>
          <div className="summary-row">
            <span>Taxes</span>
            <span className="price">{formatMAD(tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="price">{formatMAD(total)}</span>
          </div>
        </div>

        <div className="checkout-actions">
          <button type="button" className="btn-secondary" onClick={prevStep}>
            <CaretLeft weight="duotone" />
            Retour
          </button>
          <button type="submit" className="btn-primary confirm-btn">
            <Check weight="duotone" />
            Confirmer la Commande
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecapForm;