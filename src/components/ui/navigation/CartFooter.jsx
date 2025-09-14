import React from 'react';
import Icon from '../icons/Icon';

/**
 * CartFooter Component
 * Combines total and checkout action in a compact design to save space
 * 
 * @param {Object} props - Component props
 * @param {number} props.totalAmount - Total cart amount
 * @param {Function} props.formatPrice - Function to format price
 * @param {Function} props.onCheckout - Checkout handler function
 * @param {string} props.checkoutText - Text for checkout button
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.totalText - Text for total label
 */
const CartFooter = ({
  totalAmount = 0,
  formatPrice,
  onCheckout,
  checkoutText = 'Commencer mes achats',
  isLoading = false,
  totalText = 'Total'
}) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50/50">
      {/* Total Section */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600 font-medium">
          {totalText}
        </span>
        <span className="text-xl font-bold text-dark-green-7">
          {formatPrice(totalAmount)}
        </span>
      </div>

      {/* Checkout Button - High Contrast Primary CTA */}
      <button
        onClick={onCheckout}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-logo-lime text-dark-green-7 font-bold rounded-full border-2 border-logo-lime hover:bg-logo-lime/90 hover:border-logo-lime/90 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-dark-green-7/30 border-t-dark-green-7 animate-spin rounded-full"></div>
            Traitement...
          </>
        ) : (
          <>
            <Icon name="shoppingbag" size="sm" className="text-dark-green-7" />
            {checkoutText}
          </>
        )}
      </button>
    </div>
  );
};

export default CartFooter; 