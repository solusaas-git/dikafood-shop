import React from 'react';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardFooter } from '../shadcn/card';
import { Skeleton } from '../loading/Skeleton';

/**
 * ProductCardSkeleton component for displaying loading states of product cards
 * Uses the base Skeleton component for consistent styling
 *
 * @param {Object} props
 * @param {string} props.variant - Skeleton variant (default, featured, compact, hero)
 * @param {string} props.size - Skeleton size (sm, md, lg)
 * @param {string} props.className - Additional class names
 * @returns {JSX.Element}
 */
export function ProductCardSkeleton({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  // Determine image container height based on variant and size
  const getImageContainerHeight = () => {
    if (variant === 'compact') return 'h-32';
    if (variant === 'hero') return 'h-48 md:h-56';
    if (variant === 'featured') return 'h-36 md:h-44';

    // Default sizes
    switch (size) {
      case 'sm': return 'h-36';
      case 'lg': return 'h-48 md:h-56';
      default: return 'h-40 md:h-48'; // md size
    }
  };

  // Card styles based on variant
  const cardStyles = cn(
    'h-full overflow-hidden transition-all duration-300',
    'bg-gradient-to-br from-light-yellow-1 via-white to-light-yellow-2',
    'border border-dark-green-6/70',
    variant === 'hero' ? 'border-dark-green-6/70' : '',
    className
  );

  return (
    <Card className={cn(cardStyles, "flex flex-col")} {...props}>
      {/* Product Image Skeleton */}
      <div className={cn(
        "relative overflow-hidden w-full",
        "bg-gradient-to-br from-light-yellow-1/40 to-light-yellow-2/30",
        getImageContainerHeight()
      )}>
        <Skeleton
          variant="rectangular"
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Product Content Skeleton */}
      <CardContent className={cn(
        "flex flex-col flex-grow",
        variant === 'compact' ? 'p-2' : 'p-3',
        variant === 'hero' && 'p-4'
      )}>
        {/* Brand Badge Skeleton */}
        <div className="flex">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full mb-1 bg-logo-lime/10 border border-logo-lime/20">
            <Skeleton
              variant="rectangular"
              className="h-3 w-20 rounded-full"
            />
          </div>
        </div>

        {/* Product Name Skeleton - two lines */}
        <div className="space-y-1.5">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-3/4" />
        </div>

        {/* Product Rating Skeleton (for featured variant) */}
        {variant === 'featured' && (
          <div className="flex items-center mt-1 space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="circular" className="w-3 h-3" />
            ))}
          </div>
        )}

        {/* Spacer to ensure consistent height */}
        <div className="flex-grow min-h-[12px]"></div>
      </CardContent>

      {/* Product Footer Skeleton */}
      <CardFooter className={cn(
        "bg-gradient-to-r from-dark-yellow-2/60 to-dark-yellow-1/50 mt-auto border-t border-dark-green-6/30",
        variant === 'compact' ? 'p-2 pt-3' : 'p-3 pt-4',
        variant === 'hero' && 'p-4 pt-5'
      )}>
        <div className="flex items-center justify-between w-full">
          <Skeleton
            variant="rectangular"
            className="h-6 w-20 rounded"
          />

          <div className="flex items-center">
            {variant === 'default' && (
              <Skeleton
                variant="circular"
                className="mr-2 h-10 w-10"
              />
            )}
            <Skeleton
              variant="rectangular"
              className="h-4 w-4 rounded bg-dark-green-7/30"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * FeaturedProductCardSkeleton component
 */
export function FeaturedProductCardSkeleton(props) {
  return <ProductCardSkeleton variant="featured" {...props} />;
}

/**
 * ShopProductCardSkeleton component
 */
export function ShopProductCardSkeleton(props) {
  return <ProductCardSkeleton variant="default" {...props} />;
}

/**
 * HeroProductCardSkeleton component
 */
export function HeroProductCardSkeleton(props) {
  return <ProductCardSkeleton variant="hero" size="lg" {...props} />;
}

/**
 * CompactProductCardSkeleton component
 */
export function CompactProductCardSkeleton(props) {
  return <ProductCardSkeleton variant="compact" size="sm" {...props} />;
}

/**
 * ProductCardSkeletonGrid component for displaying a grid of skeletons
 */
export function ProductCardSkeletonGrid({
  count = 8,
  columns = 4,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 md:gap-6 ${className}`} {...props}>
      {[...Array(count)].map((_, index) => (
        <ProductCardSkeleton
          key={index}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  );
}

export default ProductCardSkeleton;