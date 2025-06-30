import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/utils/cn';
import { ProductCarousel } from '@/components/features/product';
import SectionHeader from '@/components/ui/layout/SectionHeader';
import SectionDecorations from '@/components/ui/decorations/SectionDecorations';
import { api } from '@/services/api';
import { mockRelatedProducts } from '@/data/mockProductData';

/**
 * ProductRecommendationsSection component
 * Displays related products in a carousel
 */
const ProductRecommendationsSection = ({ isMobile, className, productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVariants, setActiveVariants] = useState({});
  const [useMockData, setUseMockData] = useState(false);

  // Fetch related products when component mounts or productId changes
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        // Since we don't have getRelatedProducts, use featured products as fallback
        const response = await api.getFeaturedProducts();
        if (response && response.success && response.data && response.data.length > 0) {
          // Filter out the current product and limit to 5
          const products = response.data.filter(p => p.id !== productId).slice(0, 5);
          setRelatedProducts(products);

          // Initialize active variants
          const initialVariants = {};
          products.forEach(product => {
            const productId = product.productId || product.id;
            if (product.variants && product.variants.length > 0) {
              initialVariants[productId] = product.variants[0];
            }
          });
          setActiveVariants(initialVariants);
        } else {
          // Fallback to mock data if API returns empty
          setRelatedProducts(mockRelatedProducts);
          setUseMockData(true);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError(err.message || 'Failed to fetch related products');

        // Fallback to mock data on error
        setRelatedProducts(mockRelatedProducts);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  // Don't render the section if there are no related products and we're not loading
  if (!loading && relatedProducts.length === 0) {
    return null;
  }

  // Handle variant changes
  const handleVariantChange = (productId, variant) => {
    setActiveVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  };

  return (
    <section className={cn('py-12 md:py-16 relative overflow-hidden', className)}>
      <SectionDecorations variant="light" />

      <div className="container relative z-10">
        <SectionHeader
          title="Vous pourriez aussi aimer"
          subtitle="Découvrez des produits similaires à celui que vous consultez"
          titleClassName={cn(
            'text-2xl md:text-3xl font-bold text-center',
            isMobile ? 'mb-2' : 'mb-3'
          )}
          subtitleClassName={cn(
            'text-sm md:text-base text-gray-600 text-center',
            isMobile ? 'mb-6' : 'mb-8'
          )}
          className="mb-6 md:mb-10"
        />

        <ProductCarousel
          products={relatedProducts}
          loading={loading}
          controlsPosition="bottom"
          controlsClassName="mt-6"
          className={cn(
            'w-full',
            isMobile ? 'px-0' : 'px-4'
          )}
        />
      </div>
    </section>
  );
};

ProductRecommendationsSection.propTypes = {
  isMobile: PropTypes.bool,
  className: PropTypes.string,
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default ProductRecommendationsSection;