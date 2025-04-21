import React, { useState } from 'react';
import './ProductGallery.scss';

const ProductGallery = ({ product, initialVariant }) => {
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || null);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const variants = product.variants || [];
  const currentImage = selectedVariant ? selectedVariant.image : product.image;

  const handleThumbnailClick = (variant, index) => {
    setSelectedVariant(variant);
    setSelectedImage(index);
  };

  return (
    <div className="product-gallery">
      <div className="main-image">
        <img src={currentImage} alt={product.name} />
      </div>

      {variants.length > 0 && (
        <div className="thumbnails">
          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className={`thumbnail ${selectedVariant?.id === variant.id ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(variant, index)}
            >
              <img src={variant.image} alt={`${product.name} - ${variant.size}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;