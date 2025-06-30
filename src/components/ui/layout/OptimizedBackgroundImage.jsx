import React from 'react';
import { tv } from 'tailwind-variants';

// Styles for the background container and image
const containerStyles = tv({
  base: 'absolute inset-0 z-0 overflow-hidden',
  variants: {
    objectFit: {
      cover: '',
      contain: '',
      fill: '',
    },
    objectPosition: {
      center: '',
      top: '',
      bottom: '',
      left: '',
      right: '',
      'top-left': '',
      'top-right': '',
      'bottom-left': '',
      'bottom-right': '',
    },
  },
  defaultVariants: {
    objectFit: 'cover',
    objectPosition: 'center',
  },
});

// Styles for overlay
const overlayStyles = tv({
  base: 'absolute inset-0',
  variants: {
    type: {
      none: 'hidden',
      dark: 'bg-dark-overlay',
      light: 'bg-light-overlay',
      hero: 'bg-hero-overlay',
      vignette: 'bg-vignette',
      custom: '', // For custom color/opacity
    },
    opacity: {
      none: 'opacity-0',
      light: 'opacity-10',
      medium: 'opacity-30',
      heavy: 'opacity-50',
      solid: 'opacity-80',
    },
  },
  defaultVariants: {
    type: 'none',
    opacity: 'medium',
  },
});

/**
 * OptimizedBackgroundImage component for responsive, high-quality background images
 *
 * @param {string} src - Base path to the image without extension (e.g., '/images/backgrounds/hero-background')
 * @param {string} alt - Alt text for the image (for accessibility)
 * @param {boolean} hasWebp - Whether WebP versions of the image are available
 * @param {boolean} hasRetina - Whether 2x retina versions of the image are available
 * @param {boolean} hasResponsive - Whether responsive versions (tablet/mobile) are available
 * @param {string} extension - Image file extension (jpg, png, etc.)
 * @param {string} className - Additional classes for the container
 * @param {string} objectFit - How the image should fit (cover, contain, fill)
 * @param {string} objectPosition - Image position (center, top, etc.)
 * @param {string} overlayType - Type of overlay (none, dark, light, hero, vignette, custom)
 * @param {string} overlayOpacity - Overlay opacity (none, light, medium, heavy, solid)
 * @param {string} overlayColor - Custom overlay color when type is 'custom'
 * @param {string} customStyles - Additional inline styles for the image
 * @param {object} customContainerStyles - Additional inline styles for the container
 */
export default function OptimizedBackgroundImage({
  src,
  alt = "Background image",
  hasWebp = true,
  hasRetina = true,
  hasResponsive = true,
  extension = "jpg",
  className,
  objectFit = "cover",
  objectPosition = "center",
  overlayType = "none",
  overlayOpacity = "none",
  overlayColor,
  customStyles = {},
  customContainerStyles = {},
  ...props
}) {
  // Format paths for different image versions
  const getImagePath = (device = '', format = extension, retina = false) => {
    const deviceSuffix = device ? `-${device}` : '';
    const retinaSuffix = retina ? '@2x' : '';
    return `${src}${deviceSuffix}${retinaSuffix}.${format}`;
  };

  // Generate image class based on object-fit and object-position
  const imgClass = `w-full h-full object-${objectFit} object-${objectPosition}`;

  // Calculate container classes
  const containerClass = containerStyles({ objectFit, objectPosition, className });

  // Calculate overlay classes and styles
  const overlayClass = overlayStyles({ type: overlayType, opacity: overlayOpacity });
  const overlayStyle = overlayType === 'custom' && overlayColor
    ? { backgroundColor: overlayColor }
    : {};

  // Default image styles to ensure height containment
  const defaultImageStyles = {
    height: '100%',
    width: '100%',
    transform: 'none',
    transition: 'none',
    willChange: 'auto',
    ...customStyles
  };

  return (
    <div className={containerClass} style={customContainerStyles} {...props}>
      <picture className="h-full">
        {/* WebP format sources */}
        {hasWebp && (
          <>
            {/* Desktop WebP */}
            <source
              srcSet={`
                ${getImagePath('', 'webp')} 1x
                ${hasRetina ? `, ${getImagePath('', 'webp', true)} 2x` : ''}
              `}
              type="image/webp"
              media="(min-width: 1024px)"
            />

            {/* Tablet WebP */}
            {hasResponsive && (
              <source
                srcSet={`
                  ${getImagePath('tablet', 'webp')} 1x
                  ${hasRetina ? `, ${getImagePath('tablet', 'webp', true)} 2x` : ''}
                `}
                type="image/webp"
                media="(min-width: 768px)"
              />
            )}

            {/* Mobile WebP */}
            {hasResponsive && (
              <source
                srcSet={`
                  ${getImagePath('mobile', 'webp')} 1x
                  ${hasRetina ? `, ${getImagePath('mobile', 'webp', true)} 2x` : ''}
                `}
                type="image/webp"
                media="(max-width: 767px)"
              />
            )}
          </>
        )}

        {/* Original format sources */}
        {/* Desktop */}
        <source
          srcSet={`
            ${getImagePath()} 1x
            ${hasRetina ? `, ${getImagePath('', extension, true)} 2x` : ''}
          `}
          type={`image/${extension === 'jpg' ? 'jpeg' : extension}`}
          media="(min-width: 1024px)"
        />

        {/* Tablet */}
        {hasResponsive && (
          <source
            srcSet={`
              ${getImagePath('tablet')} 1x
              ${hasRetina ? `, ${getImagePath('tablet', extension, true)} 2x` : ''}
            `}
            type={`image/${extension === 'jpg' ? 'jpeg' : extension}`}
            media="(min-width: 768px)"
          />
        )}

        {/* Mobile */}
        {hasResponsive && (
          <source
            srcSet={`
              ${getImagePath('mobile')} 1x
              ${hasRetina ? `, ${getImagePath('mobile', extension, true)} 2x` : ''}
            `}
            type={`image/${extension === 'jpg' ? 'jpeg' : extension}`}
            media="(max-width: 767px)"
          />
        )}

        {/* Fallback image - using the WebP version as default if available */}
        <img
          src={hasWebp ? getImagePath('', 'webp') : getImagePath()}
          alt={alt}
          className={imgClass}
          loading="eager"
          fetchpriority="high"
          width="1920"
          height="1080"
          style={{
            ...defaultImageStyles,
            transform: 'none',
            transition: 'none',
            willChange: 'auto'
          }}
        />
      </picture>

      {/* Overlay - only rendered if overlay type is not "none" */}
      {overlayType !== 'none' && (
        <div className={overlayClass} style={overlayStyle}></div>
      )}
    </div>
  );
}