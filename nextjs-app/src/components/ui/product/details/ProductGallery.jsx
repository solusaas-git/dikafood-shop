import React, { useState } from 'react';
import { Icon } from '@components/ui/icons';

/**
 * ProductGallery component
 * Shows product images in a gallery with thumbnail navigation
 */
const ProductGallery = ({ images = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const defaultImage = '/images/placeholder-product.png';

  // Ensure we have images to display
  const displayImages = images.length > 0 ? images : [{ url: defaultImage }];
  const currentImage = displayImages[currentImageIndex]?.url || defaultImage;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative w-full h-80 md:h-96 bg-white rounded-lg overflow-hidden border border-gray-200 mb-4">
        <img
          src={currentImage}
          alt="Product"
          className="w-full h-full object-contain"
        />

        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <Icon name="caretleft" size="sm" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <Icon name="caretright" size="sm" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-16 h-16 border rounded flex-shrink-0 overflow-hidden transition-all ${
                currentImageIndex === index
                  ? 'border-logo-lime ring-2 ring-logo-lime/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;