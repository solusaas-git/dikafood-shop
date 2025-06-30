import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import HeroProductCard from '@/components/ui/product/HeroProductCard';
import { useTranslation } from '@/utils/i18n';
import translations from '@/components/sections/home/translations/ProductCarousel';
import PropTypes from 'prop-types';
import useBreakpoint from '@/hooks/useBreakpoint';
import { api } from '@/services/api';
import { Icon } from '@/components/ui/icons';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

// Caching variables to avoid repeated fetches
let hasInitiallyLoaded = false;
let productsCache = [];
let activeVariantsCache = {};

/**
 * EmblaProductCarousel component for the hero section
 * Displays featured products in a carousel using Embla Carousel
 */
const EmblaProductCarousel = React.forwardRef(function EmblaProductCarousel(props, ref) {
  const { t, locale } = useTranslation(translations);
  const { isMobile, isTablet } = useBreakpoint();
  const [internalProducts, setInternalProducts] = useState(productsCache);
  const [activeVariants, setActiveVariants] = useState(activeVariantsCache);
  const [isVisible, setIsVisible] = useState(productsCache.length > 0);
  const isFullyLoaded = useRef(hasInitiallyLoaded);
  const carouselRef = useRef(null);
  const [shouldShowControls, setShouldShowControls] = useState(true);
  const {
    onLoaded,
    className,
    products: externalProducts,
    loading: externalLoading,
  } = props || {};

  // Embla carousel setup with loop enabled and adjusted options based on screen size
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: isMobile ? 'center' : 'center',
    containScroll: 'trimSnaps',
    dragFree: !isMobile,
    loop: true,
    slidesToScroll: 1
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(true);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Use external products if provided, otherwise use internal state
  const products = externalProducts || internalProducts;
  const loading = externalLoading !== undefined ? externalLoading : false;

  // Check if all slides are visible (optimized with throttling)
  const checkIfAllSlidesVisible = useCallback(() => {
    if (!emblaApi || !carouselRef.current) return;

    // Use requestAnimationFrame to batch DOM reads
    requestAnimationFrame(() => {
      if (!emblaApi || !carouselRef.current) return;
      
      // Get the container width
      const containerWidth = carouselRef.current.clientWidth;

      // Get the total width of all slides
      const slidesWidth = emblaApi.slideNodes().reduce((total, slide) => {
        return total + slide.offsetWidth;
      }, 0);

      // If all slides fit within the container, hide controls
      setShouldShowControls(slidesWidth > containerWidth);
    });
  }, [emblaApi]);

  // Throttled version to prevent excessive calls
  const throttledCheckIfAllSlidesVisible = useCallback(() => {
    if (checkIfAllSlidesVisible._throttleTimer) return;
    
    checkIfAllSlidesVisible._throttleTimer = setTimeout(() => {
      checkIfAllSlidesVisible();
      checkIfAllSlidesVisible._throttleTimer = null;
    }, 100); // Throttle to 10fps for resize events
  }, [checkIfAllSlidesVisible]);

  // Function to handle variant changes
  const handleVariantChange = useCallback((productId, variant) => {
    setActiveVariants((prev) => {
      const newActiveVariants = { ...prev, [productId]: variant };
      // Update global cache if using internal products
      if (!externalProducts) {
        activeVariantsCache = newActiveVariants;
      }
      return newActiveVariants;
    });
  }, [externalProducts]);

  // Initialize active variants when products change
  useEffect(() => {
    if (externalProducts && externalProducts.length > 0) {
      const initialVariants = {};
      externalProducts.forEach(product => {
        const productId = product.productId || product.id;
        if (product.variants && product.variants.length > 0) {
          initialVariants[productId] = product.variants[0];
        }
      });
      setActiveVariants(initialVariants);
      setIsVisible(true);
    }
  }, [externalProducts]);

  // Fetch products on mount if no external products provided
  const fetchProducts = useCallback(async () => {
    // Skip if external products are provided or we've already loaded products
    if (externalProducts || isFullyLoaded.current || hasInitiallyLoaded || productsCache.length > 0) {
      if ((hasInitiallyLoaded || productsCache.length > 0) && internalProducts.length === 0) {
        setInternalProducts(productsCache);
        setActiveVariants(activeVariantsCache);
        setIsVisible(true);
        if (onLoaded) setTimeout(() => onLoaded(), 300);
      }
      return;
    }

    // Set global flag
    hasInitiallyLoaded = true;
    // Set local flag
    isFullyLoaded.current = true;

    try {
      // Fetch featured products
      const response = await api.getFeaturedProducts();

      // Use the new backend response structure
      const productsArray = Array.isArray(response.data?.products) ? response.data.products : [];
      const formattedProducts = productsArray.filter(Boolean);
        
        // Update global cache
        productsCache = formattedProducts;

        // Initialize active variants
        const initialVariants = {};
        formattedProducts.forEach(product => {
          const productId = product.productId || product.id;
          if (product.variants && product.variants.length > 0) {
            initialVariants[productId] = product.variants[0];
          }
        });

        // Update global cache
        activeVariantsCache = initialVariants;

        // Set state
        setInternalProducts(formattedProducts);
        setActiveVariants(initialVariants);
        setIsVisible(true);
        if (onLoaded) setTimeout(() => onLoaded(), 300);
    } catch (err) {
      console.error('Error fetching products for hero carousel:', err);
      setInternalProducts([]);
    }
  }, [t, internalProducts.length, onLoaded, externalProducts]);

  // Fetch products on mount if no external products provided
  useEffect(() => {
    // If external products are provided, don't fetch
    if (externalProducts) {
      setIsVisible(true);
      if (onLoaded) setTimeout(() => onLoaded(), 300);
      return;
    }

    // Start animation immediately if we already have cached data
    if (productsCache.length > 0) {
      setIsVisible(true);
      setInternalProducts(productsCache);
      setActiveVariants(activeVariantsCache);
      if (onLoaded) setTimeout(() => onLoaded(), 300);
    } else if (hasInitiallyLoaded) {
      setIsVisible(true);
      if (onLoaded) setTimeout(() => onLoaded(), 300);
    } else {
      fetchProducts();
    }
  }, [fetchProducts, onLoaded, externalProducts]);

  // Embla carousel navigation buttons
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  // Check if all slides are visible and handle button states
  useEffect(() => {
    if (!emblaApi) return;

    // For infinite loop, we can always scroll in both directions
    setPrevBtnEnabled(true);
    setNextBtnEnabled(true);

    // Check if all slides are visible
    checkIfAllSlidesVisible();

    // Add event listeners for resize and slide changes with throttling
    window.addEventListener('resize', throttledCheckIfAllSlidesVisible, { passive: true });
    emblaApi.on('reInit', () => {
      setPrevBtnEnabled(true);
      setNextBtnEnabled(true);
      throttledCheckIfAllSlidesVisible();
    });

    return () => {
      window.removeEventListener('resize', throttledCheckIfAllSlidesVisible);
      
      // Clear any pending throttle timer
      if (checkIfAllSlidesVisible._throttleTimer) {
        clearTimeout(checkIfAllSlidesVisible._throttleTimer);
        checkIfAllSlidesVisible._throttleTimer = null;
      }
    };
  }, [emblaApi, checkIfAllSlidesVisible, throttledCheckIfAllSlidesVisible]);

  // Loading state
  if (loading) {
    return (
      <div className={`w-full relative ${className || ''}`}>
        <div className="container relative flex justify-center">
          <div className="flex gap-4 overflow-hidden py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg w-[280px] h-[400px]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full relative pt-4 md:pt-6 ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="relative w-full mx-auto px-4 md:px-10" ref={carouselRef}>
        {/* Viewport */}
        <div className="overflow-hidden w-full" ref={emblaRef}>
          {/* Container */}
          <div className="flex select-none -ml-2 md:-ml-2.5">
            {products.map(product => (
              <div
                className={`relative min-w-0 ${isMobile ? 'pl-2 w-[calc(100%-8px)]' : 'pl-2.5 w-[280px]'} md:w-[280px] flex-shrink-0 h-[400px]`}
                key={product._id || product.id || product.productId}
              >
                <div className="relative overflow-hidden px-1.5 h-full pt-2">
                  <HeroProductCard
                    product={product}
                    activeVariant={activeVariants[product._id || product.id || product.productId] || (product.variants && product.variants[0])}
                    onVariantChange={(variant) => handleVariantChange(product._id || product.id || product.productId, variant)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons - only shown when needed */}
        {shouldShowControls && (
          <>
            <button
              className="absolute z-10 top-1/2 -translate-y-1/2 left-0 md:left-2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-light-yellow-1 hover:bg-light-yellow-2 text-dark-green-7 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-light-yellow-2 focus:ring-offset-2 hover:border-2 hover:border-logo-lime/60 active:border-2 active:border-logo-lime active:shadow-[0_0_0_4px_rgba(203,245,0,0.3)]"
              onClick={scrollPrev}
              aria-label="Previous product"
              type="button"
            >
              <ArrowLeft weight="bold" size={24} className="text-dark-green-7" />
            </button>
            <button
              className="absolute z-10 top-1/2 -translate-y-1/2 right-0 md:right-2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-light-yellow-1 hover:bg-light-yellow-2 text-dark-green-7 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-light-yellow-2 focus:ring-offset-2 hover:border-2 hover:border-logo-lime/60 active:border-2 active:border-logo-lime active:shadow-[0_0_0_4px_rgba(203,245,0,0.3)]"
              onClick={scrollNext}
              aria-label="Next product"
              type="button"
            >
              <ArrowRight weight="bold" size={24} className="text-dark-green-7" />
            </button>
          </>
        )}
      </div>
    </div>
  );
});

EmblaProductCarousel.propTypes = {
  onLoaded: PropTypes.func,
  className: PropTypes.string,
  products: PropTypes.array,
  loading: PropTypes.bool
};

export default EmblaProductCarousel;