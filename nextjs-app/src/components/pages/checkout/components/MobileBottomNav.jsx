import React, { useState } from 'react';
import { CaretLeft, CaretRight, ShoppingBag, X, CaretUp, CheckCircle, Plus, Minus } from '@phosphor-icons/react';

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
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleNext = () => {
    // Always call the nextStep function passed from parent
    // The parent component (CheckoutPage) handles the logic of what function to actually execute
    nextStep();
  };

  const getButtonText = () => {
    if (currentStep === 0) return 'Démarrer';
    if (currentStep === 1) return 'Continuer';
    if (currentStep === 2) return 'Confirmer la commande';
    return 'Continuer';
  };

  return (
    <>
      {/* Mobile Cart Summary Drawer */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-10 transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="relative bg-white border-t border-amber-100 shadow-lg rounded-t-xl max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} weight="duotone" className="text-logo-brown" />
              <h3 className="text-base font-medium text-logo-brown">Votre Commande ({cart.items.length})</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 bg-amber-50 rounded-full text-logo-brown"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className="p-4 divide-y divide-amber-100">
            {cart.items.map((item) => (
              <div className="flex py-3 first:pt-0 last:pb-0" key={item.itemId || item.id}>
                {/* Item Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-green-6/70">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 ml-3">
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-800">{item.productName}</h4>
                    <p className="text-xs text-gray-500">
                      {item.itemProperties && Array.isArray(item.itemProperties) && item.itemProperties.length > 0 ? (
                        item.itemProperties.map((prop, index) => {
                          // Handle different property formats
                          let displayText = '';
                          if (typeof prop === 'object') {
                            // If it's an object with key-value pairs
                            const values = Object.values(prop).filter(v => v);
                            if (values.length) {
                              displayText = values.join(': ');
                            }
                          } else if (typeof prop === 'string') {
                            // If it's a simple string
                            displayText = prop;
                          }

                          return displayText ? (
                            <span key={index} className="mr-1">
                              {displayText}
                              {index < item.itemProperties.filter(p => !!p).length - 1 && ', '}
                            </span>
                          ) : null;
                        })
                      ) : null}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-amber-200 rounded-full">
                      <button
                        className="w-6 h-6 flex items-center justify-center text-logo-brown disabled:opacity-50"
                        onClick={() => decreaseQuantity(item.itemId || item.id)}
                        disabled={item.quantity <= 1}
                        aria-label="Diminuer la quantité"
                      >
                        <Minus size={16} weight="bold" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        className="w-6 h-6 flex items-center justify-center text-logo-brown"
                        onClick={() => increaseQuantity(item.itemId || item.id)}
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={16} weight="bold" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="font-medium text-logo-brown">
                      {formatMAD(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50/30 border-t border-amber-100">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatMAD(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium">{shippingCost === 0 ? 'Gratuit' : formatMAD(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes estimées</span>
                <span className="font-medium">{formatMAD(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-amber-100">
                <span className="font-semibold text-logo-brown">Total</span>
                <span className="font-bold text-logo-brown">{formatMAD(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-amber-100 py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          {/* Steps Indicator */}
          <div className="w-1/3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-logo-brown rounded-full hover:bg-gray-50 transition font-medium text-sm shadow-sm"
              >
                <CaretLeft weight="bold" className="mr-1" /> Retour
              </button>
            )}
          </div>

          {/* Price Summary & Cart Button */}
          <div className="w-1/3 flex justify-center items-center">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-1">
                <ShoppingBag size={16} weight="duotone" className="text-logo-brown" />
                <span className="font-semibold text-logo-brown">{formatMAD(total)}</span>
              </div>
              <span className="text-xs text-gray-500 flex items-center">
                Détails <CaretUp size={10} weight="bold" className="ml-1" />
              </span>
            </button>
          </div>

          {/* Next/Submit Button */}
          <div className="w-1/3 flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 bg-logo-brown border border-logo-brown text-white rounded-full hover:bg-logo-brown/90 transition font-medium text-sm shadow-sm"
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle weight="bold" className="mr-1" /> Confirmer
                </>
              ) : (
                <>
                  {getButtonText()} <CaretRight weight="bold" className="ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Space buffer for fixed nav */}
      <div className="h-16"></div>
    </>
  );
};

export default MobileBottomNav;