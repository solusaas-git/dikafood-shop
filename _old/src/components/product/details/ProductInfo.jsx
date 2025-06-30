import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingCart,
  Heart,
  Share,
  Minus,
  Plus,
  ShieldCheck,
  Clock,
  Info,
  Leaf,
  Truck,
  Package
} from '@phosphor-icons/react';
import './ProductInfo.scss';

const ProductInfo = ({
  product,
  initialVariant = null,
  onVariantChange = () => {},
  onAddToCart = () => {}
}) => {
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Update selected variant when initialVariant changes (from parent)
    if (initialVariant) {
      setSelectedVariant(initialVariant);
    } else if (product?.variants?.length > 0) {
      // Set first variant as default if none provided
      setSelectedVariant(product.variants[0]);
    }
  }, [initialVariant, product]);

  if (!product) return null;

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    onVariantChange(variant);
    // Reset quantity when variant changes
    setQuantity(1);
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    // Make sure quantity is at least 1 and doesn't exceed stock
    if (newQuantity >= 1 && (!selectedVariant || newQuantity <= selectedVariant.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      product,
      variant: selectedVariant,
      quantity
    });
  };

  // Helper function to determine stock status
  const getStockStatus = () => {
    if (!selectedVariant) return null;

    if (selectedVariant.stock <= 0) {
      return { status: 'out-of-stock', text: 'Rupture de stock' };
    } else if (selectedVariant.stock <= 5) {
      return { status: 'low-stock', text: `En stock: ${selectedVariant.stock} restants` };
    } else {
      return { status: 'in-stock', text: 'En stock' };
    }
  };

  const stockStatus = getStockStatus();

  // Update renderStars function to use duotone variant
  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => {
          if (index < Math.floor(rating)) {
            // Full star
            return <Star key={index} weight="duotone" className="star-filled duotone" />;
          } else if (index < Math.ceil(rating) && !Number.isInteger(rating)) {
            // Half star
            return <Star key={index} weight="duotone" className="star-half duotone" />;
          } else {
            // Empty star
            return <Star key={index} weight="duotone" className="star-empty duotone" />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="product-info">
      <div className="product-header">
        <div className="product-category">{product.category}</div>
        <h1 className="product-title">{product.name}</h1>
        <div className="product-rating">
          {renderStars(product.rating)}
          <div className="rating-text">
            <span className="rating-value">{product.rating}</span> ({product.reviewCount} avis)
          </div>
        </div>
      </div>

      {/* Product Price */}
      <div className="product-price-container">
        <span className="current-price">
          {selectedVariant ? selectedVariant.price : product.price} Dh
        </span>
        {product.oldPrice && (
          <span className="old-price">{product.oldPrice} Dh</span>
        )}
        {product.discount && (
          <span className="discount-badge">-{product.discount}</span>
        )}
      </div>

      {/* Product Description */}
      <div className="product-short-description">
        <p>{product.shortDescription || product.description}</p>
      </div>

      {/* Variant Selection */}
      {product.variants && product.variants.length > 0 && (
        <div className="product-variants">
          <span className="variant-label">Taille:</span>
          <div className="variant-options">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                className={`variant-button ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                onClick={() => handleVariantChange(variant)}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="quantity-selector">
        <span className="quantity-label">Quantité:</span>
        <div className="quantity-row">
          <div className="quantity-controls">
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus weight="bold" />
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(1)}
              disabled={selectedVariant && quantity >= selectedVariant.stock}
            >
              <Plus weight="bold" />
            </button>
          </div>
          {stockStatus && (
            <span className={`stock-info ${stockStatus.status}`}>
              {stockStatus.status === 'in-stock' && <ShieldCheck weight="duotone" size={16} style={{ marginRight: '5px' }} />}
              {stockStatus.status === 'low-stock' && <Clock weight="duotone" size={16} style={{ marginRight: '5px' }} />}
              {stockStatus.status === 'out-of-stock' && <Info weight="duotone" size={16} style={{ marginRight: '5px' }} />}
              {stockStatus.text}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-actions">
        <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock < 1}
        >
          <ShoppingCart weight="bold" />
          Ajouter au panier
        </button>
        <button className="secondary-button">
          <Heart weight="regular" />
        </button>
        <button className="secondary-button">
          <Share weight="regular" />
        </button>
      </div>

      {/* Product Benefits */}
      <div className="product-benefits">
        <h4 className="benefits-title">Avantages du produit</h4>
        <div className="benefits-list">
          {product.benefits ? (
            product.benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <div className="benefit-icon">
                  {index === 0 && <Leaf weight="duotone" />}
                  {index === 1 && <Truck weight="duotone" />}
                  {index === 2 && <Package weight="duotone" />}
                </div>
                <span className="benefit-text">{benefit}</span>
              </div>
            ))
          ) : (
            <>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Leaf weight="duotone" />
                </div>
                <span className="benefit-text">100% naturel et sans conservateurs</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Truck weight="duotone" />
                </div>
                <span className="benefit-text">Livraison gratuite à partir de 200 Dh</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Package weight="duotone" />
                </div>
                <span className="benefit-text">Emballage écologique et sécurisé</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;