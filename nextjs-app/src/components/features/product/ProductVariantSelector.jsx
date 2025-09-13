import React from 'react';
import { Icon } from '@/components/ui/icons';

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
          
          // Strict selection logic - prioritize unique IDs first, then fallback to size/name
          const isSelected = selectedVariant && (
            // First try to match by unique IDs
            (selectedVariant.id && variant.id && selectedVariant.id === variant.id) ||
            (selectedVariant.variantId && variant.variantId && selectedVariant.variantId === variant.variantId) ||
            (selectedVariant._id && variant._id && selectedVariant._id === variant._id) ||
            // Only fallback to size/name if no IDs are available
            (!selectedVariant.id && !selectedVariant.variantId && !selectedVariant._id && 
             !variant.id && !variant.variantId && !variant._id && 
             ((selectedVariant.size && variant.size && selectedVariant.size === variant.size) ||
              (selectedVariant.name && variant.name && selectedVariant.name === variant.name)))
          );
          
          
          return (
            <button
              key={variantKey}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-logo-lime/30 border border-logo-lime/50 text-dark-green-7 font-medium shadow-sm'
                  : 'bg-logo-lime/10 border border-logo-lime/20 text-dark-green-7 hover:bg-logo-lime/20 hover:border-logo-lime/30'
              }`}
              onClick={() => onSelect(variant)}
            >
              <span>{variant.size || variant.name}</span>
              {isSelected && (
                <Icon
                  name="check"
                  size="sm"
                  className="text-dark-green-7 ml-1"
                  weight="bold"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantSelector;