import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import Icon from '../icons/Icon';

/**
 * HeroProductCard component for displaying products in hero sections
 * This component maintains its own internal variant state to ensure
 * variant selection only affects this specific card
 */
export function HeroProductCard({ product, activeVariant, onVariantChange, onAddToCart, ...props }) {
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

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, localActiveVariant);
    }
  };

  // Create add to cart button
  const actionButton = onAddToCart ? (
    <button
      onClick={handleAddToCart}
      className="inline-flex items-center justify-center p-2 text-white bg-logo-lime rounded-full hover:bg-logo-lime/90 transition-colors shadow-sm hover:shadow-md"
      aria-label="Add to cart"
    >
      <Icon name="shoppingCart" size="sm" />
    </button>
  ) : null;

  return (
    <ProductCard
      variant="hero"
      size="lg"
      product={product}
      activeVariant={localActiveVariant}
      onVariantChange={handleLocalVariantChange}
      action={actionButton}
      className="h-full"
      {...props}
    />
  );
}

export default HeroProductCard;