import React from 'react';
import { tv } from 'tailwind-variants';
import { Plus, Minus } from '@phosphor-icons/react';

const quantityStyles = tv({
  slots: {
    container: 'w-full mb-6',
    header: 'flex items-center justify-between mb-3',
    title: 'text-base font-medium text-dark-green-7',
    controlsContainer: 'flex items-center h-10',
    button: 'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
    decrementButton: 'border-neutral-300 text-dark-green-7 hover:border-dark-yellow-1 hover:bg-light-yellow-3/50 active:scale-95',
    incrementButton: 'border-neutral-300 text-dark-green-7 hover:border-dark-yellow-1 hover:bg-light-yellow-3/50 active:scale-95',
    disabledButton: 'opacity-50 cursor-not-allowed',
    value: 'w-16 text-center text-base font-medium text-dark-green-7',
  },
  variants: {
    isDisabled: {
      true: {
        decrementButton: 'opacity-50 cursor-not-allowed',
      }
    }
  }
});

/**
 * Quantity selector component
 *
 * @param {number} quantity - Current quantity value
 * @param {Function} onQuantityChange - Callback when quantity changes
 * @param {number} minQuantity - Minimum allowed quantity (default: 1)
 * @param {number} maxQuantity - Maximum allowed quantity (optional)
 */
const QuantitySelector = ({
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity
}) => {
  const {
    container,
    header,
    title,
    controlsContainer,
    button,
    decrementButton,
    incrementButton,
    value
  } = quantityStyles();

  const isDecrementDisabled = quantity <= minQuantity;
  const isIncrementDisabled = maxQuantity !== undefined && quantity >= maxQuantity;

  const handleDecrement = () => {
    if (!isDecrementDisabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (!isIncrementDisabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const { decrementButton: decrementClass } = quantityStyles({
    isDisabled: isDecrementDisabled
  });

  return (
    <div className={container()}>
      <div className={header()}>
        <h3 className={title()}>Quantité</h3>
      </div>
      <div className={controlsContainer()}>
        <button
          type="button"
          className={`${button()} ${decrementClass()}`}
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          aria-label="Diminuer la quantité"
        >
          <Minus weight="bold" size={16} />
        </button>

        <span className={value()}>
          {quantity}
        </span>

        <button
          type="button"
          className={`${button()} ${incrementButton()} ${isIncrementDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleIncrement}
          disabled={isIncrementDisabled}
          aria-label="Augmenter la quantité"
        >
          <Plus weight="bold" size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;