import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from "@phosphor-icons/react";
import './ProductCard.scss';

/**
 * ProductCard component for displaying product items in grids and carousels
 *
 * @param {Object} props
 * @param {Object} props.product - Product data object
 * @param {string} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {string} props.product.image - Product image URL
 * @param {number} props.product.price - Product price
 * @param {Array} props.product.variants - Optional product variants
 * @param {string} props.className - Optional additional CSS class
 * @returns {JSX.Element}
 */
const ProductCard = ({ product, className = '' }) => {
  if (!product) return null;

  // Get product image, checking variants if main image is not available
  const productImage = product.image || (product.variants && product.variants[0]?.image);

  // Get product price, checking variants if available
  const productPrice = product.variants && product.variants.length > 0
    ? product.variants[0].price
    : product.price;

  return (
    <Link to={`/product/${product.id}`} className={`product-card ${className}`}>
      <div className="product-image">
        <img src={productImage} alt={product.name} />
      </div>
      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <div className="product-price">{productPrice} Dh</div>
        <ArrowRight size={18} weight="bold" className="arrow-icon" />
      </div>
    </Link>
  );
};

export default ProductCard;