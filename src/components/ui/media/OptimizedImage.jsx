import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { tv } from 'tailwind-variants';

// Image container styles using Tailwind Variants
const imageContainerStyles = tv({
  base: 'relative overflow-hidden',
  variants: {
    fit: {
      contain: 'flex items-center justify-center',
      cover: '',
      fill: 'w-full h-full',
      none: '',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    fit: 'contain',
    rounded: 'none',
  }
});

/**
 * OptimizedImage component for responsive, optimized images with modern features:
 * - Progressive loading with blur-up effect
 * - WebP/AVIF format support with fallbacks
 * - Responsive sizing with srcset
 * - Native lazy loading
 * - Aspect ratio preservation
 * - Error handling
 *
 * Similar to OptimizedBackgroundImage but for regular content images.
 */
export default function OptimizedImage({
  src,
  alt,
  width = 0,
  height = 0,
  className = '',
  fit = 'contain',
  rounded = 'none',
  lazy = true,
  priority = false,
  hasWebp = true,
  hasAvif = false,
  hasRetina = false,
  hasResponsive = false,
  placeholder = 'blur',
  extension,
  sizes,
  onError,
  errorFallback = '/images/placeholder.jpg',
  style = {},
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Infer extension if not provided
  const imgExtension = extension || (src.includes('.') ? src.split('.').pop() : 'jpg');

  // Format image paths for different formats and resolutions
  const getImagePath = (format = null, retina = false, device = '') => {
    // If src already has extension, replace it
    const basePath = src.includes('.')
      ? src.substring(0, src.lastIndexOf('.'))
      : src;

    const deviceSuffix = device ? `-${device}` : '';
    const retinaSuffix = retina ? '@2x' : '';
    const formatExtension = format || imgExtension;

    return `${basePath}${deviceSuffix}${retinaSuffix}.${formatExtension}`;
  };

  // Calculate aspect ratio for the container
  const getContainerStyle = () => {
    // Only apply aspect ratio if both width and height are provided
    if (width && height) {
      return {
        aspectRatio: `${width} / ${height}`,
        ...style
      };
    }
    return style;
  };

  // Merge container styles
  const containerStyles = imageContainerStyles({ fit, rounded, className });

  // Handle image load error
  const handleError = (e) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
    if (errorFallback) {
      e.target.src = errorFallback;
    }
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={containerStyles} style={getContainerStyle()}>
      {/* Blur-up placeholder shown until image loads */}
      {placeholder === 'blur' && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-neutral-200 animate-pulse"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        />
      )}

      <picture>
        {/* AVIF format sources - most efficient, modern browsers */}
        {hasAvif && (
          <>
            {/* Desktop AVIF */}
            <source
              srcSet={`
                ${getImagePath('avif')} 1x
                ${hasRetina ? `, ${getImagePath('avif', true)} 2x` : ''}
              `}
              type="image/avif"
              media={hasResponsive ? "(min-width: 1024px)" : undefined}
              sizes={sizes}
            />

            {/* Tablet AVIF */}
            {hasResponsive && (
              <source
                srcSet={`
                  ${getImagePath('avif', false, 'tablet')} 1x
                  ${hasRetina ? `, ${getImagePath('avif', true, 'tablet')} 2x` : ''}
                `}
                type="image/avif"
                media="(min-width: 768px)"
                sizes={sizes}
              />
            )}

            {/* Mobile AVIF */}
            {hasResponsive && (
              <source
                srcSet={`
                  ${getImagePath('avif', false, 'mobile')} 1x
                  ${hasRetina ? `, ${getImagePath('avif', true, 'mobile')} 2x` : ''}
                `}
                type="image/avif"
                media="(max-width: 767px)"
                sizes={sizes}
              />
            )}
          </>
        )}

        {/* WebP format sources - good compatibility and efficiency */}
        {hasWebp && (
          <>
            {/* Desktop WebP */}
            <source
              srcSet={`
                ${getImagePath('webp')} 1x
                ${hasRetina ? `, ${getImagePath('webp', true)} 2x` : ''}
              `}
              type="image/webp"
              media={hasResponsive ? "(min-width: 1024px)" : undefined}
              sizes={sizes}
            />

            {/* Tablet WebP */}
            {hasResponsive && (
              <source
                srcSet={`
                  ${getImagePath('webp', false, 'tablet')} 1x
                  ${hasRetina ? `, ${getImagePath('webp', true, 'tablet')} 2x` : ''}
                `}
                type="image/webp"
                media="(min-width: 768px)"
                sizes={sizes}
              />
            )}

            {/* Mobile WebP */}
            {hasResponsive && (
              <source
                srcSet={`
                  ${getImagePath('webp', false, 'mobile')} 1x
                  ${hasRetina ? `, ${getImagePath('webp', true, 'mobile')} 2x` : ''}
                `}
                type="image/webp"
                media="(max-width: 767px)"
                sizes={sizes}
              />
            )}
          </>
        )}

        {/* Original format sources (jpg, png, etc.) */}
        {hasResponsive ? (
          <>
            {/* Desktop original */}
            <source
              srcSet={`
                ${getImagePath()} 1x
                ${hasRetina ? `, ${getImagePath(null, true)} 2x` : ''}
              `}
              type={`image/${imgExtension === 'jpg' ? 'jpeg' : imgExtension}`}
              media="(min-width: 1024px)"
              sizes={sizes}
            />

            {/* Tablet original */}
            <source
              srcSet={`
                ${getImagePath(null, false, 'tablet')} 1x
                ${hasRetina ? `, ${getImagePath(null, true, 'tablet')} 2x` : ''}
              `}
              type={`image/${imgExtension === 'jpg' ? 'jpeg' : imgExtension}`}
              media="(min-width: 768px)"
              sizes={sizes}
            />

            {/* Mobile original */}
            <source
              srcSet={`
                ${getImagePath(null, false, 'mobile')} 1x
                ${hasRetina ? `, ${getImagePath(null, true, 'mobile')} 2x` : ''}
              `}
              type={`image/${imgExtension === 'jpg' ? 'jpeg' : imgExtension}`}
              media="(max-width: 767px)"
              sizes={sizes}
            />
          </>
        ) : (
          <source
            srcSet={`
              ${getImagePath()} 1x
              ${hasRetina ? `, ${getImagePath(null, true)} 2x` : ''}
            `}
            type={`image/${imgExtension === 'jpg' ? 'jpeg' : imgExtension}`}
            sizes={sizes}
          />
        )}

        {/* Fallback image */}
        <img
          src={hasWebp ? getImagePath('webp') : getImagePath()}
          alt={alt}
          width={width || undefined}
          height={height || undefined}
          loading={priority ? "eager" : (lazy ? "lazy" : "eager")}
          fetchpriority={priority ? "high" : "auto"}
          onError={handleError}
          onLoad={handleLoad}
          className={`object-${fit} w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      </picture>

      {/* Error fallback UI */}
      {hasError && !errorFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center p-4">
            <span className="block text-red-500 text-sm">Image failed to load</span>
            <span className="block text-neutral-400 text-xs mt-1 max-w-xs truncate">{alt}</span>
          </div>
        </div>
      )}
    </div>
  );
}

OptimizedImage.propTypes = {
  /** Image source path without extension if using multi-format */
  src: PropTypes.string.isRequired,

  /** Alt text for accessibility */
  alt: PropTypes.string.isRequired,

  /** Image width (optional, but recommended for CLS prevention) */
  width: PropTypes.number,

  /** Image height (optional, but recommended for CLS prevention) */
  height: PropTypes.number,

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Object-fit behavior */
  fit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none']),

  /** Border radius variant */
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),

  /** Whether to use native lazy loading */
  lazy: PropTypes.bool,

  /** Whether this is a high priority image (like hero) */
  priority: PropTypes.bool,

  /** Whether WebP versions are available */
  hasWebp: PropTypes.bool,

  /** Whether AVIF versions are available */
  hasAvif: PropTypes.bool,

  /** Whether retina (@2x) versions are available */
  hasRetina: PropTypes.bool,

  /** Whether responsive (mobile/tablet/desktop) versions are available */
  hasResponsive: PropTypes.bool,

  /** Placeholder type while loading */
  placeholder: PropTypes.oneOf(['blur', 'none']),

  /** Image file extension (jpg, png, etc.) - inferred from src if not provided */
  extension: PropTypes.string,

  /** Sizes attribute for responsive images */
  sizes: PropTypes.string,

  /** Error handler callback */
  onError: PropTypes.func,

  /** URL to fallback image if loading fails */
  errorFallback: PropTypes.string,

  /** Additional inline styles for container */
  style: PropTypes.object,
};