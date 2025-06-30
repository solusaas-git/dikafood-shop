import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { Carousel } from '../../../ui/data-display';
import HeroProductCard from '../../../ui/product/HeroProductCard';
import { useTranslation } from '../../../../utils/i18n';
import translations from '../translations/ProductCarousel';
import PropTypes from 'prop-types';
import useBreakpoint from '../../../../hooks/useBreakpoint';
import { api } from '@/services/api';

// Caching variables to avoid repeated fetches
// Reset cache to ensure formatProductData changes take effect
let hasInitiallyLoaded = false;
let productsCache = [];
let activeVariantsCache = {};

/**
 * ProductCarousel component for the hero section
 * Displays featured products in a carousel
 */
const ProductCarousel = forwardRef(function ProductCarousel(props, ref) {
  const { t, locale } = useTranslation(translations);
  const { isMobile, isTablet } = useBreakpoint();
  const [products, setProducts] = useState(productsCache);
  const [activeVariants, setActiveVariants] = useState(activeVariantsCache);
  const [isVisible, setIsVisible] = useState(productsCache.length > 0);
  const isFullyLoaded = useRef(hasInitiallyLoaded);
  const { onLoaded, className } = props || {};

  // Function to handle variant changes
  const handleVariantChange = useCallback((productId, variant) => {
    setActiveVariants((prev) => {
      const newActiveVariants = { ...prev, [productId]: variant };
      // Update global cache
      activeVariantsCache = newActiveVariants;
      return newActiveVariants;
    });
  }, []);

  // Fetch products on mount
  const fetchProducts = useCallback(async () => {
    // Force refresh in development to pick up formatProductData changes
    const forceRefresh = import.meta.env.DEV && !productsCache.some(p => p.variants?.[0]?.image);
    
    // Skip if we've already loaded products (unless forcing refresh)
    if (!forceRefresh && (isFullyLoaded.current || hasInitiallyLoaded || productsCache.length > 0)) {
      if ((hasInitiallyLoaded || productsCache.length > 0) && products.length === 0) {
        console.log('Using cached products:', productsCache.length);
        setProducts(productsCache);
        setActiveVariants(activeVariantsCache);
        setIsVisible(true);
        if (onLoaded) setTimeout(() => onLoaded(), 300);
      }
      return;
    }
    
    console.log('Fetching fresh products data...');

    // Set global flag
    hasInitiallyLoaded = true;
    // Set local flag
    isFullyLoaded.current = true;

    try {
      // Fetch featured products
      const response = await api.getFeaturedProducts();

      if (response && response.success && response.data && response.data.length > 0) {
        console.log('Raw API data:', response.data[0]);
        
        // Products from new API are already properly formatted
        const processedProducts = response.data.filter(Boolean);
        
        console.log('Product data:', processedProducts[0]);

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
        setProducts(processedProducts);
        setActiveVariants(initialVariants);
        setIsVisible(true);
        if (onLoaded) setTimeout(() => onLoaded(), 300);
      } else {
        console.error(response?.message || t('errors.no_products'));
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products for hero carousel:', err);
      setProducts([]);
    }
  }, [t, products.length, onLoaded]);

  // Fetch products on mount
  useEffect(() => {
    // Start animation immediately if we already have cached data
    if (productsCache.length > 0) {
      setIsVisible(true);
      setProducts(productsCache);
      setActiveVariants(activeVariantsCache);
      if (onLoaded) setTimeout(() => onLoaded(), 300);
    } else if (hasInitiallyLoaded) {
      setIsVisible(true);
      if (onLoaded) setTimeout(() => onLoaded(), 300);
    } else {
      fetchProducts();
    }
  }, [fetchProducts, onLoaded]);

  // Empty state
  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full relative h-[calc(var(--product-card-height)+32px)] ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container relative flex justify-center">
        <Carousel
          itemWidth="clamp(260px, 70vw, 280px)"
          spacing="normal"
          snap="center"
          padding="default"
          autoScroll={false}
          showControls={true}
          controlSize="small"
          controlVariant="lime"
          controlsPosition="middle"
          controlsClassName="px-8"
          className="product-carousel z-0 py-3 w-full mx-0 justify-center"
          trackClassName="flex justify-center"
        >
          {products.map(product => (
            <Carousel.Item key={product.id} className="h-full">
              <div className="h-[400px]">
                <HeroProductCard
                  product={product}
                  activeVariant={activeVariants[product.id] || product.variants[0]}
                  onVariantChange={(variant) => handleVariantChange(product.id, variant)}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
});

ProductCarousel.propTypes = {
  onLoaded: PropTypes.func,
  className: PropTypes.string
};

export default ProductCarousel;