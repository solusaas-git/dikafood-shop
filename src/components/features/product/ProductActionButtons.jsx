import React from 'react';
import Button from '@components/ui/inputs/Button';

/**
 * ProductActionButtons component for product purchase actions
 * @param {Object} props - Component props
 * @param {Function} props.onAddToCart - Callback for add to cart button
 * @param {Function} props.onBuyNow - Callback for buy now button
 * @param {boolean} props.isOutOfStock - Whether the product is out of stock
 * @param {boolean} props.isMobile - Whether the component is rendered on mobile
 * @param {string} props.className - Additional class names
 */
const ProductActionButtons = ({
  onAddToCart,
  onBuyNow,
  isOutOfStock = false,
  isMobile = false,
  className = ""
}) => {
  return (
    <div className={`flex gap-4 ${isMobile ? 'hidden md:flex' : ''} ${className}`}>
      <Button
        variant="lime"
        size="md"
        iconName="shoppingbag"
        iconPosition="left"
        label="Acheter"
        onClick={onBuyNow}
        isFullWidth
        disabled={isOutOfStock}
      />
      <Button
        variant="limeOutline"
        size="md"
        iconName="shoppingcart"
        iconPosition="left"
        label="Ajouter"
        onClick={onAddToCart}
        isFullWidth
        disabled={isOutOfStock}
      />

      {isOutOfStock && (
        <div className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-sm">
          Produit indisponible
        </div>
      )}
    </div>
  );
};

export default ProductActionButtons;