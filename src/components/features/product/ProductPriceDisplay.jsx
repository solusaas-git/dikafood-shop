import React from 'react';
import { cn } from '@/utils/cn';
import { useCurrency } from '@/contexts/CurrencyContext';
import { BrandDisplay } from '@/components/features/brand';

/**
 * ProductPriceDisplay component for displaying product price information with brand
 * @param {Object} props - Component props
 * @param {number} props.price - Product price
 * @param {boolean} props.isDiscounted - Whether the product is discounted
 * @param {number} props.originalPrice - Original price before discount
 * @param {Object} props.brand - Brand information object
 * @param {boolean} props.highlight - Whether to highlight the price with a glowing border
 * @param {string} props.className - Additional class names
 */
const ProductPriceDisplay = ({
  price,
  isDiscounted = false,
  originalPrice,
  brand,
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
      'rounded-lg p-2 md:p-2.5 bg-logo-lime/10'
    )}>
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Price Information */}
        <div className="flex flex-col gap-1 flex-1">
          {/* Current Price */}
          <div className="flex items-baseline">
            <span className="font-bold text-xl md:text-2xl text-dark-green-7 leading-tight">
              {formatPrice(price)}
            </span>
          </div>

          {/* Discount Information */}
          {isDiscounted && originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-sm md:text-base leading-tight">
                {formatPrice(originalPrice)}
              </span>
              <span className="bg-logo-lime/20 text-dark-green-8 text-sm px-2 py-1 rounded-md font-medium leading-none">
                -{discountPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Brand Logo */}
        {brand && (
          <div className="flex-shrink-0">
            <BrandDisplay
              brand={brand}
              size="medium"
              className="opacity-80"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPriceDisplay;