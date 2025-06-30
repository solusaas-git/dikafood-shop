import React from 'react';
import { tv } from 'tailwind-variants';
import OptimizedBackgroundImage from './OptimizedBackgroundImage';

// Define styles for the Section component using tailwind-variants
const sectionStyles = tv({
  base: 'relative w-full overflow-hidden',
  variants: {
    // Background variants
    background: {
      none: 'bg-transparent',
      light: 'bg-white',
      dark: 'bg-dark-green-7',
      primary: 'bg-dark-green-6',
      secondary: 'bg-dark-yellow-1',
      image: '', // Background image styling is handled separately with OptimizedBackgroundImage
      gradient: '', // Gradient type is determined by backgroundGradient variant
      // Other built-in backgrounds can be added here
    },
    // Background gradient variants (used when background is set to "gradient")
    backgroundGradient: {
      none: '',
      brandGreen: 'bg-gradient-to-br from-dark-green-5 to-dark-green-7',
      brandYellow: 'bg-gradient-to-br from-dark-yellow-1 to-dark-yellow-3',
      lightGreen: 'bg-gradient-to-br from-light-green-1 to-light-green-3',
    },
    // Overlay variants for background overlays
    overlayType: {
      none: '',
      dark: 'after:absolute after:inset-0 after:bg-gradient-dark-overlay after:z-0',
      light: 'after:absolute after:inset-0 after:bg-gradient-light-overlay after:z-0',
      hero: 'after:absolute after:inset-0 after:bg-gradient-hero-overlay after:z-0',
      vignette: 'after:absolute after:inset-0 after:bg-gradient-vignette after:z-0',
      custom: '', // For custom overlay color and opacity
    },
    // Overlay opacity variants
    overlayOpacity: {
      none: '',
      light: 'after:bg-opacity-10',
      medium: 'after:bg-opacity-30',
      heavy: 'after:bg-opacity-50',
      solid: 'after:bg-opacity-80',
    },
    // Padding variants
    padding: {
      none: 'py-0',
      small: 'py-4 md:py-6',
      medium: 'py-6 md:py-12',
      large: 'py-12 md:py-16 lg:py-20',
      xl: 'py-16 md:py-24 lg:py-32',
    },
    // Container width variants
    width: {
      full: 'px-4 md:px-6',
      container: 'px-4 md:px-6 max-w-screen-xl mx-auto',
      narrow: 'px-4 md:px-6 max-w-screen-lg mx-auto',
    },
    // Text color variants based on background
    textColor: {
      default: '', // Will be determined based on background
      light: 'text-white',
      dark: 'text-dark-green-7',
      accent: 'text-dark-yellow-1',
    },
  },
  compoundVariants: [
    // Set default text colors based on background
    { background: 'dark', textColor: 'default', class: 'text-white' },
    { background: 'primary', textColor: 'default', class: 'text-white' },
    { background: 'light', textColor: 'default', class: 'text-dark-green-7' },
    { background: 'secondary', textColor: 'default', class: 'text-dark-green-7' },
    { background: 'gradient', backgroundGradient: 'brandGreen', textColor: 'default', class: 'text-white' },
    { background: 'gradient', backgroundGradient: 'brandYellow', textColor: 'default', class: 'text-dark-green-7' },
    { background: 'gradient', backgroundGradient: 'lightGreen', textColor: 'default', class: 'text-dark-green-7' },
  ],
  defaultVariants: {
    background: 'light',
    backgroundGradient: 'none',
    overlayType: 'none',
    overlayOpacity: 'none',
    padding: 'medium',
    width: 'container',
    textColor: 'default',
  },
});

// Container styles for the content inside the section
const containerStyles = tv({
  base: 'relative z-10 w-full',
  variants: {
    centered: {
      true: 'flex flex-col items-center text-center',
      false: '',
    },
  },
  defaultVariants: {
    centered: false,
  },
});

// Header styles for section titles and descriptions
const headerStyles = tv({
  base: 'mb-8',
  variants: {
    size: {
      small: '',
      medium: 'mb-10',
      large: 'mb-12 md:mb-16',
    },
    centered: {
      true: 'text-center mx-auto max-w-3xl',
      false: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    centered: false,
  },
});

// Title styles for section headings
const titleStyles = tv({
  base: 'font-medium mb-3',
  variants: {
    size: {
      small: 'text-xl md:text-2xl',
      medium: 'text-2xl md:text-3xl',
      large: 'text-3xl md:text-4xl lg:text-5xl',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

// Description styles for section subtext
const descriptionStyles = tv({
  base: 'max-w-prose',
  variants: {
    size: {
      small: 'text-sm md:text-base',
      medium: 'text-base md:text-lg',
      large: 'text-lg md:text-xl',
    },
    centered: {
      true: 'mx-auto',
      false: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    centered: false,
  },
});

/**
 * Section component for page layout sections
 *
 * @param {string} page - Page identifier where the section is used
 * @param {string} type - Section type identifier
 * @param {string} id - HTML id attribute for the section
 * @param {string} className - Additional CSS classes
 * @param {string} background - Background style (none, light, dark, primary, secondary, image, gradient, or direct Tailwind class)
 * @param {string} backgroundGradient - Background gradient style when background is "gradient"
 * @param {string} backgroundImage - Background image URL when background is "image" (legacy support)
 * @param {string} backgroundSrc - Base path to background image without extension (e.g. '/images/backgrounds/hero-background')
 * @param {string} backgroundAlt - Alt text for background image
 * @param {boolean} backgroundHasWebp - Whether WebP versions of the image are available
 * @param {boolean} backgroundHasRetina - Whether 2x retina versions are available
 * @param {boolean} backgroundHasResponsive - Whether responsive versions (tablet/mobile) are available
 * @param {string} backgroundExtension - Background image file extension
 * @param {string} backgroundObjectFit - How the background image should fit (cover, contain, fill)
 * @param {string} backgroundObjectPosition - Background image position (center, top, etc.)
 * @param {object} backgroundCustomStyles - Custom styles for the background image
 * @param {object} backgroundCustomContainerStyles - Custom styles for the background container
 * @param {string} overlayType - Type of overlay (none, dark, light, hero, vignette, custom)
 * @param {string} overlayColor - Custom overlay color when overlayType is "custom"
 * @param {string} overlayOpacity - Overlay opacity level (none, light, medium, heavy, solid)
 * @param {string} padding - Section padding size (none, small, medium, large, xl)
 * @param {string} width - Container width (full, container, narrow)
 * @param {boolean} centered - Whether to center the content horizontally
 * @param {boolean} fullWidth - Whether to make the section take full viewport width without margins
 * @param {string} textColor - Text color (default, light, dark, accent)
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {string} headerSize - Size of the header (small, medium, large)
 * @param {string} titleSize - Size of the title (small, medium, large)
 * @param {string} descriptionSize - Size of the description (small, medium, large)
 * @param {React.ReactNode} children - Section content
 * @param {React.Ref} ref - Forwarded ref
 */
const Section = React.forwardRef(({
  page,
  type,
  id,
  className = '',
  background,
  backgroundGradient,
  backgroundImage, // Legacy support
  backgroundSrc,
  backgroundAlt,
  backgroundHasWebp = true,
  backgroundHasRetina = true,
  backgroundHasResponsive = true,
  backgroundExtension = 'jpg',
  backgroundObjectFit = 'cover',
  backgroundObjectPosition = 'center',
  backgroundCustomStyles = {},
  backgroundCustomContainerStyles = {},
  overlayType,
  overlayColor,
  overlayOpacity,
  padding,
  width,
  centered = false,
  fullWidth = false,
  textColor,
  title,
  description,
  headerSize = 'medium',
  titleSize = 'medium',
  descriptionSize = 'medium',
  children,
  ...props
}, ref) => {
  // Determine if we have a background image
  const hasBackgroundImage = background === 'image' && (backgroundSrc || backgroundImage);

  // Generate section classes
  const sectionClasses = sectionStyles({
    background,
    backgroundGradient,
    overlayType,
    overlayOpacity,
    padding,
    width,
    textColor,
    className: [
      className,
      fullWidth ? 'mx-0' : '',
    ].filter(Boolean).join(' '),
  });

  // Generate container classes
  const contentClasses = containerStyles({
    centered,
  });

  return (
    <section
      id={id}
      className={sectionClasses}
      data-page={page}
      data-section-type={type}
      ref={ref}
      {...props}
    >
      {/* Background image if specified */}
      {hasBackgroundImage && (
        <OptimizedBackgroundImage
          src={backgroundSrc || backgroundImage}
          alt={backgroundAlt || "Background image"}
          hasWebp={backgroundHasWebp}
          hasRetina={backgroundHasRetina}
          hasResponsive={backgroundHasResponsive}
          extension={backgroundExtension}
          objectFit={backgroundObjectFit}
          objectPosition={backgroundObjectPosition}
          customStyles={backgroundCustomStyles}
          customContainerStyles={backgroundCustomContainerStyles}
        />
      )}

      {/* Custom overlay color if specified */}
      {overlayType === 'custom' && overlayColor && (
        <div
          className={`absolute inset-0 z-[1] ${overlayOpacity === 'none' ? 'opacity-30' : ''}`}
          style={{
            backgroundColor: overlayColor,
            opacity: {
              none: 0.3,
              light: 0.1,
              medium: 0.3,
              heavy: 0.5,
              solid: 0.8,
            }[overlayOpacity || 'medium'],
          }}
        />
      )}

      {/* Section content container */}
      <div className={contentClasses}>
        {/* Section header with title and description if provided */}
        {(title || description) && (
          <header className={headerStyles({ size: headerSize, centered })}>
            {title && <h2 className={titleStyles({ size: titleSize })}>{title}</h2>}
            {description && (
              <p className={descriptionStyles({ size: descriptionSize, centered })}>
                {description}
              </p>
            )}
          </header>
        )}

        {/* Section children */}
        {children}
      </div>
    </section>
  );
});

// Add a display name for better debugging
Section.displayName = 'Section';

export default Section;