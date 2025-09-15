import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { Carousel } from '@/components/ui/data-display';
import HeroProductCard from '@/components/ui/product/HeroProductCard';
import { useTranslation } from '@/utils/i18n';
import translations from '@/components/sections/home/translations/ProductCarousel';
import PropTypes from 'prop-types';
import { api } from '@/services/api';

// Caching variables to avoid repeated fetches
let hasInitiallyLoaded = false;
let productsCache = [];
let activeVariantsCache = {};

/**
 * ProductCarousel component for the hero section
 * Displays featured products in a carousel
 */
const ProductCarousel = forwardRef(function ProductCarousel(props, ref) {
  const { t, locale } = useTranslation(translations);
  const [internalProducts, setInternalProducts] = useState(productsCache);
  const [activeVariants, setActiveVariants] = useState(activeVariantsCache);
  const [isVisible, setIsVisible] = useState(productsCache.length > 0);
  const isFullyLoaded = useRef(hasInitiallyLoaded);
  const {
    onLoaded,
    className,
    products: externalProducts,
    loading: externalLoading,
    trackClassName,
    controlsPosition,
    controlsClassName,
    controlSize
  } = props || {};

  // Use external products if provided, otherwise use internal state
  const products = externalProducts || internalProducts;
  const loading = externalLoading !== undefined ? externalLoading : false;

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
      // Fetch featured products
      const response = await api.getFeaturedProducts();

      if (response && response.success && response.data && response.data.length > 0) {
        const processedProducts = response.data;

        // Update global cache
        productsCache = processedProducts;

        // Initialize active variants
        const initialVariants = {};
        processedProducts.forEach(product => {
          const productId = product.productId || product.id;
          if (product.variants && product.variants.length > 0) {
            initialVariants[productId] = product.variants[0];
          }
        });

        // Update global cache
        activeVariantsCache = initialVariants;

        // Set state
        setInternalProducts(processedProducts);
        setActiveVariants(initialVariants);
        setIsVisible(true);
        if (onLoaded) onLoaded();
      } else {
        console.error(response?.message || t('errors.no_products'));
        setInternalProducts([]);
      }
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

  // CSS-based responsive item width - single card on mobile, multiple on desktop
  const itemWidth = "clamp(260px, 30vw, 320px)";

  return (
    <div
      className={`w-full relative h-[340px] md:h-[360px] ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <Carousel
        itemWidth={itemWidth}
        spacing="normal"
        snap="center"
        padding="default"
        autoScroll={false}
        showControls={true}
        controlSize={controlSize || "small"}
        controlVariant="lime"
        controlsPosition={controlsPosition || "middle"}
        controlsClassName={controlsClassName || "px-3 md:px-8"}
        className="product-carousel z-0 py-2 md:py-3 w-full mx-auto h-full flex justify-center"
        trackClassName={trackClassName || "justify-center items-center"}
      >
        {products.map(product => (
          <Carousel.Item key={product.id || product.productId} className="h-full">
            <HeroProductCard
              product={product}
              activeVariant={activeVariants[product.id || product.productId] || (product.variants && product.variants[0])}
              onVariantChange={(variant) => handleVariantChange(product.id || product.productId, variant)}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
});

ProductCarousel.propTypes = {
  onLoaded: PropTypes.func,
  className: PropTypes.string,
  products: PropTypes.array,
  loading: PropTypes.bool,
  trackClassName: PropTypes.string,
  controlsPosition: PropTypes.string,
  controlsClassName: PropTypes.string,
  controlSize: PropTypes.string
};

export default ProductCarousel;