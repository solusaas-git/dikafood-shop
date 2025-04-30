import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Star, ShoppingCartSimple, CaretRight } from '@phosphor-icons/react';
import { isMobile } from 'react-device-detect';
import {
  getDefaultVariant,
  hasDiscount,
  getProductImage,
  formatPrice
} from '../../data/products';

/**
 * Shop Product Card component for displaying products in the shop page
 *
 * @param {Object} props
 * @param {Object} props.product - Product data object
 * @param {Function} props.onAddToCart - Function to call when adding to cart
 * @param {string} props.className - Optional additional class
 * @returns {JSX.Element}
 */
const ShopProductCard = ({ product, onAddToCart, className = '' }) => {
  if (!product) return null;

  // Get product data using utility functions
  const defaultVariant = getDefaultVariant(product);
  const productHasDiscount = hasDiscount(product);
  const productImage = getProductImage(product);

  if (!defaultVariant) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  // Format price for display based on device
  const formatPriceWithCurrency = (price) => {
    if (isMobile) {
      return `${formatPrice(price)} Dh`;
    }
    return `${formatPrice(price)} MAD`;
  };

  return (
    <div className={`product-card ${isMobile ? 'mobile' : ''} ${className}`} key={product.id}>
      <div className="product-image">
        <img src={productImage} alt={product.name} />
        <div className="product-badges">
          {productHasDiscount && (
            <span className="product-badge discount">
              <Tag size={isMobile ? 10 : 12} weight="duotone" />
              {!isMobile && "Promo"}
            </span>
          )}
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.brand} {product.name}</Link>
        </h3>
        <div className="product-meta-container">
          <div className="product-price-tag">
            <Tag size={isMobile ? 14 : 16} weight="duotone" />
            <span className="current-price">
              {defaultVariant.discountPrice
                ? formatPriceWithCurrency(defaultVariant.discountPrice)
                : formatPriceWithCurrency(defaultVariant.price)}
            </span>
            {defaultVariant.discountPrice && (
              <span className="old-price">{formatPriceWithCurrency(defaultVariant.price)}</span>
            )}
          </div>
          {!isMobile && (
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  weight="duotone"
                  className={i < Math.floor(product.rating) ? "star-filled duotone" : "star-empty duotone"}
                  size={14}
                />
              ))}
              <span className="rating-count">({product.reviewCount})</span>
            </div>
          )}
        </div>
        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCartSimple size={isMobile ? 18 : 16} weight="duotone" />
            {!isMobile && "Ajouter au panier"}
          </button>
          <Link
            to={`/product/${product.id}`}
            className="view-product-btn"
            aria-label={`Voir détails de ${product.name}`}
          >
            <CaretRight size={isMobile ? 18 : 16} weight="duotone" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;