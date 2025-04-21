import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Star } from "@phosphor-icons/react";
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
 * @returns {JSX.Element}
 */
const RecommendedProductCard = ({ product, className = '' }) => {
  if (!product) return null;

  // Get product image, checking variants if main image is not available
  const productImage = product.image || (product.variants && product.variants[0]?.image);

  // Get product price, checking variants if available
  const productPrice = product.variants && product.variants.length > 0
    ? product.variants[0].price
    : product.price;

  // Get or generate a random rating between 3.5 and 5.0 if not available
  const rating = product.rating || (3.5 + Math.random() * 1.5).toFixed(1);

  // Get review count or set a default value
  const reviewCount = product.reviewCount || Math.floor(10 + Math.random() * 40);

  return (
    <Link to={`/product/${product.id}`} className={`recommended-product-card ${className}`}>
      <div className="product-image">
        <img src={productImage} alt={product.name} />
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