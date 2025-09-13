import React from 'react';
import { tv } from 'tailwind-variants';
import { Star, Tag, Factory } from '@phosphor-icons/react';
import { formatCurrency } from '../../../utils/format';

const productInfoStyles = tv({
  slots: {
    container: 'w-full',
    header: 'mb-4',
    category: 'text-sm text-dark-green-5 mb-2 font-medium',
    title: 'text-2xl md:text-3xl font-bold text-dark-green-7 leading-tight mb-3',
    meta: 'flex items-center gap-2 text-sm text-dark-green-6 mb-4',
    rating: 'flex items-center gap-1',
    starIcon: 'text-dark-yellow-1',
    ratingText: 'font-medium',
    reviewCount: 'text-dark-green-5',
    divider: 'text-neutral-300',
    priceContainer: 'flex items-center justify-between mb-6',
    priceWrapper: 'flex items-baseline gap-2',
    currentPrice: 'text-2xl font-bold text-dark-green-7',
    oldPrice: 'text-base text-neutral-500 line-through',
    discountBadge: 'flex items-center gap-1 bg-light-yellow-3 text-dark-green-7 py-1 px-3 rounded-full text-sm font-semibold',
    brandContainer: 'flex items-center gap-2',
    brandLogo: 'w-10 h-10 bg-light-green-1 rounded-full flex items-center justify-center text-dark-green-5',
    description: 'text-base text-dark-green-6 mb-6 leading-relaxed',
  },
});

/**
 * ProductInfo component displays the main product information
 *
 * @param {Object} product - Product data
 * @param {Object} selectedVariant - Currently selected variant
 */
const ProductInfo = ({ product, selectedVariant }) => {
  const {
    container,
    header,
    category,
    title,
    meta,
    rating,
    starIcon,
    ratingText,
    reviewCount,
    divider,
    priceContainer,
    priceWrapper,
    currentPrice,
    oldPrice,
    discountBadge,
    brandContainer,
    brandLogo,
    description
  } = productInfoStyles();

  if (!product) return null;

  const displayPrice = selectedVariant?.price || product.price;
  const displayOldPrice = product.oldPrice;

  // Format brand data for display
  const brandName = product.brand && typeof product.brand === 'object'
    ? product.brand.name || 'Marque'
    : (typeof product.brand === 'string' ? product.brand : 'Marque');

  return (
    <div className={container()}>
      <div className={header()}>
        {product.category && (
          <div className={category()}>
            {product.category}
          </div>
        )}
        <h1 className={title()}>
          {product.name}
        </h1>
        <div className={meta()}>
          {product.rating && (
            <div className={rating()}>
              <Star weight="fill" className={starIcon()} size={18} />
              <span className={ratingText()}>{product.rating}</span>
            </div>
          )}
          {product.reviewCount > 0 && (
            <>
              <span className={divider()}>•</span>
              <span className={reviewCount()}>
                {product.reviewCount} avis
              </span>
            </>
          )}
          {product.origin && (
            <>
              <span className={divider()}>•</span>
              <span>
                Origine: {product.origin}
              </span>
            </>
          )}
        </div>
      </div>

      <div className={priceContainer()}>
        <div className={priceWrapper()}>
          <span className={currentPrice()}>
            {formatCurrency(displayPrice)}
          </span>
          {displayOldPrice && (
            <span className={oldPrice()}>
              {formatCurrency(displayOldPrice)}
            </span>
          )}
          {product.discount && (
            <span className={discountBadge()}>
              <Tag weight="fill" size={14} />
              {product.discount}
            </span>
          )}
        </div>
        <div className={brandContainer()}>
          <div className={brandLogo()}>
            <Factory weight="duotone" size={24} />
          </div>
          <span>{brandName}</span>
        </div>
      </div>

      {product.shortDescription && (
        <p className={description()}>
          {product.shortDescription}
        </p>
      )}
    </div>
  );
};

export default ProductInfo;