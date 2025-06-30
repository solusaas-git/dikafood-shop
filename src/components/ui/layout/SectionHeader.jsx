import React from 'react';
import { tv } from 'tailwind-variants';
import { Icon } from '../icons';

// Styles for the section header
const sectionHeaderStyles = tv({
  base: 'text-center mb-16',
  variants: {
    variant: {
      light: 'text-dark-green-7',
      dark: 'text-white',
      accent: 'text-dark-yellow-1',
      lime: 'text-logo-lime',
    },
    size: {
      small: 'mb-8',
      medium: 'mb-12 md:mb-16',
      large: 'mb-16 md:mb-20',
    },
    isMobile: {
      true: 'mb-10',
      false: ''
    }
  },
  defaultVariants: {
    variant: 'light',
    size: 'medium',
    isMobile: false
  }
});

const titleContainerStyles = tv({
  base: 'relative w-full flex justify-center items-center px-10',
  variants: {
    hasDecorators: {
      true: 'before:content-[""] before:absolute before:top-1/2 before:right-[calc(50%+200px)] before:transform before:-translate-y-1/2 before:h-0.5 before:w-[25vw] before:z-1 before:pointer-events-none after:content-[""] after:absolute after:top-1/2 after:left-[calc(50%+200px)] after:transform after:-translate-y-1/2 after:h-0.5 after:w-[25vw] after:z-1 after:pointer-events-none',
      false: ''
    },
    variant: {
      light: 'before:bg-dark-green-5/20 after:bg-dark-green-5/20',
      dark: 'before:bg-white/20 after:bg-white/20',
      accent: 'before:bg-dark-yellow-1/30 after:bg-dark-yellow-1/30',
      lime: 'before:bg-logo-lime/30 after:bg-logo-lime/30'
    },
    isMobile: {
      true: 'px-6 before:hidden after:hidden',
      false: ''
    }
  },
  defaultVariants: {
    hasDecorators: true,
    variant: 'light',
    isMobile: false
  }
});

const titleContentStyles = tv({
  base: 'px-8 z-2 flex flex-col items-center gap-4 relative min-w-[400px]',
  variants: {
    isMobile: {
      true: 'min-w-0',
      false: ''
    }
  },
  defaultVariants: {
    isMobile: false
  }
});

const titleWrapperStyles = tv({
  base: 'flex flex-col items-center gap-4 w-full',
  variants: {
    isMobile: {
      true: 'gap-3',
      false: ''
    }
  },
  defaultVariants: {
    isMobile: false
  }
});

const titleIconStyles = tv({
  base: 'flex-shrink-0 w-12 h-12 transition-all duration-300',
  variants: {
    variant: {
      light: 'text-dark-green-6',
      dark: 'text-white',
      accent: 'text-dark-yellow-1',
      lime: 'text-logo-lime'
    },
    isMobile: {
      true: 'w-9 h-9',
      false: ''
    }
  },
  defaultVariants: {
    variant: 'light',
    isMobile: false
  }
});

const titleTextStyles = tv({
  base: 'text-4xl font-medium m-0 text-center leading-tight transition-all duration-300',
  variants: {
    variant: {
      light: 'text-dark-green-7',
      dark: 'text-white',
      accent: 'text-dark-yellow-1',
      lime: 'text-dark-green-7'
    },
    isMobile: {
      true: 'text-2xl',
      false: ''
    },
    size: {
      small: 'text-3xl md:text-4xl',
      medium: 'text-4xl',
      large: 'text-4xl md:text-5xl',
    }
  },
  defaultVariants: {
    variant: 'light',
    isMobile: false,
    size: 'medium'
  }
});

const subtitleStyles = tv({
  base: 'text-xl leading-relaxed max-w-[600px] m-0 text-center font-normal transition-all duration-300',
  variants: {
    variant: {
      light: 'text-dark-green-6',
      dark: 'text-white/90',
      accent: 'text-dark-yellow-1/90',
      lime: 'text-dark-green-6'
    },
    isMobile: {
      true: 'text-lg',
      false: ''
    },
    size: {
      small: 'text-lg md:text-xl',
      medium: 'text-xl',
      large: 'text-xl md:text-2xl',
    }
  },
  defaultVariants: {
    variant: 'light',
    isMobile: false,
    size: 'medium'
  }
});

/**
 * SectionHeader component for page section headers
 *
 * @param {Function|string} icon - Icon component or icon name string to display
 * @param {string} title - Section title
 * @param {string} subtitle - Section subtitle (optional)
 * @param {string} variant - Visual variant (light, dark, accent)
 * @param {string} size - Size variant (small, medium, large)
 * @param {boolean} isMobile - Whether in mobile view
 * @param {boolean} hasDecorators - Whether to show decorative lines
 * @param {string} className - Additional CSS classes
 * @param {Object} customIconStyles - Custom styling for icon container and icon (optional)
 */
export default function SectionHeader({
  icon,
  title,
  subtitle,
  variant = 'light',
  size = 'medium',
  isMobile = false,
  hasDecorators = true,
  className = '',
  customIconStyles = null
}) {
  // If icon is a React component, assign it to IconComponent
  const IconComponent = typeof icon !== 'string' ? icon : null;

  // Determine icon container classes (either custom or default)
  const iconContainerClasses = customIconStyles?.containerClassName ||
    `${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full flex items-center justify-center bg-logo-lime/15 border border-logo-lime/30`;

  // Determine icon content classes (either custom or default)
  const iconContentClasses = customIconStyles?.iconClassName || 'text-dark-green-7';

  return (
    <div className={sectionHeaderStyles({ variant, size, isMobile, className })}>
      <div className={titleContainerStyles({ hasDecorators, variant, isMobile })}>
        <div className={titleContentStyles({ isMobile })}>
          <div className={titleWrapperStyles({ isMobile })}>
            {icon && (
              typeof icon === 'string'
                ? (
                  <div className={iconContainerClasses}>
                    <Icon
                      name={icon}
                      sizeInPixels={isMobile ? 28 : 36}
                      weight="duotone"
                      className={iconContentClasses}
                    />
                  </div>
                )
                : (
                  <div className={iconContainerClasses}>
                    <IconComponent
                      size={isMobile ? 28 : 36}
                      weight="duotone"
                      className={iconContentClasses}
                    />
                  </div>
                )
            )}

            <h2 className={titleTextStyles({ variant, isMobile, size })}>
              {title}
            </h2>
          </div>

          {subtitle && (
            <p className={subtitleStyles({ variant, isMobile, size })}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}