import React from 'react';
import { tv } from 'tailwind-variants';
import { ShoppingCart, CreditCard } from '@phosphor-icons/react';

const actionStyles = tv({
  slots: {
    container: 'flex gap-3 w-full mt-8',
    buyButton: 'flex-1 min-w-0 bg-dark-yellow-1 text-dark-green-7 font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:bg-light-yellow-4 hover:shadow-md hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-sm',
    addButton: 'flex-1 min-w-0 bg-transparent border-2 border-dark-yellow-1 text-dark-green-7 font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:bg-dark-yellow-1/10 hover:translate-y-[-2px] active:translate-y-[1px]',
    disabledButton: 'opacity-50 cursor-not-allowed pointer-events-none',
    icon: 'flex-shrink-0',
    text: 'truncate',
  },
  variants: {
    isMobileLayout: {
      true: {
        container: 'fixed bottom-0 left-0 w-full px-4 py-3 bg-white border-t border-neutral-200 shadow-lg z-50',
      }
    },
    isOutOfStock: {
      true: {
        buyButton: 'opacity-50 cursor-not-allowed pointer-events-none',
        addButton: 'opacity-50 cursor-not-allowed pointer-events-none',
      }
    }
  }
});

/**
 * ProductActions component with buy and add to cart buttons
 *
 * @param {Function} addToCart - Callback for add to cart action
 * @param {string} stockStatus - Current stock status ('in-stock', 'low-stock', 'out-of-stock')
 * @param {boolean} isMobileLayout - Whether to use mobile layout styling
 */
const ProductActions = ({
  addToCart,
  stockStatus = 'in-stock',
  isMobileLayout = false
}) => {
  const isOutOfStock = stockStatus === 'out-of-stock';

  const {
    container,
    buyButton,
    addButton,
    icon,
    text
  } = actionStyles({
    isMobileLayout,
    isOutOfStock
  });

  return (
    <div className={container()}>
      <button
        className={buyButton()}
        onClick={() => addToCart(true)}
        disabled={isOutOfStock}
        aria-label="Acheter maintenant"
      >
        <CreditCard weight="duotone" size={20} className={icon()} />
        <span className={text()}>Acheter</span>
      </button>

      <button
        className={addButton()}
        onClick={() => addToCart(false)}
        disabled={isOutOfStock}
        aria-label="Ajouter au panier"
      >
        <ShoppingCart weight="duotone" size={20} className={icon()} />
        <span className={text()}>Ajouter</span>
      </button>
    </div>
  );
};

export default ProductActions;