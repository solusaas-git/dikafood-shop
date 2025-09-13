import React, { useState } from 'react';
import { tv } from 'tailwind-variants';
import { Icon } from '@components/ui';
import Button from '@components/ui/inputs/Button';

// Styles for the drawer container
const drawerStyles = tv({
  base: 'fixed bottom-0 left-0 right-0 z-80 bg-white border-t border-logo-lime/30 shadow-lg transition-all duration-300 ease-in-out pt-1 mt-4',
  variants: {
    expanded: {
      true: 'h-auto max-h-[80vh] rounded-t-2xl',
      false: 'h-auto',
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

// Add styles for the item count flag
const itemCountFlagStyles = tv({
  base: 'absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-4 rounded-full border border-logo-lime/40 shadow-md z-40 flex items-center justify-center bg-gradient-to-r from-white to-logo-lime/5',
});

const headerStyles = tv({
  base: 'px-4 py-3 flex items-center justify-between bg-gradient-to-r from-light-yellow-1/20 to-logo-lime/10',
  variants: {
    expanded: {
      true: 'rounded-t-2xl border-b border-logo-lime/20 py-4',
      false: '',
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

// New styles for the expand button row
const expandButtonRowStyles = tv({
  base: 'w-full flex justify-center items-center py-3 border-t border-logo-lime/20 bg-white hover:bg-logo-lime/10 active:bg-logo-lime/15 transition-colors cursor-pointer select-none',
});

const bodyStyles = tv({
  base: 'p-4 overflow-y-auto',
  variants: {
    hidden: {
      true: 'hidden',
      false: '',
    },
  },
  defaultVariants: {
    hidden: false,
  },
});

/**
 * DrawerContainer component for displaying purchase options in a mobile drawer
 *
 * @param {Object} product - Product data
 * @param {Object} selectedVariant - Currently selected variant
 * @param {number} quantity - Selected quantity
 * @param {Function} onQuantityChange - Handler for quantity changes
 * @param {Function} onVariantSelect - Handler for variant changes
 * @param {Function} onAddToCart - Handler for add to cart action
 * @param {Function} onBuyNow - Handler for buy now action
 * @param {string} className - Additional CSS classes
 */
const DrawerContainer = ({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  onVariantSelect,
  onAddToCart,
  onBuyNow,
  className,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!product) {
    return null;
  }

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const price = selectedVariant?.price || product?.price || product?.unitPrice || 0;
  const currency = product?.currency || "MAD";
  const variants = product?.variants || [];
  const hasVariants = Array.isArray(variants) && variants.length > 0;

  return (
    <div className={drawerStyles({ expanded, className })} {...props}>
      {/* Item Count Flag - Always visible on top of drawer */}
      <div className={itemCountFlagStyles()}>
        <Icon name="shoppingbag" size="xs" className="text-dark-green-7 mr-1.5" />
        <span className="text-sm font-medium text-dark-green-7">
          {quantity} <span className="text-neutral-600">article{quantity > 1 ? 's' : ''}</span>
        </span>
      </div>

      {/* Header - Always visible */}
      <div className={headerStyles({ expanded })}>
        {expanded ? (
          <>
            <h2 className="text-lg font-medium text-dark-green-7">Options d'achat</h2>
            <button
              onClick={toggleExpanded}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-logo-lime/10 border border-logo-lime/30"
            >
              <Icon name="caretdown" size="sm" className="text-dark-green-6" />
            </button>
          </>
        ) : (
          <>
            {/* Collapsed view with price, add to cart button, and buy button */}
            <div className="flex flex-col">
              <div className="bg-logo-lime/10 rounded-lg px-4 py-2 border border-logo-lime/20">
                <span className="text-xl font-bold text-dark-green-7">{currency} {price.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center">
              <Button
                variant="lime"
                size="sm"
                iconName="shoppingbag"
                onClick={onBuyNow}
                className="mr-2"
                label="Acheter"
              />
              <button
                onClick={onAddToCart}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-logo-lime/15 border border-logo-lime/50 mr-2 hover:bg-logo-lime/20 active:bg-logo-lime/30 transition-colors"
                aria-label="Ajouter au panier"
              >
                <Icon name="shoppingcart" size="md" className="text-dark-green-7" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Expand button row - separate from header */}
      {!expanded && (
        <div
          className={expandButtonRowStyles()}
          onClick={toggleExpanded}
          role="button"
          aria-label="Voir plus d'options"
          tabIndex={0}
        >
          <span className="text-dark-green-6 text-sm mr-2">Voir plus d'options</span>
          <Icon name="caretdown" size="sm" className="text-logo-lime rotate-180" />
        </div>
      )}

      {/* Body - Only visible when expanded */}
      <div className={bodyStyles({ hidden: !expanded })}>
        {/* Variant selector - Only show if there are variants */}
        {hasVariants && (
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-dark-green-7">Choisir l'option</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant, index) => {
                const variantKey = variant.id || variant.variantId || `variant-${index}-${variant.size || variant.name || Math.random()}`;
                return (
                  <button
                    key={variantKey}
                    className={`px-4 py-2 rounded-full ${
                      selectedVariant?.id === variant.id || selectedVariant?.variantId === variant.variantId
                        ? 'bg-logo-lime/30 border border-logo-lime/50 text-dark-green-7 font-medium'
                        : 'bg-logo-lime/10 border border-logo-lime/20 text-dark-green-7 hover:bg-logo-lime/20'
                    }`}
                    onClick={() => onVariantSelect?.(variant)}
                  >
                    {variant.size || variant.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity selector */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-dark-green-7">Quantité</h3>
          <div className="flex items-center">
            <button
              className="w-10 h-10 flex items-center justify-center border border-logo-lime/30 rounded-l-full bg-logo-lime/10 hover:bg-logo-lime/20"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Icon name="minus" size="sm" className={quantity <= 1 ? "text-logo-lime/30" : "text-dark-green-6"} />
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) onQuantityChange(val);
              }}
              className="w-14 h-10 border-y border-logo-lime/30 text-center focus:outline-none bg-logo-lime/5"
            />
            <button
              className="w-10 h-10 flex items-center justify-center border border-logo-lime/30 rounded-r-full bg-logo-lime/10 hover:bg-logo-lime/20"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Icon name="plus" size="sm" className="text-dark-green-6" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4 mb-6">
          <Button
            variant="lime"
            size="md"
            iconName="shoppingbag"
            iconPosition="left"
            label="Acheter"
            onClick={onBuyNow}
            isFullWidth
          />
          <Button
            variant="limeOutline"
            size="md"
            iconName="shoppingcart"
            iconPosition="left"
            label="Ajouter"
            onClick={onAddToCart}
            isFullWidth
          />
        </div>

        {/* Collapse button at the bottom of expanded drawer */}
        <div
          className={expandButtonRowStyles()}
          onClick={toggleExpanded}
          role="button"
          aria-label="Réduire"
          tabIndex={0}
        >
          <span className="text-dark-green-6 text-sm mr-2">Réduire</span>
          <Icon name="caretdown" size="sm" className="text-logo-lime" />
        </div>
      </div>
    </div>
  );
};

export default DrawerContainer;