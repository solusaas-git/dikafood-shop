import React from 'react';
import AsyncImage from '@/components/ui/data-display/AsyncImage';

/**
 * ProductImageGallery component for displaying product images with thumbnails
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects with imageId and variant properties
 * @param {number} props.selectedImage - Index of the currently selected image
 * @param {Function} props.onSelectImage - Callback function when an image is selected
 * @param {string} props.productName - Name of the product for alt text
 * @param {string} props.selectedVariant - Currently selected variant name
 * @param {boolean} props.isMobile - Whether the component is rendered on mobile
 * @param {Array} props.variants - Array of product variants
 * @param {Function} props.onVariantSelect - Callback function when a variant is selected
 * @param {string} props.className - Additional class names
 */
const ProductImageGallery = ({
  images = [],
  selectedImage = 0,
  onSelectImage,
  productName = '',
  selectedVariant = '',
  variants = [],
  onVariantSelect,
  isMobile = false,
  className = ''
}) => {
  // Ensure we have valid images
  const validImages = Array.isArray(images) && images.length > 0
    ? images
    : [{ imageId: null, url: '/images/placeholder-product.png', variant: 'default' }];

  // Ensure selectedImage is within bounds
  const safeSelectedImage = selectedImage >= 0 && selectedImage < validImages.length
    ? selectedImage
    : 0;

  const handleImageSelect = (index) => {
    if (onSelectImage) {
      onSelectImage(index);
    }

    // If this image is associated with a variant, select that variant too
    if (onVariantSelect && Array.isArray(variants) && variants.length > 0) {
      const selectedImageVariant = validImages[index]?.variant;
      if (selectedImageVariant) {
        // Find matching variant by name or size
        const matchingVariant = variants.find(v =>
          (v.name && v.name.toLowerCase() === selectedImageVariant.toLowerCase()) ||
          (v.size && v.size.toLowerCase() === selectedImageVariant.toLowerCase())
        );

        if (matchingVariant) {
          onVariantSelect(matchingVariant);
        }
      }
    }
  };

  const currentImage = validImages[safeSelectedImage];

  return (
    <div className={className}>
      <div className={`border-2 border-logo-lime/20 rounded-lg ${isMobile ? 'p-2' : 'p-3'} bg-white mb-2 md:mb-4 ${isMobile ? 'h-48' : 'h-72'} flex items-center justify-center relative overflow-hidden mx-auto max-w-sm`}>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-light-yellow-1/5 to-logo-lime/5 pointer-events-none"></div>

        {currentImage?.imageId ? (
          <AsyncImage
            imageId={currentImage.imageId}
            alt={`${productName} - ${selectedVariant || ''}`}
            className="max-w-[75%] max-h-[85%] object-contain relative z-10"
          />
        ) : (
          <img
            src={currentImage?.url || "/images/placeholder-product.png"}
            alt={`${productName} - ${selectedVariant || ''}`}
            className="max-w-[75%] max-h-[85%] object-contain relative z-10"
          />
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-1 md:gap-2 justify-center">
          {validImages.map((image, index) => (
            <button
              key={`img-${index}-${image.imageId || image.url}`}
              onClick={() => handleImageSelect(index)}
              className={`border-2 ${index === safeSelectedImage ? 'border-logo-lime ring-1 ring-logo-lime/30' : 'border-logo-lime/10 hover:border-logo-lime/30'}
                rounded-md overflow-hidden ${isMobile ? 'w-16 h-16' : 'w-16 h-16'} cursor-pointer transition-all relative`}
              title={image.variant || `Image ${index + 1}`}
            >
              {/* Subtle gradient overlay for thumbnails */}
              <div className="absolute inset-0 bg-gradient-to-br from-light-yellow-1/5 to-logo-lime/5 pointer-events-none"></div>

              {image.imageId ? (
                <AsyncImage
                  imageId={image.imageId}
                  alt={`${productName} - ${image.variant || `Image ${index + 1}`}`}
                  className="w-full h-full object-contain p-1 relative z-10"
                />
              ) : (
                <img
                  src={image.url || "/images/placeholder-product.png"}
                  alt={`${productName} - ${image.variant || `Image ${index + 1}`}`}
                  className="w-full h-full object-contain p-1 relative z-10"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;