import React from 'react';
import Button from '@components/ui/inputs/Button';

/**
 * ProductActionButtons component for product purchase actions
 * @param {Object} props - Component props
 * @param {Function} props.onAddToCart - Callback for add to cart button
 * @param {Function} props.onBuyNow - Callback for buy now button
 * @param {boolean} props.isOutOfStock - Whether the product is out of stock
 * @param {string} props.className - Additional class names
 */
const ProductActionButtons = ({
  onAddToCart,
  onBuyNow,
  isOutOfStock = false,
  className = ""
}) => {
  return (
    <div className={`flex gap-3 md:gap-4 ${className}`}>
      <Button
        variant="lime"
        size="xs"
        iconName="shoppingbag"
        iconPosition="left"
        label="Acheter"
        onClick={onBuyNow}
        isFullWidth
        disabled={isOutOfStock}
        className="text-xs md:text-sm"
      />
      <Button
        variant="limeOutline"
        size="xs"
        iconName="shoppingcart"
        iconPosition="left"
        label="Ajouter"
        onClick={onAddToCart}
        isFullWidth
        disabled={isOutOfStock}
        className="text-xs md:text-sm"
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