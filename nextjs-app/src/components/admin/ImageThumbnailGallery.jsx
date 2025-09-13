'use client';

import React, { useState } from 'react';
import LucideIcon from '../ui/icons/LucideIcon';

const ImageThumbnailGallery = ({ 
  images = [], 
  title = "Images",
  onImageClick = null,
  onSetPrimary = null,
  onRemoveImage = null,
  onUpdateAlt = null,
  showControls = true,
  maxHeight = "500px",
  className = ""
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleImageClick = (image, index) => {
    setSelectedImage({ ...image, index });
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`relative ${className}`}>
        {title && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">No images uploaded yet</p>
          </div>
        )}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center transition-colors hover:border-gray-400">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <LucideIcon name="image" size="xl" color="gray" />
          </div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">No Images</h4>
          <p className="text-sm text-gray-500">Upload images to showcase your product</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? 's' : ''} uploaded</p>
        </div>
      )}

      {/* Thumbnail Grid */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" 
        style={{ maxHeight, overflowY: 'auto', scrollbarWidth: 'thin' }}
      >
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative">
              {/* Main Image Container */}
              <div 
                className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-logo-lime cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-logo-lime/20"
                onClick={() => handleImageClick(image, index)}
              >
                <div className="p-2 w-full h-full">
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <LucideIcon name="eye" size="lg" className="text-gray-700" />
                  </div>
                </div>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-logo-lime to-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <LucideIcon name="star" size="xs" />
                      Primary
                    </div>
                  </div>
                )}

                {/* Image Index */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {showControls && (
                <div className={`absolute -top-2 -right-2 flex flex-col gap-2 transition-all duration-300 ${
                  hoveredIndex === index ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                }`}>
                  {onSetPrimary && !image.isPrimary && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetPrimary(index);
                      }}
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                      title="Set as primary"
                    >
                      <LucideIcon name="star" size="sm" />
                    </button>
                  )}
                  {onRemoveImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage(index);
                      }}
                      className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                      title="Remove image"
                    >
                      <LucideIcon name="trash" size="sm" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Alt Text */}
            {image.alt && (
              <div className="mt-3 px-1">
                <p className="text-xs text-gray-600 truncate font-medium" title={image.alt}>
                  {image.alt}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="relative max-w-6xl max-h-full w-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 z-20"
            >
              <LucideIcon name="x" size="lg" />
            </button>

            {/* Main Image Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-full max-h-full">
              <div className="p-6">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || `Image ${selectedImage.index + 1}`}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
              
              {/* Image Overlay Info */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {selectedImage.isPrimary && (
                  <div className="bg-gradient-to-r from-logo-lime to-green-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <LucideIcon name="star" size="xs" />
                    Primary Image
                  </div>
                )}
                <div className="bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
                  {selectedImage.index + 1} of {images.length}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {selectedImage.index > 0 && (
                  <button
                    onClick={() => handleImageClick(images[selectedImage.index - 1], selectedImage.index - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                  >
                    <LucideIcon name="caretleft" size="xl" />
                  </button>
                )}
                {selectedImage.index < images.length - 1 && (
                  <button
                    onClick={() => handleImageClick(images[selectedImage.index + 1], selectedImage.index + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                  >
                    <LucideIcon name="caretright" size="xl" />
                  </button>
                )}
              </>
            )}

            {/* Bottom Info Panel */}
            <div className="absolute -bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Image {selectedImage.index + 1}
                    {selectedImage.alt && ` • ${selectedImage.alt}`}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Click and drag to move • Use arrow keys to navigate</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {showControls && onUpdateAlt && (
                    <button
                      onClick={() => {
                        const newAlt = prompt('Enter alt text:', selectedImage.alt || '');
                        if (newAlt !== null) {
                          onUpdateAlt(selectedImage.index, newAlt);
                          setSelectedImage({ ...selectedImage, alt: newAlt });
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <LucideIcon name="pencil" size="sm" />
                      Edit Alt Text
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageThumbnailGallery;
