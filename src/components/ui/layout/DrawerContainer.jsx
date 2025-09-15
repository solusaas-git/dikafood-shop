import React, { useState } from 'react';
import { tv } from 'tailwind-variants';
import { Icon } from '@components/ui';
import Button from '@components/ui/inputs/Button';

// Styles for the drawer container
const drawerStyles = tv({
  base: 'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-logo-lime/30 shadow-lg transition-all duration-300 ease-in-out pt-1',
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
  base: 'absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white py-1 px-3 rounded-full border border-logo-lime/40 shadow-md z-10 flex items-center justify-center bg-gradient-to-r from-white to-logo-lime/5',
});

const headerStyles = tv({
  base: 'px-3 py-2.5 flex items-center justify-between bg-gradient-to-r from-light-yellow-1/20 to-logo-lime/10',
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
  base: 'p-3 overflow-y-auto',
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

  // Calculate the correct price (promotional price if available, otherwise regular price)
  const price = selectedVariant 
    ? (selectedVariant.promotionalPrice && selectedVariant.promotionalPrice > 0 && selectedVariant.promotionalPrice < selectedVariant.price 
       ? selectedVariant.promotionalPrice 
       : selectedVariant.price)
    : product?.price || product?.unitPrice || 0;
  const regularPrice = selectedVariant?.price || product?.price || product?.unitPrice || 0;
  const isDiscounted = selectedVariant?.promotionalPrice > 0 && selectedVariant?.promotionalPrice < selectedVariant?.price;
  const currency = "DH"; // Changed from product?.currency || "MAD" to always show "DH"
  const variants = product?.variants || [];
  const hasVariants = Array.isArray(variants) && variants.length > 0;

  return (
    <div className={drawerStyles({ expanded, className })} {...props}>
      {/* Item Count Flag - Always visible on top of drawer */}
      <div className={itemCountFlagStyles()}>
        <Icon name="shoppingbag" size="xs" className="text-dark-green-7 mr-1" />
        <span className="text-xs font-medium text-dark-green-7">
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
              <div className="bg-logo-lime/10 rounded-lg px-3 py-1.5 border border-logo-lime/20">
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-dark-green-7">
                    {price.toFixed(2)} {currency}
                  </span>
                  {isDiscounted && (
                    <span className="text-xs text-gray-400 line-through">
                      {regularPrice.toFixed(2)} {currency}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="lime"
                size="xs"
                iconName="shoppingbag"
                onClick={onBuyNow}
                label="Acheter"
                className="text-xs px-3"
              />
              <button
                onClick={onAddToCart}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-logo-lime/15 border border-logo-lime/50 hover:bg-logo-lime/20 active:bg-logo-lime/30 transition-colors"
                aria-label="Ajouter au panier"
              >
                <Icon name="shoppingcart" size="sm" className="text-dark-green-7" />
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
          <span className="text-dark-green-6 text-xs mr-2">Voir plus d'options</span>
          <Icon name="caretdown" size="sm" className="text-logo-lime rotate-180" />
        </div>
      )}

      {/* Body - Only visible when expanded */}
      <div className={bodyStyles({ hidden: !expanded })}>
        {/* Variant selector - Only show if there are variants */}
        {hasVariants && (
          <div className="mb-4">
            <h3 className="font-medium mb-2 text-dark-green-7 text-sm">Choisir l'option</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant, index) => {
                const variantKey = variant.id || variant.variantId || `variant-${index}-${variant.size || variant.name || Math.random()}`;
                return (
                  <button
                    key={variantKey}
                    className={`px-3 py-1.5 rounded-full text-sm ${
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
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-dark-green-7 text-sm">Quantité</h3>
          <div className="flex items-center">
            <button
              className="w-8 h-8 flex items-center justify-center border border-logo-lime/30 rounded-l-full bg-logo-lime/10 hover:bg-logo-lime/20"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Icon name="minus" size="xs" className={quantity <= 1 ? "text-logo-lime/30" : "text-dark-green-6"} />
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) onQuantityChange(val);
              }}
              className="w-12 h-8 border-y border-logo-lime/30 text-center focus:outline-none bg-logo-lime/5 text-sm"
            />
            <button
              className="w-8 h-8 flex items-center justify-center border border-logo-lime/30 rounded-r-full bg-logo-lime/10 hover:bg-logo-lime/20"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Icon name="plus" size="xs" className="text-dark-green-6" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-3 mb-4">
          <Button
            variant="lime"
            size="sm"
            iconName="shoppingbag"
            iconPosition="left"
            label="Acheter"
            onClick={onBuyNow}
            isFullWidth
            className="text-sm"
          />
          <Button
            variant="limeOutline"
            size="sm"
            iconName="shoppingcart"
            iconPosition="left"
            label="Ajouter"
            onClick={onAddToCart}
            isFullWidth
            className="text-sm"
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
          <span className="text-dark-green-6 text-xs mr-2">Réduire</span>
          <Icon name="caretdown" size="sm" className="text-logo-lime" />
        </div>
      </div>
    </div>
  );
};

export default DrawerContainer;