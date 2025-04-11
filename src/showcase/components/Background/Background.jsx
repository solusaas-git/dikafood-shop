import React from 'react';
import './background.scss';

/**
 * Background Component - Base component for various background styles
 *
 * @param {Object} props - The component props
 * @param {string} [props.variant=''] - Background variant: 'hero', etc.
 * @param {string} [props.imageUrl] - URL of the background image (overrides default)
 * @param {string} [props.bgPosition='center'] - Background position
 * @param {number} [props.overlayOpacity=0.5] - Opacity of the overlay
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to display on top of the background
 */
export default function Background({
  variant = '',
  imageUrl,
  bgPosition = 'center',
  overlayOpacity = 0.5,
  className = '',
  children,
  ...rest
}) {
  const backgroundClasses = [
    'background',
    variant && `background--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={backgroundClasses} {...rest}>
      <div
        className="background__image"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundPosition: bgPosition
        }}
      />
      <div
        className="background__overlay"
        style={{ opacity: overlayOpacity }}
      />
      <div className="background__vignette" />
      <div className="background__content">
        {children}
      </div>
    </div>
  );
}

/**
 * Hero Background - Specialized background for hero sections
 *
 * @param {Object} props - The component props
 * @param {string} [props.imageUrl='/images/backgrounds/hero-background.jpg'] - URL of the hero background image
 * @param {boolean} [props.isMobile=false] - Whether the device is mobile
 * @param {boolean} [props.isTablet=false] - Whether the device is a tablet
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function HeroBackground({
  imageUrl = '/images/backgrounds/hero-background.jpg',
  isMobile = false,
  isTablet = false,
  className = '',
  ...rest
}) {
  const mobileClass = isMobile ? 'mobile' : isTablet ? 'tablet' : '';
  const combinedClassName = [mobileClass, className].filter(Boolean).join(' ');

  return (
    <Background
      variant="hero"
      imageUrl={imageUrl}
      overlayOpacity={isMobile ? 0.85 : isTablet ? 0.75 : 0.6}
      className={combinedClassName}
      {...rest}
    />
  );
}