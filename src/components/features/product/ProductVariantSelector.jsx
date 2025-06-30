import React from 'react';

/**
 * ProductVariantSelector component for selecting product variants
 * @param {Object} props - Component props
 * @param {Array} props.variants - Array of variant objects with id and name properties
 * @param {Object} props.selectedVariant - Currently selected variant object
 * @param {Function} props.onSelect - Callback function when a variant is selected
 * @param {string} props.className - Additional class names
 */
const ProductVariantSelector = ({
  variants = [],
  selectedVariant,
  onSelect,
  className = ""
}) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="font-medium mb-2">Choisir l'option</div>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const variantKey = variant.id || variant.variantId || `variant-${variant.size || variant.name}-${Math.random()}`;
          return (
            <button
              key={variantKey}
              className={`px-4 py-2 rounded-full ${
                selectedVariant?.id === variant.id || selectedVariant?.variantId === variant.variantId
                  ? 'bg-logo-lime/30 border border-logo-lime/50 text-dark-green-7 font-medium'
                  : 'bg-logo-lime/10 border border-logo-lime/20 text-dark-green-7 hover:bg-logo-lime/20'
              }`}
              onClick={() => onSelect(variant)}
            >
              {variant.size || variant.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantSelector;