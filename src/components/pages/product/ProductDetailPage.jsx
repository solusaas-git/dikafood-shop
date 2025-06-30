import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section } from '@components/ui/layout';
import { ProductBreadcrumb } from '@components/ui/product';
import { 
  ProductImageGallery,
  ProductPriceDisplay,
  ProductOptions,
  ProductActionButtons,
  ProductDetailsSection,
  ProductRatingCard,
  EmblaProductCarousel
} from '@/components/features/product';
import { ProductReviewsSection } from '@components/ui/product';
import { BrandDisplay } from '@/components/features/brand';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNotification } from '@/contexts/NotificationContextNew';
import { Icon } from '@/components/ui/icons';
import Button from '@/components/ui/inputs/Button';
import Page from '@components/ui/layout/Page';
import { Badge } from '@/components/ui/data-display';
import { api, getProductImageUrlById } from '@/services/api';
import reviewsData from '../../../data/reviews.json';
import SectionDecorations from '@components/ui/decorations/SectionDecorations';
import DrawerContainer from '@components/ui/layout/DrawerContainer';
import { eventBus, EVENTS, cartEvents } from '@/utils/eventBus';
import { useTranslation } from '@/utils/i18n';
import { scrollToTop } from '@/utils/scrollUtils';
import { cn } from '@/utils/cn';
import useBreakpoint from '@/hooks/useBreakpoint';

// Custom styles for section headers
const customSectionHeaderStyles = {
  container: "mb-4"
};

// AsyncImage component for loading product images using image IDs
function AsyncImage({ imageId, alt, className, ...props }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (imageId) {
      setLoading(true);
      setError(false);
      getProductImageUrlById(imageId)
        .then(url => {
          if (mounted) {
            setSrc(url);
            setLoading(false);
          }
        })
        .catch(err => {
          if (mounted) {
            setError(true);
            setLoading(false);
            setSrc('/images/placeholder-product.png');
          }
        });
    } else {
      setSrc('/images/placeholder-product.png');
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [imageId]);

  if (loading) {
    return (
      <div className={`bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 ${className}`} {...props}>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error && !src) {
    return (
      <div className={`bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 ${className}`} {...props}>
        No Image
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} {...props} />;
}

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Add resize listener for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch product data when component mounts or productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.getProduct(productId);
        if (!response.success || !response.data || !response.data.product) {
          setError(response.message || 'Failed to fetch product');
          setLoading(false);
          return;
        }
        // Process the product data to match component expectations
        const processedProduct = processProductData(response.data.product);
        setProduct(processedProduct);
        setError(null);
      } catch (err) {
        // Silently handle errors - they're already being shown via notifications
        setError('An error occurred while fetching the product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      
      setRelatedLoading(true);
      try {
        // Fetch featured products as related products
        const response = await api.getFeaturedProducts();
        
        if (response.success && response.data) {
          // Handle different response structures
          let productsArray = [];
          
          if (Array.isArray(response.data)) {
            // Direct array format
            productsArray = response.data;
          } else if (Array.isArray(response.data.products)) {
            // Nested products array format
            productsArray = response.data.products;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // Double nested format
            productsArray = response.data.data;
          }
          
          // Transform backend response to match carousel format
          const transformedProducts = productsArray
            .filter(p => p && p._id !== product.id) // Exclude current product and filter out null/undefined
            .map(transformProductForCarousel)
            .slice(0, 5); // Limit to 5 products
          
          setRelatedProducts(transformedProducts);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Helper function to extract image ID from URL
  const extractImageIdFromUrl = (url) => {
    if (!url) return null;
    // Extract image ID from various URL formats
    if (url.includes('/api/files/product-images/')) {
      return url.split('/').pop();
    }
    if (url.includes('/product-images/')) {
      return url.split('/').pop();
    }
    // If it's already an ID (no slashes), return as is
    if (!url.includes('/')) {
      return url;
    }
    // Fallback: return the last part of the URL
    return url.split('/').pop();
  };

  // Transform backend product data for carousel
  const transformProductForCarousel = (backendProduct) => {
    // Get the first variant for display
    const firstVariant = backendProduct.variants?.[0];
    
    return {
      id: backendProduct._id,
      productId: backendProduct._id,
      name: `${backendProduct.brandDisplayName} ${backendProduct.category} ${firstVariant?.size || ''}`.trim(),
      title: `${backendProduct.brandDisplayName} ${backendProduct.category} ${firstVariant?.size || ''}`.trim(),
      brand: backendProduct.brand,
      brandDisplayName: backendProduct.brandDisplayName,
      category: backendProduct.category,
      description: backendProduct.description,
      imageId: extractImageIdFromUrl(firstVariant?.imageUrl) || null,
      price: firstVariant?.price || 0,
      unitPrice: firstVariant?.price || 0,
      inStock: (firstVariant?.stock || 0) > 0,
      stock: firstVariant?.stock || 0,
      featured: backendProduct.featured,
      variants: backendProduct.variants?.map(variant => ({
        id: `${backendProduct._id}-${variant.size}`,
        variantId: `${backendProduct._id}-${variant.size}`,
        _id: variant._id,
        name: variant.size,
        size: variant.size,
        price: variant.price,
        unitPrice: variant.price,
        stock: variant.stock,
        inStock: variant.stock > 0,
        imageId: extractImageIdFromUrl(variant.imageUrl) || null,
        imageUrls: variant.imageUrls
      })) || []
    };
  };

  // Process product data to match component expectations
  const processProductData = (rawProduct) => {
    if (!rawProduct) return null;

    // Variants: ensure each has an id and name, and extract imageId from imageUrl
    const processedVariants = (rawProduct.variants || []).map(variant => ({
      ...variant,
      id: variant._id,
      name: variant.size || variant.name,
      imageId: extractImageIdFromUrl(variant.imageUrl)
    }));

    // Images: extract image IDs from URLs, wrap as objects for gallery
    const images = (rawProduct.images || []).map((img, idx) => ({
      imageId: extractImageIdFromUrl(img),
      variant: processedVariants[idx]?.size || 'main'
    }));

    // If no images from rawProduct.images, try to get from variants
    const finalImages = images.length > 0 ? images : 
      processedVariants.map(variant => ({
        imageId: variant.imageId,
        variant: variant.size || variant.name || 'default'
      })).filter(img => img.imageId);

    // Features and benefits: merge for display
    const features = [
      ...(rawProduct.features || []),
      ...(rawProduct.benefits || [])
    ];

    // Nutritional info as details
    const details = {};
    if (rawProduct.nutritionalInfo) {
      Object.entries(rawProduct.nutritionalInfo).forEach(([key, value]) => {
        details[key] = value;
      });
    }

    return {
      ...rawProduct,
      id: rawProduct._id,
      variants: processedVariants,
      images: finalImages.length > 0 ? finalImages : [{ imageId: null, variant: 'default' }],
      features,
      additionalDetails: details,
      description: rawProduct.description || '',
      price: processedVariants[0]?.price || 0,
      relatedProducts: rawProduct.relatedProducts || []
    };
  };

  // Extended reviews array for a more continuous carousel effect with unique keys
  const extendedReviews = product && reviewsData && Array.isArray(reviewsData) ?
    [
      ...(product.reviews || []).map((review, index) => ({ ...review, key: `product-${review.id || index}` })),
      ...reviewsData.map((review, index) => ({ ...review, key: `data-${review.id || index}` })),
      ...reviewsData.slice(0, 3).map((review, index) => ({ ...review, key: `extra-${review.id || index}` }))
    ] :
    (product?.reviews || []).map((review, index) => ({ ...review, key: `product-${review.id || index}` }));

  // State for UI interactions
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize selected variant when product changes
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Find default variant or use first one
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [product]);

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    // Find matching image for this variant if available
    const variantImageIndex = product.images?.findIndex(img =>
      img.variant && img.variant.toLowerCase() === (variant.size || variant.name).toLowerCase()
    );
    if (variantImageIndex !== -1) {
      setSelectedImage(variantImageIndex);
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  // Handle image selection
  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  // Action handlers
  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    try {
      // Use the CartContext which has proper brand extraction logic
      await addToCart({
        product: product,
        productId: product.id || product.productId,
        variant: selectedVariant,
        size: selectedVariant.size || selectedVariant.name || '500ML',
        quantity: quantity
      });

      // Use event bus to notify that an item was added to cart
      cartEvents.itemAdded({ product, variant: selectedVariant });

    } catch (error) {
      console.error('Error adding product to cart:', error);
      // Handle error
    }
  };

  const handleBuyNow = () => {
    console.log('Buy now:', {
      product: product.name,
      variant: selectedVariant.name,
      quantity: quantity
    });
    // Implement checkout redirection here
  };

  if (loading) {
    return (
      <Section
        className="py-8 relative overflow-hidden flex items-center justify-center min-h-[400px]"
        fullWidth
        width="full"
        style={{
          background: "linear-gradient(to bottom right, rgba(235, 235, 71, 0.05), rgba(235, 235, 71, 0.1), rgba(235, 235, 71, 0.05))"
        }}
      >
        {/* Section Decorations with white variant for dark background */}
        <SectionDecorations
          variant="white"
          positions={['bottom-right']}
          customStyles={{
            bottomRight: {
              opacity: 0.15,
              transform: 'scale(1.2) translate(20px, 20px)'
            }
          }}
        />

        <div className="container max-w-6xl mx-auto px-8 md:px-12 lg:px-16 relative z-10 flex flex-col items-center justify-center">
          <div className="w-24 h-24 relative animate-pulse">
            <img
              src="/favicon.svg"
              alt="Loading"
              className="w-full h-full animate-spin-slow"
              style={{
                animationDuration: '3s',
                filter: 'drop-shadow(0 0 8px rgba(168, 203, 56, 0.5))'
              }}
            />
          </div>
          <p className="text-dark-green-7 mt-4 font-medium">Chargement du produit...</p>
            </div>
      </Section>
    );
  }

  if (error || !product) {
    return (
      <Section
        className="py-8 relative overflow-hidden flex items-center justify-center min-h-[400px]"
        fullWidth
        width="full"
        style={{
          background: "linear-gradient(to bottom right, rgba(235, 235, 71, 0.05), rgba(235, 235, 71, 0.1), rgba(235, 235, 71, 0.05))"
        }}
      >
        <SectionDecorations
          variant="white"
          positions={['bottom-right']}
          customStyles={{
            bottomRight: {
              opacity: 0.15,
              transform: 'scale(1.2) translate(20px, 20px)'
            }
          }}
        />

        <div className="container max-w-6xl mx-auto px-8 md:px-12 lg:px-16 relative z-10 flex flex-col items-center justify-center">
          <div className="w-24 h-24 relative">
            <img
              src="/favicon.svg"
              alt="Error"
              className="w-full h-full opacity-50"
              style={{
                filter: 'grayscale(50%) drop-shadow(0 0 8px rgba(168, 203, 56, 0.3))'
              }}
            />
          </div>
          <h2 className="text-2xl font-bold mt-6 mb-2 text-dark-green-7">Produit non trouvé</h2>
          <p className="text-gray-600 mb-6 text-center">{error || 'Le produit demandé n\'a pas pu être trouvé.'}</p>
          <a href="/produits" className="bg-logo-lime/80 text-dark-green-7 px-6 py-3 rounded-full hover:bg-logo-lime transition-colors shadow-sm">
            Retour aux produits
          </a>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Use the ProductBreadcrumb component */}
      <ProductBreadcrumb product={product} isMobile={isMobile} className={isMobile ? "pt-4" : ""} />

      {/* Mobile Product Title - Only visible on mobile */}
      {isMobile && (
        <div className="container max-w-7xl mx-auto px-4 mb-0 mt-0 !pt-[160px]">
          <h1 className="text-2xl font-normal text-dark-green-7 mb-2 pb-2 border-b border-logo-lime/30">{product.name}</h1>
        </div>
      )}

      {/* Main product section */}
      <Section
        className="py-4 md:py-8 relative overflow-hidden md:!pt-[200px]"
        fullWidth
        width="full"
        style={{
          background: "linear-gradient(to bottom right, rgba(235, 235, 71, 0.05), rgba(235, 235, 71, 0.1), rgba(235, 235, 71, 0.05))"
        }}
      >
        {/* Section Decorations with white variant for dark background */}
        <SectionDecorations
          variant="white"
          positions={['bottom-right']}
          customStyles={{
            bottomRight: {
              opacity: 0.15,
              transform: 'scale(1.2) translate(20px, 20px)'
            }
          }}
        />

        <div className="container max-w-6xl mx-auto px-8 md:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:border-t md:border-logo-lime/30 md:pt-6">
            {/* Left Column: Product Images and Rating */}
            <div className={`md:self-start ${isMobile ? '' : 'border-r border-logo-lime/30 pr-8'}`}>
              <ProductImageGallery
                images={
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images.map(img => ({
                        imageId: img.imageId || null,
                        url: img.url || '/images/placeholder-product.png',
                        variant: img.variant || 'default'
                      }))
                    : [{ imageId: null, url: '/images/placeholder-product.png', variant: 'default' }]
                }
                selectedImage={selectedImage}
                onSelectImage={handleImageSelect}
                productName={product.name}
                selectedVariant={selectedVariant?.name || ''}
                variants={product.variants || []}
                onVariantSelect={handleVariantSelect}
                isMobile={isMobile}
              />

              {/* Brand Display for Mobile - Between Gallery and Rating */}
              {isMobile && (
                <div className="mt-4 mb-4">
                  <BrandDisplay
                    brand={product.brand}
                    size="large"
                    fullWidth={true}
                    className="w-full"
                    isMobile={true}
                  />
                </div>
              )}

              {/* Rating moved below the gallery */}
              <ProductRatingCard
                rating={product.rating}
                reviewCount={product.reviewCount || 69}
                reviews={[]}
                useMockData={true}
                className="mt-4"
              />
            </div>

            {/* Right Column: Product Info */}
            <div>
              {/* Desktop Product Title - Only visible on desktop */}
              {!isMobile && (
                <>
                  <h1 className="text-3xl font-normal text-dark-green-7 mb-3 pb-2 border-b border-logo-lime/30">{product.name}</h1>

                  {/* Brand and Price Row */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <ProductPriceDisplay
                      price={selectedVariant ? selectedVariant.price : product.price}
                      currency={product.currency || "MAD"}
                      isDiscounted={selectedVariant?.originalPrice > 0}
                      originalPrice={selectedVariant?.originalPrice}
                      highlight={true}
                      className="flex-shrink-0"
                    />
                    <BrandDisplay
                      brand={product.brand}
                      size="large"
                      className="flex-shrink-0"
                    />
                  </div>
                </>
              )}

              {/* Product Options - Only show on desktop */}
              {!isMobile && (
                <ProductOptions
                  variants={product.variants || []}
                  selectedVariant={selectedVariant}
                  onVariantSelect={handleVariantSelect}
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  className="mt-6"
                />
              )}

              {/* Action Buttons - Only show on desktop */}
              {!isMobile && (
                <ProductActionButtons
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  className="mt-8"
                />
              )}

              {/* Product Details */}
              <ProductDetailsSection
                description={product.description}
                features={product.features}
                additionalDetails={product.additionalDetails}
                isDescriptionOpen={isDescriptionOpen}
                setIsDescriptionOpen={setIsDescriptionOpen}
                isDetailsOpen={isDetailsOpen}
                setIsDetailsOpen={setIsDetailsOpen}
                className={isMobile ? "mt-4" : "mt-8"}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Reviews Section */}
      <ProductReviewsSection
        reviews={extendedReviews}
            isPaused={isPaused}
        setIsPaused={setIsPaused}
        product={product}
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <Section
          className="py-8 md:py-12 relative overflow-hidden"
          fullWidth
          width="full"
          style={{
            background: "linear-gradient(to bottom right, rgba(235, 235, 71, 0.02), rgba(235, 235, 71, 0.05), rgba(235, 235, 71, 0.02))"
          }}
        >
          <SectionDecorations
            variant="white"
            positions={['top-left']}
            customStyles={{
              topLeft: {
                opacity: 0.1,
                transform: 'scale(0.8) translate(-20px, -20px)'
              }
            }}
          />

          <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-normal text-dark-green-7 mb-3">
                Produits Similaires
              </h2>
              <p className="text-dark-green-6 max-w-2xl mx-auto">
                Découvrez d'autres produits qui pourraient vous intéresser
              </p>
            </div>

            {/* Products Carousel */}
            <EmblaProductCarousel
              products={relatedProducts}
              loading={relatedLoading}
              className="related-products-carousel"
            />
          </div>
        </Section>
      )}

      {/* Mobile Drawer Container for quick actions */}
      {isMobile && (
        <DrawerContainer
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onVariantSelect={handleVariantSelect}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </>
  );
};

export default ProductDetailPage;