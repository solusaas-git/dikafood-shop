import React from 'react';
import { ShoppingCart } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';

/**
 * Cart Button Component
 * Shows the current number of items in the cart and handles click events
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Icon size: "sm", "md", "lg" (default: "md")
 * @param {boolean} props.showCount - Whether to show the item count badge (default: true)
 */
const CartButton = ({
  onClick,
  className = '',
  size = 'md',
  showCount = true
}) => {
  const { cart } = useCart();
  const itemCount = cart.items?.length || 0;

  // Determine icon size in pixels
  const sizeInPx = {
    sm: 20,
    md: 24,
    lg: 32
  }[size] || 24;

  // Determine badge size and position based on icon size
  const badgeClasses = {
    sm: 'w-4 h-4 -top-1 -right-1 text-[8px]',
    md: 'w-5 h-5 -top-1.5 -right-1.5 text-[10px]',
    lg: 'w-6 h-6 -top-2 -right-2 text-xs'
  }[size] || 'w-5 h-5 -top-1 -right-1 text-[10px]';

  return (
    <button
      className={`relative inline-flex items-center justify-center p-2 text-dark-green-7 hover:text-dark-green-9 focus:outline-none transition-colors ${className}`}
      onClick={onClick}
      aria-label={`Open cart (${itemCount} items)`}
    >
      <ShoppingCart size={sizeInPx} weight="duotone" />

      {showCount && itemCount > 0 && (
        <span className={`absolute ${badgeClasses} inline-flex items-center justify-center font-bold text-white bg-logo-lime rounded-full ring-1 ring-white`}>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
