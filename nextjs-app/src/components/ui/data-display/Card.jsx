import React from 'react';
import { tv } from 'tailwind-variants';

// Styles for card components
const cardStyles = tv({
  base: 'overflow-hidden transition-all duration-300',
  variants: {
    variant: {
      default: 'bg-white rounded-xl shadow-sm',
      outlined: 'bg-white rounded-xl border border-neutral-200',
      elevated: 'bg-white rounded-xl shadow-md',
      flat: 'bg-transparent',
      interactive: 'bg-white rounded-xl shadow-sm hover:shadow-md hover:translate-y-[-4px]',
      brand: 'bg-light-yellow-1 border border-dark-yellow-1 rounded-xl shadow-sm cursor-pointer transition-transform duration-250 will-change-transform hover:translate-y-[-4px] hover:border-logo-lime',
      brandLime: 'bg-white border border-logo-lime rounded-xl shadow-sm cursor-pointer transition-all duration-300 will-change-transform hover:translate-y-[-2px] hover:border-logo-lime hover:bg-logo-lime/5 hover:shadow-md hover:shadow-logo-lime/15',
      brandTooltip: 'bg-white border border-logo-lime rounded-xl shadow-lg p-4 md:p-5 max-w-xs',
    },
    padding: {
      none: 'p-0',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'medium',
  },
});

const headerStyles = tv({
  base: 'flex items-center',
  variants: {
    padding: {
      none: 'p-0',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6',
    },
    hasDivider: {
      true: 'border-b border-neutral-200',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'medium',
    hasDivider: false,
  },
});

const bodyStyles = tv({
  base: '',
  variants: {
    padding: {
      none: 'p-0',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6',
    },
  },
  defaultVariants: {
    padding: 'medium',
  },
});

const footerStyles = tv({
  base: 'flex items-center',
  variants: {
    padding: {
      none: 'p-0',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6',
    },
    hasDivider: {
      true: 'border-t border-neutral-200',
      false: '',
    },
    align: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    padding: 'medium',
    hasDivider: true,
    align: 'between',
  },
});

/**
 * Card component for displaying content in a container
 *
 * @param {string} variant - Visual variant (default, outlined, elevated, flat, interactive, brand, brandTooltip)
 * @param {string} padding - Padding size (none, small, medium, large)
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler for interactive cards
 */
export function Card({
  variant,
  padding,
  children,
  className,
  onClick,
  ...props
}) {
  const isInteractive = variant === 'interactive' || variant === 'brand' || onClick;

  return (
    <div
      className={cardStyles({ variant, padding, className })}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card.Header component for card headers
 */
Card.Header = function CardHeader({
  padding,
  hasDivider,
  children,
  className,
  ...props
}) {
  return (
    <div className={headerStyles({ padding, hasDivider, className })} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Body component for card content
 */
Card.Body = function CardBody({
  padding,
  children,
  className,
  ...props
}) {
  return (
    <div className={bodyStyles({ padding, className })} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Footer component for card footers
 */
Card.Footer = function CardFooter({
  padding,
  hasDivider,
  align,
  children,
  className,
  ...props
}) {
  return (
    <div className={footerStyles({ padding, hasDivider, align, className })} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Image component for card images
 */
Card.Image = function CardImage({
  src,
  alt,
  className,
  ...props
}) {
  return (
    <div className={`w-full overflow-hidden ${className || ''}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        {...props}
      />
    </div>
  );
};

export default Card;