import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
// Removed useBreakpoint - using CSS-based responsive design

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

const ProductDetailPage = ({ productId, onLoadingChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get variant from URL search params
  const [urlVariantId, setUrlVariantId] = useState(null);
  
  useEffect(() => {
    // Extract variant from Next.js App Router search params
    const variantParam = searchParams.get('variant');
    
    if (variantParam) {
      // Decode the variant parameter
      const decodedVariant = decodeURIComponent(variantParam);
      setUrlVariantId(decodedVariant);
    } else {
      setUrlVariantId(null);
    }
  }, [searchParams]); // Depend on searchParams
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  // Removed local loading state - using global navigation loader instead
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Removed JavaScript-based mobile detection - using CSS responsive design

  // Fetch product data when component mounts or productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        return;
      }
      try {
        const response = await api.getProduct(productId);
        if (!response.success || !response.data) {
          setError(response.message || 'Failed to fetch product');
          return;
        }
        // Process the product data to match component expectations
        const processedProduct = processProductData(response.data);
        
        // Check if we should redirect from ID to slug for SEO
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
        const hasSlug = processedProduct.slug && processedProduct.slug !== productId;
        
        if (isObjectId && hasSlug) {
          // Redirect to slug-based URL for better SEO
          const currentUrl = new URL(window.location.href);
          const variantParam = currentUrl.searchParams.get('variant');
          const slugUrl = variantParam 
            ? `/produits/${processedProduct.slug}?variant=${encodeURIComponent(variantParam)}`
            : `/produits/${processedProduct.slug}`;
          
          // Use replace to avoid adding to browser history
          window.location.replace(slugUrl);
          return;
        }
        
        setProduct(processedProduct);
        setError(null);
        // Hide loading when product is successfully loaded
        if (onLoadingChange) onLoadingChange(false);
      } catch (err) {
        // Silently handle errors - they're already being shown via notifications
        setError('An error occurred while fetching the product');
        // Hide loading on error too
        if (onLoadingChange) onLoadingChange(false);
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
      name: backendProduct.name,
      title: backendProduct.name,
      brand: backendProduct.brand,
      brandDisplayName: backendProduct.brand,
      category: backendProduct.category,
      description: backendProduct.description,
      imageId: extractImageIdFromUrl(firstVariant?.imageUrl) || null,
      price: firstVariant?.price || 0,
      unitPrice: firstVariant?.price || 0,
      promotionalPrice: firstVariant?.promotionalPrice || null,
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
        promotionalPrice: variant.promotionalPrice || null,
        stock: variant.stock,
        inStock: variant.stock > 0,
        imageId: extractImageIdFromUrl(variant.imageUrl) || null,
        imageUrls: variant.imageUrls,
        featured: variant.featured || false
      })) || []
    };
  };

  // Process product data to match component expectations
  const processProductData = (rawProduct) => {
    if (!rawProduct) return null;

    // Variants: ensure each has an id and name, and use imageUrl directly
    const processedVariants = (rawProduct.variants || []).map(variant => ({
      ...variant,
      id: variant._id,
      name: variant.size || variant.name,
      imageUrl: variant.imageUrl || rawProduct.image || '/images/products/dika-500ML.webp'
    }));

    // Create images array from variants, but only include distinct images
    const legacyVariantImages = processedVariants.map((variant, index) => ({
      url: variant.imageUrl,
      variant: variant.size || variant.name || 'default',
      variantId: variant._id,
      variantIndex: index
    })).filter(img => img.url);

    // Remove duplicate images (same URL) but keep the mapping
    const uniqueVariantImages = [];
    const seenUrls = new Set();
    
    legacyVariantImages.forEach(img => {
      if (!seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        uniqueVariantImages.push(img);
      }
    });

    // If we have product images, map them to variants by index
    const productImages = (rawProduct.images || []).map((img, idx) => ({
      url: img,
      variant: processedVariants[idx]?.size || processedVariants[idx]?.name || `variant-${idx}`,
      variantId: processedVariants[idx]?._id,
      variantIndex: idx
    }));

    // Create comprehensive image gallery with both general and variant-specific images
    let finalImages = [];
    
    // 1. Add general product images (not variant-specific)
    const generalImages = (rawProduct.images || []).map((img, index) => ({
      url: img.url || img,
      variant: 'general',
      imageType: 'general',
      imageIndex: index,
      alt: img.alt || `Product image ${index + 1}`,
      isPrimary: img.isPrimary || false
    }));
    
    // 2. Add variant-specific images
    const variantImages = processedVariants.map((variant, variantIndex) => {
      // Get all images for this variant
      const variantImageUrls = variant.imageUrls || (variant.imageUrl ? [variant.imageUrl] : []);
      
      return variantImageUrls.map((imageUrl, imageIndex) => ({
        url: imageUrl,
        variant: variant.size || variant.name || `variant-${variantIndex}`,
        variantId: variant._id,
        variantIndex: variantIndex,
        imageType: 'variant',
        imageIndex: imageIndex,
        alt: `${variant.size || variant.name} - Image ${imageIndex + 1}`
      }));
    }).flat();
    
    // 3. Combine images: General images first, then variant images
    finalImages = [...generalImages, ...variantImages];
    
    // 4. Ensure we have at least one image
    if (finalImages.length === 0) {
      finalImages = [{ 
        url: '/images/products/dika-500ML.webp', 
        variant: 'default',
        imageType: 'fallback',
        imageIndex: 0,
        isPlaceholder: true,
        alt: 'Product placeholder'
      }];
    }
    
    


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
      images: finalImages.length > 0 ? finalImages : [{ url: '/images/products/dika-500ML.webp', variant: 'default' }],
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

  // Track if we've already processed the URL variant to avoid re-processing
  const [hasProcessedUrlVariant, setHasProcessedUrlVariant] = useState(false);

  // Initialize selected variant when product changes or URL variant is set
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      let targetVariant = null;
      
      // First priority: Use variant from URL if specified and not already processed
      if (urlVariantId && !hasProcessedUrlVariant) {
        targetVariant = product.variants.find(v => 
          v._id === urlVariantId || 
          v.id === urlVariantId ||
          (v.size || '').toLowerCase() === urlVariantId.toLowerCase() ||
          (v.name || '').toLowerCase() === urlVariantId.toLowerCase()
        );
        
        if (targetVariant) {
          setHasProcessedUrlVariant(true); // Mark as processed
        }
      }
      
      // Second priority: Find default variant (only if no URL variant was found)
      if (!targetVariant && !hasProcessedUrlVariant) {
        targetVariant = product.variants.find(v => v.isDefault);
        if (targetVariant) {
        }
      }
      
      // Final fallback: Use first variant (only if no URL variant was found)
      if (!targetVariant && !hasProcessedUrlVariant) {
        targetVariant = product.variants[0];
      }
      
      // Only set the variant if we found one and haven't processed URL variant yet
      if (targetVariant && (!hasProcessedUrlVariant || urlVariantId)) {
        setSelectedVariant(targetVariant);
        // Also trigger image selection for the variant (same logic as handleVariantSelect)
        if (urlVariantId && !hasProcessedUrlVariant) {
          
          // Find the best image to display for the selected variant
          const selectedVariantIndex = product.variants?.findIndex(v => v._id === targetVariant._id);
          
          if (selectedVariantIndex !== -1) {
            // Strategy 1: Find variant-specific images for this variant
            const variantSpecificImageIndex = product.images?.findIndex(img => 
              img.imageType === 'variant' && img.variantId === targetVariant._id
            );
            
            if (variantSpecificImageIndex !== -1) {
              setSelectedImage(variantSpecificImageIndex);
            } else {
              // Strategy 2: Find by variant name/size match
              const variantName = (targetVariant.size || targetVariant.name || '').toLowerCase();
              const imageByNameIndex = product.images?.findIndex(img => {
                const imgVariant = (img.variant || '').toLowerCase();
                return variantName && imgVariant && variantName === imgVariant;
              });
              
              if (imageByNameIndex !== -1) {
                setSelectedImage(imageByNameIndex);
              } else {
                // Strategy 3: Use primary general image if no variant-specific image found
                const primaryImageIndex = product.images?.findIndex(img => 
                  img.imageType === 'general' && img.isPrimary
                );
                
                if (primaryImageIndex !== -1) {
                  setSelectedImage(primaryImageIndex);
                } else {
                  // Final fallback: use first available image
                  setSelectedImage(0);
                }
              }
            }
          }
        }
      }
    }
  }, [product, urlVariantId, hasProcessedUrlVariant]);

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    
    
    // Find the best image to display for the selected variant
    const selectedVariantIndex = product.variants?.findIndex(v => v._id === variant._id);
    
    if (selectedVariantIndex !== -1) {
      // Strategy 1: Find variant-specific images for this variant
      const variantSpecificImageIndex = product.images?.findIndex(img => 
        img.imageType === 'variant' && img.variantId === variant._id
      );
      
      if (variantSpecificImageIndex !== -1) {
        setSelectedImage(variantSpecificImageIndex);
        return;
      }
      
      // Strategy 2: Find by variant name/size match
      const variantName = (variant.size || variant.name || '').toLowerCase();
      const imageByNameIndex = product.images?.findIndex(img => {
        const imgVariant = (img.variant || '').toLowerCase();
        return variantName && imgVariant && variantName === imgVariant;
      });
      
      if (imageByNameIndex !== -1) {
        setSelectedImage(imageByNameIndex);
        return;
      }
      
      // Strategy 3: Use primary general image if no variant-specific image found
      const primaryImageIndex = product.images?.findIndex(img => 
        img.imageType === 'general' && img.isPrimary
      );
      
      if (primaryImageIndex !== -1) {
        setSelectedImage(primaryImageIndex);
        return;
      }
    }
    
    // Final fallback: use first available image
    setSelectedImage(0);
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
      await addItem({
        product: product,
        productId: product.id || product.productId,
        variant: selectedVariant,
        size: selectedVariant.size || selectedVariant.name || '500ML',
        quantity: quantity
      });

      // Event is now automatically emitted by CartContext

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

  // Handle add to cart for related products
  const handleRelatedProductAddToCart = async (product, variant) => {
    try {
      // Use the selected variant or the first available variant
      const selectedVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);
      
      if (!selectedVariant) {
        showNotification('Erreur', 'Aucune variante disponible pour ce produit', 'error');
        return;
      }

      await addItem(product.id || product._id, selectedVariant._id, 1);
      showNotification('Succès', `${product.name} ajouté au panier`, 'success');
    } catch (error) {
      console.error('Error adding related product to cart:', error);
      showNotification('Erreur', 'Impossible d\'ajouter le produit au panier', 'error');
    }
  };

  // Return null when no product yet and no error (parent handles loading)
  if (!product && !error) {
    return null;
  }

  if (error) {
    return (
      <Section
        className="mt-20 relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-5rem)]"
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
          <Link href="/shop" className="bg-logo-lime/80 text-dark-green-7 px-6 py-3 rounded-full hover:bg-logo-lime transition-colors shadow-sm">
            Retour aux produits
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Use the ProductBreadcrumb component */}
      <ProductBreadcrumb product={product} className="pt-4" />

      {/* Main product section */}
      <Section
        className="py-6 md:py-8 relative overflow-hidden pt-[180px] md:pt-[240px]"
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

        <div className="container max-w-6xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          {/* Product Title - Top of Page */}
          <div className="mt-16 md:mt-20 mb-6 md:mb-8 text-center">
            <div className="inline-block relative">
              <h1 className="text-2xl md:text-4xl font-semibold text-dark-green-7 mb-3 px-6 md:px-8 relative z-10">
                {product.name}
              </h1>
              {/* Decorative underline */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 md:w-20 h-1 bg-gradient-to-r from-logo-lime/60 via-logo-lime to-logo-lime/60 rounded-full"></div>
              {/* Subtle background accent */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-logo-lime/5 to-transparent rounded-lg -mx-4 md:-mx-6 -my-2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            
            {/* Left Column: Product Images */}
            <div className="md:self-start md:border-r md:border-logo-lime/30 md:pr-8">
              <ProductImageGallery
                images={
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images.map(img => ({
                        url: img.url || '/images/products/dika-500ML.webp',
                        variant: img.variant || 'default'
                      }))
                    : [{ url: '/images/products/dika-500ML.webp', variant: 'default' }]
                }
                selectedImage={selectedImage}
                onSelectImage={handleImageSelect}
                productName={product.name}
                selectedVariant={selectedVariant?.name || ''}
                variants={product.variants || []}
                onVariantSelect={handleVariantSelect}
              />

            </div>

            {/* Right Column: Product Info */}
            <div className="space-y-4 md:space-y-6">
              
              {/* Product Header */}
              <div>
                {/* Price with Brand */}
                <div className="mb-4 md:mb-6">
                  <ProductPriceDisplay
                    price={selectedVariant 
                      ? (selectedVariant.promotionalPrice && selectedVariant.promotionalPrice > 0 && selectedVariant.promotionalPrice < selectedVariant.price 
                         ? selectedVariant.promotionalPrice 
                         : selectedVariant.price)
                      : product.price}
                    currency={product.currency || "MAD"}
                    isDiscounted={selectedVariant?.promotionalPrice > 0 && selectedVariant?.promotionalPrice < selectedVariant?.price}
                    originalPrice={selectedVariant?.price}
                    brand={product.brand}
                    highlight={true}
                  />
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <div className="mb-6 p-4 bg-logo-lime/5 rounded-lg border-l-4 border-l-logo-lime">
                    <p className="text-gray-700 text-sm leading-relaxed">{product.shortDescription}</p>
                  </div>
                )}
              </div>

              {/* Product Options */}
              <ProductOptions
                variants={product.variants || []}
                selectedVariant={selectedVariant}
                onVariantSelect={handleVariantSelect}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />

              {/* Action Buttons */}
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
                <ProductActionButtons
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              </div>

            </div>
          </div>

          {/* Product Details Section - Full Width */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-logo-lime/30">
            <ProductDetailsSection
              description={product.description}
              shortDescription={null} // Already shown above
              features={product.features}
              allergens={product.allergens}
              additionalDetails={product.additionalDetails}
              isDescriptionOpen={isDescriptionOpen}
              setIsDescriptionOpen={setIsDescriptionOpen}
              isDetailsOpen={isDetailsOpen}
              setIsDetailsOpen={setIsDetailsOpen}
            />
            
            {/* Product Rating - After Allergen Card */}
            <div className="mt-6">
              <ProductRatingCard
                rating={product.rating}
                reviewCount={product.reviewCount || 69}
                reviews={[]}
                useMockData={true}
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
              onAddToCart={handleRelatedProductAddToCart}
            />
          </div>
        </Section>
      )}

      {/* Mobile Drawer Container for quick actions */}
      <div className="md:hidden">
        <DrawerContainer
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onVariantSelect={handleVariantSelect}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>
    </>
  );
};

export default ProductDetailPage;