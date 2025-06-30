import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Star, MapPin, Drop, Waves, Sun, SunHorizon, Leaf } from "@phosphor-icons/react";
import './RecommendedProductCard.scss';

/**
 * RecommendedProductCard component for displaying product items in the recommended products section
 *
 * @param {Object} props
 * @param {Object} props.product - Product data object
 * @param {string} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {string} props.product.image - Product image URL
 * @param {number} props.product.price - Product price
 * @param {number} props.product.rating - Product rating (optional)
 * @param {number} props.product.reviewCount - Number of reviews (optional)
 * @param {Array} props.product.variants - Optional product variants
 * @param {string} props.className - Optional additional CSS class
 * @param {string} props.activeVariantId - Active variant ID
 * @param {Function} props.onVariantChange - Callback when variant is changed
 * @param {boolean} props.showVariants - Whether to display variant selectors
 * @returns {JSX.Element}
 */
const RecommendedProductCard = ({
  product,
  className = '',
  activeVariantId,
  onVariantChange,
  showVariants = false
}) => {
  if (!product) return null;

  // Find active variant or use first variant
  const activeVariant = product.variants?.find(v => v.id === activeVariantId) ||
                        (product.variants && product.variants.length > 0 ? product.variants[0] : null);

  // Get product image, checking active variant first
  const productImage = activeVariant?.image || product.image || (product.variants && product.variants[0]?.image);

  // Get product price, checking active variant first
  const productPrice = activeVariant?.price ||
                       (product.variants && product.variants.length > 0 ? product.variants[0].price : product.price);

  // Get or generate a random rating between 3.5 and 5.0 if not available
  const rating = product.rating || (3.5 + Math.random() * 1.5).toFixed(1);

  // Get review count or set a default value
  const reviewCount = product.reviewCount || Math.floor(10 + Math.random() * 40);

  // Get brand icon based on brand name
  const getBrandIcon = (brand) => {
    if (!brand) return <MapPin weight="duotone" />;

    switch(brand.toLowerCase()) {
      case 'dika':
        return <Drop weight="duotone" />;
      case 'oued fès':
      case 'oued fes':
        return <Waves weight="duotone" />;
      case 'nouarati':
        return <Sun weight="duotone" />;
      case 'chourouk':
        return <SunHorizon weight="duotone" />;
      case 'biladi':
        return <Leaf weight="duotone" />;
      default:
        return <MapPin weight="duotone" />;
    }
  };

  // Handle variant change
  const handleVariantChange = (e, variantId) => {
    e.preventDefault();
    e.stopPropagation();
    if (onVariantChange) {
      onVariantChange(variantId);
    }
  };

  // Render variant selector if variants exist and showVariants is true
  const renderVariantSelector = () => {
    if (!showVariants || !product.variants || product.variants.length <= 1) return null;

    return (
      <div className="variant-selector">
        {product.variants.map((variant) => (
          <button
            key={variant.id}
            className={`variant-btn ${variant.id === activeVariantId ? 'active' : ''}`}
            onClick={(e) => handleVariantChange(e, variant.id)}
            aria-label={`Select ${variant.size || variant.name} variant`}
          >
            {variant.size || variant.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Link to={`/product/${product.id}`} className={`recommended-product-card ${className}`}>
      <div className="product-image">
        <img src={productImage} alt={product.name} />
        {renderVariantSelector()}
        {product.brand && (
          <div className="brand-badge">
            {getBrandIcon(product.brand)}
            <span>{product.brand}</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <div className="product-meta">
          <div className="product-price">
            <Tag size={16} weight="duotone" />
            {productPrice} Dh
          </div>
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  weight="duotone"
                  size={16}
                  className={index < Math.floor(rating) ? "star-filled duotone" :
                            (index < Math.ceil(rating) && !Number.isInteger(rating)) ? "star-half duotone" :
                            "star-empty duotone"}
                />
              ))}
            </div>
            <span className="rating-count">({reviewCount})</span>
          </div>
        </div>
        <ArrowRight size={18} weight="bold" className="arrow-icon" />
      </div>
    </Link>
  );
};

export default RecommendedProductCard;