import React, { useState } from 'react';
import { Button } from '@components/ui/inputs';
import { Icon } from '@components/ui/icons';
import { useCurrency } from '@/contexts/CurrencyContext';

/**
 * ProductAddToCart component
 * Quantity selector and add to cart button
 */
const ProductAddToCart = ({
  product,
  selectedVariant,
  onAddToCart,
  isInCart = false,
  isLoading = false
}) => {
  const [quantity, setQuantity] = useState(1);
  const { formatPrice } = useCurrency();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onAddToCart({
      product,
      variant: selectedVariant,
      quantity
    });
  };

  // Get price from selected variant or product
  const price = selectedVariant?.price || product?.price || 0;

  // Check if product is in stock
  const inStock = selectedVariant
    ? selectedVariant.inStock !== false
    : product.inStock !== false;

  return (
    <div className="w-full">
      {/* Price */}
      <div className="flex items-baseline mb-4">
        <span className="text-2xl font-bold text-dark-green-7">{formatPrice(price)}</span>
        {product.oldPrice && (
          <span className="ml-2 text-sm line-through text-gray-500">
            {formatPrice(product.oldPrice)}
          </span>
        )}
        {product.discount && (
          <span className="ml-2 text-sm font-medium text-red-500">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Stock status */}
      <div className="mb-4">
        {inStock ? (
          <div className="flex items-center text-green-600">
            <Icon name="check" size="sm" className="mr-1" />
            <span className="text-sm">En stock</span>
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <Icon name="x" size="sm" className="mr-1" />
            <span className="text-sm">Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Quantity selector */}
      <div className="flex items-center mb-4">
        <span className="text-sm font-medium text-gray-700 mr-3">Quantité:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="minus" size="sm" />
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-12 text-center border-0 focus:ring-0 focus:outline-none"
          />
          <button
            onClick={increaseQuantity}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            <Icon name="plus" size="sm" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        variant="ctaHero"
        size="lg"
        label={isInCart ? "Déjà dans le panier" : "Ajouter au panier"}
        iconName={isLoading ? "circlenotch" : (isInCart ? "check" : "shoppingcart")}
        iconPosition="left"
        iconAnimation={isLoading ? "spin" : undefined}
        onClick={handleAddToCart}
        disabled={!inStock || isInCart || isLoading}
        aria-busy={isLoading}
        isFullWidth
      />
    </div>
  );
};

export default ProductAddToCart;