import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      getProductImageUrlById(imageId).then(url => {
        if (mounted) setSrc(url);
      });
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
  if (!product) return null;

  // Store product ID for reference
  const productId = product._id || product.productId || product.id;
  const productSlugOrId = product.slug || product._id || product.id || product.productId;
  if (!productSlugOrId) return null;

  // Track the previous variant to enable smooth transitions
  const [prevVariant, setPrevVariant] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Internal state for the active variant if not provided from props
  const [internalActiveVariant, setInternalActiveVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Use either the provided activeVariant from props or the internal state
  const currentVariant = activeVariant || internalActiveVariant;

  // Determine the product image to display
  let image = null;
  if (currentVariant?.image) {
    image = currentVariant.image; // Assume backend provides full URL or correct path
  } else if (product.images && product.images.length > 0) {
    image = product.images[0]; // Use the first product image as provided
  } else {
    image = `https://placehold.co/150x150/3d4070/ffffff?text=${product.name}`;
  }

  // Get product price
  const price = currentVariant?.price || product.unitPrice || product.price || 0;

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

  // Size variant selection handler
  const handleVariantSelect = (e, variant) => {
    e.preventDefault();
    e.stopPropagation();

    // Update internal state
    setInternalActiveVariant(variant);

    // Call parent callback if provided
    if (onVariantChange) {
      onVariantChange(variant);
    }
  };

  // Determine image container height based on variant and size
  const getImageContainerHeight = () => {
    if (variant === 'compact') return 'h-32';
    if (variant === 'hero') return 'h-52 md:h-60'; // Increased height for hero variant
    if (variant === 'featured') return 'h-36 md:h-44';

    // Default sizes
    switch (size) {
      case 'sm': return 'h-36';
      case 'lg': return 'h-48 md:h-56';
      default: return 'h-40 md:h-48'; // md size
    }
  };

  // Determine product name text size based on variant and size
  const getProductNameClass = () => {
    if (variant === 'compact') return 'text-sm pr-5';
    if (variant === 'hero') return 'text-lg mb-1';
    if (variant === 'featured') return 'text-sm';

    // Default sizes
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base'; // md size
    }
  };

  // Determine price text size based on variant and size
  const getPriceClass = () => {
    if (variant === 'compact') return 'text-base';
    if (variant === 'hero') return 'text-2xl';
    if (variant === 'featured') return 'text-lg';

    // Default sizes
    switch (size) {
      case 'sm': return 'text-lg';
      case 'lg': return 'text-2xl';
      default: return 'text-xl'; // md size
    }
  };

  // Render size variants (1L, 5L, etc.)
  const renderSizeVariants = () => {
    if (!product.variants || product.variants.length <= 1) return null;

    // Determine appropriate size and padding for variant buttons
    const getVariantBtnClasses = (variantSize) => {
      // Check if the variant size text is longer (like "500ml")
      const isLongText = variantSize && variantSize.length > 2;

      const baseSize =
        variant === 'compact' || size === 'sm' ?
          isLongText ? 'min-w-[36px] h-7 px-1.5 leading-7 text-xs' : 'w-7 h-7 leading-7 text-xs' :
        variant === 'hero' || size === 'lg' ?
          isLongText ? 'min-w-[46px] h-10 px-2.5 leading-10' : 'w-10 h-10 leading-10 text-sm' :
          isLongText ? 'min-w-[40px] h-9 px-2 leading-9 text-xs' : 'w-9 h-9 leading-9 text-xs';

      return baseSize;
    };

    return (
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {product.variants.map((variantItem) => {
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

  return (
    <Link
      to={`/produits/${productSlugOrId}`}
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
              "w-full h-full object-contain p-3 md:p-4 transition-transform duration-300 group-hover:scale-105",
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
          "p-3 pt-2",
          variant === 'hero' ? 'pb-1' : 'flex-grow flex flex-col'
        )}>
          {/* Brand Badge */}
          {(product.brand || product.brandName) && (
            <div className="flex">
              <div className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1",
                "bg-logo-lime/15 text-dark-green-7 border border-logo-lime/25",
                variant === 'compact' && "text-[10px] py-0.5 px-1.5"
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
          variant === 'compact' ? 'p-2 pt-2' : 'p-3 pt-3',
          variant === 'hero' && 'p-3 pt-3',
          variant === 'compact' ? 'group-hover:pb-3' : 'group-hover:pb-4',
          variant === 'hero' && 'group-hover:pb-4'
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
                "font-semibold text-dark-green-7 transition-all duration-200",
                getPriceClass()
              )}>
              <span
                key={`${productId}-${currentVariant?.size || 'default'}-${price}`}
                className={cn(
                  isTransitioning ? "opacity-0" : "animate-fade-in opacity-100"
                )}
                style={{ animationDuration: '0.3s' }}
                data-product-id={productId}
                data-variant-price={price}
              >
                {formatPrice(price)}
              </span>
              </div>
            </div>

            <div className="flex items-center">
              {action && (
                <div className="mr-2">{action}</div>
              )}
              <Icon
                name="arrowRight"
                weight="bold"
                size={variant === 'hero' ? 'md' : variant === 'compact' ? 'xs' : 'sm'}
                className={cn(
                  "text-dark-green-7 transition-all duration-300",
                  "transform translate-x-0 group-hover:translate-x-1"
                )}
              />
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