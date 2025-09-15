import React from 'react';
import { ContentContainer } from '@components/ui/layout';
import { ProductVariantSelector } from '@/components/features/product';
import QuantitySelector from '@components/ui/inputs/QuantitySelector';

/**
 * ProductOptions component for product variant and quantity selection
 * @param {Object} props - Component props
 * @param {Array} props.variants - Array of variant objects with id and name properties
 * @param {Object} props.selectedVariant - Currently selected variant object
 * @param {Function} props.onVariantSelect - Callback function when a variant is selected
 * @param {number} props.quantity - Current quantity value
 * @param {Function} props.onQuantityChange - Callback function when quantity changes
 * @param {string} props.className - Additional class names
 */
const ProductOptions = ({
  variants = [],
  selectedVariant,
  onVariantSelect,
  quantity = 1,
  onQuantityChange,
  className = ""
}) => {
  return (
    <div className={className}>
      <ContentContainer
        title="Options d'achat"
        variant="default"
        headerVariant="default"
        collapsible
        defaultOpen={true}
      >
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-4">
          <ProductVariantSelector
            variants={variants}
            selectedVariant={selectedVariant}
            onSelect={onVariantSelect}
            className="w-full md:w-auto"
          />

          <div className="w-full md:w-auto">
            <div className="font-medium mb-2 text-sm md:text-base">Quantité</div>
            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={99}
            />
          </div>
        </div>
      </ContentContainer>
    </div>
  );
};

export default ProductOptions;