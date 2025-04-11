import React, { useState } from 'react';
import { HeroBackground } from './components/Background/Background';
import { ProductCarousel } from './components/Carousel/Carousel';
import { ProductCard } from './components/Card/Card';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { carouselProducts } from '../data/carousel-products';
import './HeroShowcase.scss';

/**
 * Hero Showcase Component - Demonstrates the consolidated components
 */
export default function HeroShowcase() {
  const { isMobile, isTablet, isLaptop } = useBreakpoint();
  const [activeVariants, setActiveVariants] = useState(() => {
    // Initialize with first variant of each product
    const variants = {};
    carouselProducts.forEach(product => {
      if (product.variants?.length > 0) {
        variants[product.id] = product.variants[0];
      }
    });
    return variants;
  });

  const renderProduct = (product) => (
    <ProductCard
      key={product.id}
      product={product}
      activeVariant={activeVariants[product.id]}
      onVariantChange={(variant) => setActiveVariants(prev => ({
        ...prev,
        [product.id]: variant
      }))}
      className={isMobile ? 'mobile' : isTablet ? 'tablet' : ''}
    />
  );

  return (
    <div className="hero-showcase">
      <HeroBackground
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <div className="hero-content">
        <h1>Hero Section with Consolidated Components</h1>
        <p>This showcase demonstrates our consolidated component system</p>

        <ProductCarousel
          products={carouselProducts}
          renderProduct={renderProduct}
          className={isMobile ? 'mobile' : isTablet ? 'tablet' : ''}
        />
      </div>
    </div>
  );
}