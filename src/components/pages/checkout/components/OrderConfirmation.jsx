import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Printer, CalendarBlank, CheckCircle, Receipt, CurrencyCircleDollar } from '@phosphor-icons/react';
import ContentContainer from '../../../ui/layout/ContentContainer';

const OrderConfirmation = ({
  orderNumber,
  orderDate,
  formData,
  cart,
  shippingCost,
  tax,
  total,
  email
}) => {
  const navigate = useNavigate();
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Format with MAD currency
  const formatMAD = (value) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(value);
  };

  // Format date display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  // Define order summary header content with icon
  const orderHeaderContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <CheckCircle size={18} weight="duotone" className="text-logo-lime" />
      </div>
      <span>Résumé de la Commande</span>
    </div>
  );

  // Define totals header content with icon
  const totalsHeaderContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <CurrencyCircleDollar size={18} weight="duotone" className="text-logo-lime" />
      </div>
      <span>Totaux</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Confirmation Header */}
      <div className="flex flex-col items-center py-10 px-4 bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-b border-amber-100">
        <div className="w-16 h-16 flex items-center justify-center bg-logo-lime/10 text-logo-lime rounded-full mb-4">
          <CheckCircle size={40} weight="duotone" />
        </div>
        <h2 className="text-2xl font-medium text-logo-brown mb-2">Commande Confirmée</h2>
        <p className="text-center text-gray-600 max-w-lg">
          Merci pour votre commande ! Un e-mail de confirmation a été envoyé à <strong className="text-gray-800">{email}</strong>.
        </p>
      </div>

      <div className="p-6 md:p-8">
        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-b border-amber-100 pb-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <HashStraight size={16} weight="duotone" className="text-logo-lime" />
              <span className="text-sm">Numéro de Commande</span>
            </div>
            <p className="font-medium text-lg text-logo-brown">#{orderNumber}</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <CalendarBlank size={16} weight="duotone" className="text-logo-lime" />
              <span className="text-sm">Date de Commande</span>
            </div>
            <p className="font-medium text-lg text-logo-brown">{formatDate(orderDate)}</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <Receipt size={16} weight="duotone" className="text-logo-lime" />
              <span className="text-sm">Total</span>
            </div>
            <p className="font-medium text-lg text-logo-brown">{formatMAD(total)}</p>
          </div>
        </div>

        {/* Order Items */}
        <ContentContainer
          title={orderHeaderContent}
          headerVariant="default"
          className="mb-8"
          bodyClassName="p-4"
        >
          <div className="divide-y divide-amber-100">
            {cart.items.map((item) => (
              <div key={item.id} className="flex py-4 first:pt-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 ml-4">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <div className="flex justify-between mt-2">
                    <div className="text-gray-500 text-sm">
                      <span className="block text-xs">{item.variant}</span>
                      <span>Qté: {item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{formatMAD(item.price)} × {item.quantity}</div>
                      <div className="font-medium text-logo-brown">{formatMAD(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentContainer>

        {/* Order Totals */}
        <ContentContainer
          title={totalsHeaderContent}
          headerVariant="default"
          className="mb-8"
          bodyClassName="p-4 bg-amber-50/30"
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{formatMAD(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium">{formatMAD(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes</span>
              <span className="font-medium">{formatMAD(tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-amber-100">
              <span className="font-semibold text-logo-brown">Total</span>
              <span className="font-bold text-logo-brown">{formatMAD(total)}</span>
            </div>
          </div>
        </ContentContainer>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="inline-flex items-center justify-center px-6 py-2.5 border border-logo-brown/50 text-logo-brown rounded-full hover:bg-logo-brown/10 transition font-medium"
            onClick={handlePrintReceipt}
          >
            <Printer weight="duotone" className="mr-2" /> Imprimer le Reçu
          </button>

          <button
            className="inline-flex items-center justify-center px-6 py-2.5 bg-logo-brown text-white rounded-full hover:bg-logo-brown/90 transition font-medium"
            onClick={handleContinueShopping}
          >
            Continuer les Achats <ShoppingBag weight="duotone" className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;