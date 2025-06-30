import React, { useState, useEffect, useCallback } from 'react';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import useEmblaCarousel from 'embla-carousel-react';
import { CaretLeft, CaretRight, MagnifyingGlass } from '@phosphor-icons/react';
import './ProductGallery.scss';

const ProductGallery = ({ product, initialVariant }) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  // Determine if we should use the mobile layout
  const useMobileLayout = isMobile || isTablet;

  // Set up Embla Carousel for thumbnails with improved options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: 'keepSnaps',
    align: 'center',
    slidesToScroll: 1
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Function to scroll to the selected variant thumbnail
  const scrollToVariant = useCallback((index) => {
    if (!emblaApi) return;

    // Scroll to the selected variant's thumbnail
    emblaApi.scrollTo(index, true);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Setup event listeners
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Update when variants or selected variant changes
  useEffect(() => {
    if (!initialVariant || !product?.variants) return;

    // Find the index of the initial variant
    const variantIndex = product.variants.findIndex(v => v.id === initialVariant.id);
    if (variantIndex >= 0) {
      setSelectedVariant(initialVariant);
      setSelectedImage(variantIndex);

      // Wait for emblaApi to be ready, then scroll to the variant
      if (emblaApi) {
        setTimeout(() => {
          scrollToVariant(variantIndex);
        }, 100);
      }
    }
  }, [initialVariant, product, emblaApi, scrollToVariant]);

  if (!product) return null;

  const variants = product.variants || [];
  // If no selected variant, use the first one or the product's image
  const currentVariant = selectedVariant || (variants.length > 0 ? variants[0] : null);
  const currentImage = currentVariant ? currentVariant.image : product.image;

  const handleThumbnailClick = (variant, index) => {
    setSelectedVariant(variant);
    setSelectedImage(index);

    // Scroll to the selected thumbnail in the carousel
    if (emblaApi) {
      scrollToVariant(index);
    }
  };

  const toggleZoom = () => {
    setShowZoom(!showZoom);
  };

  // For zoom functionality
  const handleImageMouseMove = (e) => {
    if (!showZoom) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;

    e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
  };

  // Render the desktop layout
  const renderDesktopLayout = () => (
    <div className="product-gallery-desktop">
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

  // Render the mobile layout with carousel
  const renderMobileLayout = () => (
    <div className="product-gallery-mobile">
      <div className={`main-image-container ${showZoom ? 'zoomed' : ''}`} onClick={toggleZoom}>
        <div
          className="main-image"
          onMouseMove={handleImageMouseMove}
        >
          <img src={currentImage} alt={product.name} />
          <div className="zoom-indicator">
            <MagnifyingGlass size={24} weight="light" />
          </div>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="thumbnails-container">
          <button
            className={`carousel-button prev ${!prevBtnEnabled ? 'disabled' : ''}`}
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous images"
          >
            <CaretLeft size={24} weight="bold" />
          </button>

          <div className="embla" ref={emblaRef}>
            <div className="embla__container thumbnails">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className={`embla__slide thumbnail ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(variant, index)}
                >
                  <div className="thumbnail-inner">
                    <img src={variant.image} alt={`${product.name} - ${variant.size}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`carousel-button next ${!nextBtnEnabled ? 'disabled' : ''}`}
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next images"
          >
            <CaretRight size={24} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`product-gallery ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}>
      {useMobileLayout ? renderMobileLayout() : renderDesktopLayout()}
    </div>
  );
};

export default ProductGallery;