import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

/**
 * HeroProductCard component for displaying products in hero sections
 * This component maintains its own internal variant state to ensure
 * variant selection only affects this specific card
 */
export function HeroProductCard({ product, activeVariant, onVariantChange, ...props }) {
  // Track the active variant internally
  const [localActiveVariant, setLocalActiveVariant] = useState(
    activeVariant || (product?.variants && product.variants.length > 0 ? product.variants[0] : null)
  );

  // Update local state when prop changes
  useEffect(() => {
    if (activeVariant) {
      setLocalActiveVariant(activeVariant);
    }
  }, [activeVariant]);

  // Handle variant change locally
  const handleLocalVariantChange = (variant) => {
    // Update local state
    setLocalActiveVariant(variant);

    // Propagate to parent if needed
    if (onVariantChange) {
      onVariantChange(variant);
    }
  };

  return (
    <ProductCard
      variant="hero"
      size="lg"
      product={product}
      activeVariant={localActiveVariant}
      onVariantChange={handleLocalVariantChange}
      className="h-full"
      {...props}
    />
  );
}

export default HeroProductCard;