import React from 'react';
import { cn } from '@/utils/cn';
import { useCurrency } from '@/contexts/CurrencyContext';

/**
 * ProductPriceDisplay component for displaying product price information
 * @param {Object} props - Component props
 * @param {number} props.price - Product price
 * @param {boolean} props.isDiscounted - Whether the product is discounted
 * @param {number} props.originalPrice - Original price before discount
 * @param {boolean} props.isMobile - Whether the component is rendered on mobile
 * @param {boolean} props.highlight - Whether to highlight the price with a glowing border
 * @param {string} props.className - Additional class names
 */
const ProductPriceDisplay = ({
  price,
  isDiscounted = false,
  originalPrice,
  isMobile = false,
  highlight = false,
  className = ""
}) => {
  const { currency, formatPrice } = useCurrency();

  // Calculate discount percentage
  const discountPercentage = isDiscounted && originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className={cn(
      className,
      highlight ? 'border-glow-lime' : '',
      'rounded-lg p-3 bg-logo-lime/10'
    )}>
      <div className={`flex ${isMobile ? 'flex-col' : 'items-end gap-3'}`}>
        <div className="flex items-center">
          <span className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'} text-dark-green-7`}>
            {formatPrice(price)}
          </span>
        </div>

        {isDiscounted && originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 line-through text-sm">
              {formatPrice(originalPrice)}
            </span>
            <span className="bg-logo-lime/20 text-dark-green-8 text-xs px-2 py-1 rounded-md">
              {discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPriceDisplay;