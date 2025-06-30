import React from 'react';

/**
 * ProductVariantSelector component
 * Allows selection between different product variants
 */
const ProductVariantSelector = ({
  variants = [],
  selectedVariant,
  onVariantSelect
}) => {
  if (!variants || variants.length <= 1) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Variantes</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id || variant._id}
            onClick={() => onVariantSelect(variant)}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              selectedVariant && (selectedVariant.id === variant.id || selectedVariant._id === variant._id)
                ? 'bg-logo-lime/20 border border-logo-lime text-dark-green-7 font-medium'
                : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {variant.name || variant.size || `Option ${variants.indexOf(variant) + 1}`}
            {variant.price && ` - ${variant.price.toFixed(2)} MAD`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductVariantSelector;