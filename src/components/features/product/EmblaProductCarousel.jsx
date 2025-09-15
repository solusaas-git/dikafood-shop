import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import HeroProductCard from '@/components/ui/product/HeroProductCard';
import { useTranslation } from '@/utils/i18n';
import translations from '@/components/sections/home/translations/ProductCarousel';
import PropTypes from 'prop-types';
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
  const [internalProducts, setInternalProducts] = useState(productsCache);
  const [activeVariants, setActiveVariants] = useState(activeVariantsCache);
  const [isVisible, setIsVisible] = useState(true); // Always start visible for mock products
  const isFullyLoaded = useRef(hasInitiallyLoaded);
  const carouselRef = useRef(null);
  const [shouldShowControls, setShouldShowControls] = useState(true);
  const {
    onLoaded,
    className,
    products: externalProducts,
    loading: externalLoading,
    onAddToCart,
  } = props || {};

  // Embla carousel setup with proper configuration for multiple slides
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: false,
    dragFree: false,
    loop: true,
    slidesToScroll: 1,
    startIndex: 0
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(true);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);


  // Use external products if provided, otherwise use internal state
  const products = (externalProducts && externalProducts.length > 0) ? externalProducts 
    : (internalProducts && internalProducts.length > 0) ? internalProducts 
    : [];
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
        if (onLoaded) onLoaded();
      }
      return;
    }

    // Set global flag
    hasInitiallyLoaded = true;
    // Set local flag
    isFullyLoaded.current = true;

    try {
      // Fetch featured variants instead of featured products
      const response = await api.getFeaturedVariants();

      if (response && response.success && response.data && response.data.length > 0) {
        console.log('Featured variants loaded:', response.data.length);
        
        // Variants from API are already properly formatted
        const processedVariants = response.data.filter(Boolean);
        
        // Update global cache
        productsCache = processedVariants;

        // Initialize active variants - each variant is already the active variant
        const initialVariants = {};
        processedVariants.forEach(variant => {
          const variantId = variant.id;
          // For variants, the variant itself is the active variant
          initialVariants[variantId] = variant.variants?.[0] || {
            _id: variant.variantId,
            id: variant.variantId,
            size: variant.size,
            price: variant.price,
            originalPrice: variant.originalPrice,
            promotionalPrice: variant.promotionalPrice,
            stock: variant.stock,
            sku: variant.sku,
            weight: variant.weight,
            dimensions: variant.dimensions,
            imageUrl: variant.image,
            imageUrls: variant.images,
            featured: variant.featured
          };
        });

        // Update global cache
        activeVariantsCache = initialVariants;

        // Set state
        setInternalProducts(processedVariants);
        setActiveVariants(initialVariants);
        setIsVisible(true);
        if (onLoaded) onLoaded();
      } else {
        console.log('No featured variants found');
        // No fallback - just show empty state
        setInternalProducts([]);
        setActiveVariants({});
        setIsVisible(true);
        if (onLoaded) onLoaded();
      }
    } catch (err) {
      console.error('Error fetching featured variants for hero carousel:', err);
      // No fallback - just show empty state on error
      setInternalProducts([]);
      setActiveVariants({});
      setIsVisible(true);
      if (onLoaded) onLoaded();
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
      // Fetch real featured variants from API
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

  // Debug render state

  // Loading state
  if (loading) {
    return (
      <div className={`w-full relative ${className || ''}`}>
        <div className="container relative flex justify-center">
          <div className="flex gap-4 overflow-hidden py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg w-[280px] h-[420px]"></div>
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
      className={`w-full relative pt-2 md:pt-3 ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="relative w-full md:w-[1450px] mx-auto flex justify-center" ref={carouselRef}>
        {/* Viewport */}
        <div className="overflow-hidden w-[248px] md:w-full md:max-w-[1500px]" ref={emblaRef}>
          {/* Container */}
          <div className="flex select-none pl-4 pr-4 md:pl-8 md:pr-8">
            {products.map(product => (
              <div
                className="relative min-w-0 w-[240px] md:w-[260px] flex-shrink-0 h-[340px] md:h-[360px] mr-3 md:mr-4"
                key={product._id || product.id || product.productId}
              >
                <div className="relative overflow-hidden h-full">
                  <HeroProductCard
                    product={product}
                    activeVariant={activeVariants[product._id || product.id || product.productId] || (product.variants && product.variants[0])}
                    onVariantChange={(variant) => handleVariantChange(product._id || product.id || product.productId, variant)}
                    onAddToCart={onAddToCart}
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
                className="absolute z-10 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-dark-green-7 shadow-lg hover:shadow-xl border border-dark-green-6/20 hover:border-dark-green-6/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-logo-lime/50 focus:ring-offset-2 backdrop-blur-sm left-4 md:left-8 lg:left-12 xl:left-16"
                onClick={scrollPrev}
                aria-label="Previous product"
                type="button"
              >
                <ArrowLeft weight="bold" size={20} className="text-dark-green-7" />
              </button>
              <button
                className="absolute z-10 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-dark-green-7 shadow-lg hover:shadow-xl border border-dark-green-6/20 hover:border-dark-green-6/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-logo-lime/50 focus:ring-offset-2 backdrop-blur-sm right-4 md:right-8 lg:right-12 xl:right-16"
                onClick={scrollNext}
                aria-label="Next product"
                type="button"
              >
                <ArrowRight weight="bold" size={20} className="text-dark-green-7" />
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
  loading: PropTypes.bool,
  onAddToCart: PropTypes.func
};

export default EmblaProductCarousel;