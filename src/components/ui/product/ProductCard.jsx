import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';
import Icon from '../icons/Icon';
import { Card, CardContent, CardFooter, CardHeader } from '../shadcn/card';
import { getProductImageUrlById } from '@/services/api';

// AsyncImage component for resolving and displaying product images
function AsyncImage({ imageId, alt, ...props }) {
  const [src, setSrc] = React.useState(null);
  React.useEffect(() => {
    let mounted = true;
    if (imageId) {
      // If imageId is already a direct path (starts with / or http), use it directly
      if (imageId.startsWith('/') || imageId.startsWith('http')) {
        setSrc(imageId);
      } else {
        // Otherwise, try to resolve it via API
        getProductImageUrlById(imageId).then(url => {
          if (mounted) setSrc(url);
        }).catch(error => {
          console.warn('Failed to resolve image ID:', imageId, error);
          if (mounted) setSrc(null);
        });
      }
    } else {
      setSrc(null);
    }
    return () => { mounted = false; };
  }, [imageId]);
  if (!src) return <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">No Image</div>;
  return <img src={src} alt={alt} {...props} />;
}

/**
 * ProductCard component using shadcn/ui Card
 *
 * @param {Object} props
 * @param {Object} props.product - The product data object
 * @param {string} props.variant - Card variant (default, featured, compact, hero)
 * @param {string} props.size - Card size (sm, md, lg)
 * @param {React.ReactNode} props.action - Optional action element (like add to cart button)
 * @param {Object} props.activeVariant - Optional active product variant
 * @param {Function} props.onVariantChange - Callback when variant changes
 * @param {string} props.className - Additional class names
 * @returns {JSX.Element}
 */
export function ProductCard({
  product,
  variant = 'default',
  size = 'md',
  action,
  activeVariant,
  onVariantChange,
  className,
  ...props
}) {
  // Track the previous variant to enable smooth transitions
  const [prevVariant, setPrevVariant] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Internal state for the active variant if not provided from props
  const [internalActiveVariant, setInternalActiveVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Effect to handle variant transitions
  useEffect(() => {
    if (activeVariant && prevVariant && activeVariant !== prevVariant) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match the animation duration

      return () => clearTimeout(timer);
    }

    setPrevVariant(activeVariant);
  }, [activeVariant, prevVariant]);

  // Effect to update internal variant when external variant changes
  useEffect(() => {
    if (activeVariant) {
      setInternalActiveVariant(activeVariant);
    }
  }, [activeVariant]);

  if (!product) return null;

  // Store product ID for reference
  const productId = product._id || product.productId || product.id;
  // Use slug for SEO-friendly URLs, fallback to product ID
  // Priority: slug > productId (for featured variants) > _id > id
  const productSlugOrId = product.slug || product.productId || product._id || product.id;
  if (!productSlugOrId) return null;

  // Use either the provided activeVariant from props or the internal state
  const currentVariant = activeVariant || internalActiveVariant;

  // Determine the product image to display
  let image = null;
  if (currentVariant?.imageUrl) {
    image = currentVariant.imageUrl; // Use variant-specific image
  } else if (currentVariant?.imageUrls && currentVariant.imageUrls.length > 0) {
    image = currentVariant.imageUrls[0]; // Use first variant image
  } else if (currentVariant?.image) {
    image = currentVariant.image; // Fallback to legacy image property
  } else if (product.images && product.images.length > 0) {
    image = product.images[0]; // Use the first product image as provided
  } else if (product.image) {
    image = product.image; // Use main product image
  } else {
    image = `https://placehold.co/150x150/3d4070/ffffff?text=${product.name}`;
  }

  // Get product prices (promotional and regular)
  const regularPrice = currentVariant?.price || product.unitPrice || product.price || 0;
  const promotionalPrice = currentVariant?.promotionalPrice || product.promotionalPrice;
  const hasPromotion = promotionalPrice && promotionalPrice > 0 && promotionalPrice < regularPrice;
  const displayPrice = hasPromotion ? promotionalPrice : regularPrice;

  // Size variant selection handler
  const handleVariantSelect = (e, selectedVariant) => {
    e.preventDefault();
    e.stopPropagation();

    // Update internal state
    setInternalActiveVariant(selectedVariant);

    // Call parent callback if provided
    if (onVariantChange) {
      onVariantChange(selectedVariant);
    }
    
    // Variant selectors should only change the variant locally, not navigate
    // Navigation happens when clicking the main card area
  };

  // Determine image container height based on variant and size
  const getImageContainerHeight = () => {
    if (variant === 'compact') return 'h-32 md:h-36';
    if (variant === 'hero') return 'h-44 md:h-48'; // Balanced for proper card proportions
    if (variant === 'featured') return 'h-40 md:h-48';

    // Default sizes
    switch (size) {
      case 'sm': return 'h-36 md:h-40';
      case 'lg': return 'h-48 md:h-56';
      default: return 'h-42 md:h-48'; // md size
    }
  };

  // Determine product name text size based on variant and size
  const getProductNameClass = () => {
    if (variant === 'compact') return 'text-sm md:text-sm pr-5';
    if (variant === 'hero') return 'text-sm md:text-base mb-1 font-medium';
    if (variant === 'featured') return 'text-sm md:text-base';

    // Default sizes
    switch (size) {
      case 'sm': return 'text-sm md:text-sm';
      case 'lg': return 'text-base md:text-lg';
      default: return 'text-sm md:text-base'; // md size
    }
  };

  // Determine price text size based on variant and size
  const getPriceClass = () => {
    if (variant === 'compact') return 'text-sm md:text-base';
    if (variant === 'hero') return 'text-base md:text-lg';
    if (variant === 'featured') return 'text-base md:text-lg';

    // Default sizes
    switch (size) {
      case 'sm': return 'text-base md:text-lg';
      case 'lg': return 'text-lg md:text-2xl';
      default: return 'text-lg md:text-xl'; // md size
    }
  };

  // Render size variants (1L, 5L, etc.)
  const renderSizeVariants = () => {
    if (!product.variants || product.variants.length <= 1) return null;

    // Show all variants for similar products section
    const availableVariants = product.variants.filter(v => v && v.size);
    
    // If no variants or only one, don't show selector
    if (!availableVariants || availableVariants.length <= 1) return null;

    // Determine appropriate size and padding for variant buttons
    const getVariantBtnClasses = (variantSize) => {
      // Check if the variant size text is longer (like "500ml")
      const isLongText = variantSize && variantSize.length > 2;

      const baseSize =
        variant === 'compact' || size === 'sm' ?
          isLongText ? 'min-w-[32px] h-7 px-1.5 leading-7 text-xs' : 'w-7 h-7 leading-7 text-xs' :
        variant === 'hero' || size === 'lg' ?
          isLongText ? 'min-w-[36px] h-8 px-2 leading-8 text-xs' : 'w-8 h-8 leading-8 text-xs' :
          isLongText ? 'min-w-[38px] h-8 px-2 leading-8 text-xs' : 'w-8 h-8 leading-8 text-xs';

      return baseSize;
    };

    return (
      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col gap-0.5">
        {availableVariants.map((variantItem) => {
          // Check if this variant is the active one
          const isActive = currentVariant?._id === variantItem._id;

          return (
            <button
              key={`${productId}-${variantItem._id}`}
              className={cn(
                'inline-block rounded-full text-center font-medium transition-all duration-200',
                isActive
                  ? 'bg-logo-lime/30 border-logo-lime border text-dark-green-7 shadow-sm scale-105 font-semibold'
                  : 'bg-white border-logo-lime border text-dark-green-6 hover:bg-logo-lime/10 hover:scale-102',
                getVariantBtnClasses(variantItem.size)
              )}
              onClick={(e) => handleVariantSelect(e, variantItem)}
              aria-label={`Select ${variantItem.size} size`}
              aria-pressed={isActive}
              data-product-id={productId}
              data-variant-size={variantItem.size}
            >
              {variantItem.size}
            </button>
          );
        })}
      </div>
    );
  };

  // Card styles based on variant
  const cardStyles = cn(
    'h-full overflow-hidden transition-all duration-300 will-change-transform flex flex-col',
    'bg-gradient-to-br from-light-yellow-1 via-white to-light-yellow-2',
    'border border-dark-green-6/70',
    variant === 'hero' ? 'border-dark-green-6/70' : '',
    className
  );

  // Handle main card click navigation
  const handleCardClick = (e) => {
    // For hero cards, navigate with the current active variant
    if (variant === 'hero') {
      e.preventDefault();
      const variantParam = currentVariant?._id || currentVariant?.id || currentVariant?.size || currentVariant?.name;
      const productUrl = variantParam 
        ? `/produits/${productSlugOrId}?variant=${encodeURIComponent(variantParam)}`
        : `/produits/${productSlugOrId}`;
      
      if (typeof window !== 'undefined') {
        window.location.href = productUrl;
      }
    }
    // For other card types, let the Link component handle navigation normally
  };

  return (
    <Link
      href={variant === 'hero' ? '#' : `/produits/${productSlugOrId}`}
      onClick={handleCardClick}
      className="group block h-full"
      {...props}
    >
      <Card className={cardStyles} data-product-id={productId}>
        {/* Product Image */}
        <div className={cn(
          "relative overflow-hidden w-full group-hover:shadow-inner",
          getImageContainerHeight(),
          variant === 'hero' ? 'flex-shrink-0' : ''
        )}>
          <AsyncImage
            imageId={image}
            alt={product.name || product.title}
            className={cn(
              "w-full h-full object-contain p-4 md:p-6 transition-transform duration-300 group-hover:scale-105",
              isTransitioning ? "opacity-0" : "animate-fade-in opacity-100"
            )}
            key={`${productId}-${currentVariant?.size || 'default'}-${image}`}
            style={{ animationDuration: '0.3s' }}
            data-product-id={productId}
            data-variant-size={currentVariant?.size}
          />
          {renderSizeVariants()}
        </div>

        {/* Product Content */}
        <CardContent className={cn(
          variant === 'hero' ? 'p-3 pt-2 pb-1 md:p-3 md:pt-2 md:pb-1' : 'p-3 pt-2 md:p-4 md:pt-3',
          variant === 'hero' ? 'pb-1' : 'flex-grow flex flex-col'
        )}>
          {/* Brand Badge */}
          {(product.brand || product.brandName) && (
            <div className="flex">
              <div className={cn(
                "inline-flex items-center rounded-full font-medium",
                "bg-logo-lime/15 text-dark-green-7 border border-logo-lime/25",
                variant === 'hero' ? "px-2 py-0.5 text-[10px] mb-1 md:text-[11px]" : "px-2.5 py-0.5 text-[10px] mb-1 md:text-xs",
                variant === 'compact' && "text-[9px] py-0.5 px-1.5 md:text-[10px]"
              )}>
                <Icon name="leaf" size="xs" weight="duotone" className="mr-1 text-dark-green-7" />
                <span>{typeof product.brand === 'object' ? product.brand.name : (product.brand || product.brandName)}</span>
              </div>
            </div>
          )}

          {/* Product Name */}
          <h3 className={cn(
            "text-dark-green-7 font-normal line-clamp-2 transition-colors duration-300",
            getProductNameClass()
          )}>
            {product.name || product.title}
          </h3>

          {/* Spacer only for non-hero variants */}
          {variant !== 'hero' && <div className="flex-grow"></div>}
        </CardContent>

        {/* Product Footer with Price and Action */}
        <CardFooter className={cn(
          "bg-dark-yellow-1 w-full mt-auto border-t border-dark-green-6/30 transition-all duration-300",
          variant === 'compact' ? 'p-2.5 pt-2.5 md:p-3 md:pt-3' : 'p-3 pt-3 md:p-3 md:pt-3',
          variant === 'hero' && 'p-3 pt-3',
          variant === 'compact' ? 'group-hover:pb-3 md:group-hover:pb-4' : 'group-hover:pb-3.5 md:group-hover:pb-4',
          variant === 'hero' && 'group-hover:pb-3.5'
        )}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className={cn(
                "flex items-center justify-center rounded-full bg-logo-lime/15 border border-dark-green-7/30 shadow-sm",
                variant === 'hero' ? 'p-1.5 w-10 h-10' : variant === 'compact' ? 'p-0.5 w-6 h-6' : 'p-1 w-8 h-8'
              )}>
                <Icon
                  name="tag"
                  weight="duotone"
                  size={variant === 'hero' ? 'md' : variant === 'compact' ? 'sm' : 'sm'}
                  className="text-dark-green-7"
                />
              </div>
              
              {/* Subtle separator */}
              <div className={cn(
                "bg-dark-green-6/20 mx-2.5",
                variant === 'hero' ? 'w-px h-6' : variant === 'compact' ? 'w-px h-4' : 'w-px h-5'
              )}></div>
              
              <div className={cn(
                "font-semibold transition-all duration-200",
                getPriceClass()
              )}>
                {hasPromotion ? (
                  <div className="flex flex-col">
                    <span
                      key={`${productId}-${currentVariant?.size || 'default'}-${displayPrice}`}
                      className={cn(
                        "text-dark-green-7",
                        isTransitioning ? "opacity-0" : "animate-fade-in opacity-100"
                      )}
                      style={{ animationDuration: '0.3s' }}
                      data-product-id={productId}
                      data-variant-price={displayPrice}
                    >
                      {formatPrice(displayPrice)}
                    </span>
                    <span className="text-xs text-gray-500 line-through -mt-1">
                      {formatPrice(regularPrice)}
                    </span>
                  </div>
                ) : (
                  <span
                    key={`${productId}-${currentVariant?.size || 'default'}-${displayPrice}`}
                    className={cn(
                      "text-dark-green-7",
                      isTransitioning ? "opacity-0" : "animate-fade-in opacity-100"
                    )}
                    style={{ animationDuration: '0.3s' }}
                    data-product-id={productId}
                    data-variant-price={displayPrice}
                  >
                    {formatPrice(displayPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center">
              {action && (
                <div className="mr-2">{action}</div>
              )}
              {!action && (
                <Icon
                  name="arrowRight"
                  weight="bold"
                  size={variant === 'hero' ? 'lg' : variant === 'compact' ? 'sm' : 'md'}
                  className={cn(
                    "text-dark-green-7 transition-all duration-300 mr-2",
                    "transform translate-x-0 group-hover:translate-x-1"
                  )}
                />
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

/**
 * FeaturedProductCard component for displaying featured products
 */
export function FeaturedProductCard(props) {
  return <ProductCard variant="featured" {...props} />;
}

/**
 * ShopProductCard component for displaying products in shop pages with add to cart button
 */
export function ShopProductCard({ product, onAddToCart, ...props }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  const actionButton = (
    <button
      onClick={handleAddToCart}
      className="inline-flex items-center justify-center p-2 text-white bg-logo-lime rounded-full hover:bg-logo-lime/90 transition-colors"
      aria-label="Add to cart"
    >
      <Icon name="shoppingCart" size="sm" />
    </button>
  );

  return (
    <ProductCard
      variant="default"
      product={product}
      action={actionButton}
      {...props}
    />
  );
}

/**
 * CompactProductCard component for smaller/thumbnail display
 */
export function CompactProductCard(props) {
  return <ProductCard variant="compact" size="sm" {...props} />;
}

export default ProductCard;