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
  checkoutText = 'Passer la commande',
  isLoading = false,
  totalText = 'Total'
}) => {
  return (
    <div className="p-4 border-t border-logo-lime/20 bg-white">
      {/* Compact Total + Action Layout */}
      <div className="flex items-center justify-between gap-3">
        {/* Total Section */}
        <div className="flex flex-col">
          <span className="text-xs text-dark-green-6 uppercase tracking-wide font-medium">
            {totalText}
          </span>
          <span className="text-lg font-bold text-dark-green-7">
            {formatPrice(totalAmount)}
          </span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="flex items-center justify-center gap-2 py-3 px-8 bg-logo-lime/20 text-dark-green-7 font-medium rounded-full border border-logo-lime/30 hover:bg-logo-lime/30 transition-all hover:-translate-y-0.5 hover:shadow-sm icon-text-separator disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {checkoutText}
          <Icon name="arrowRight" size="sm" className="text-dark-green-7" />
        </button>
      </div>
    </div>
  );
};

export default CartFooter; 