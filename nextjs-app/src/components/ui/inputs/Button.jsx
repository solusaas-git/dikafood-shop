import React from 'react';
import Link from 'next/link';
import { tv } from 'tailwind-variants';
import { ActionIcon } from '../icons';

const buttonStyles = tv({
  base: 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none',
  variants: {
    variant: {
      primary: 'bg-dark-yellow-1 text-dark-green-7 shadow-sm hover:bg-light-yellow-4 hover:translate-y-[-2px] hover:shadow-md active:translate-y-[1px] active:shadow-sm',
      secondary: 'bg-transparent text-dark-green-7 border-[1.5px] border-dark-yellow-1 hover:bg-dark-yellow-1 hover:text-dark-green-7 hover:translate-y-[-2px] active:translate-y-[1px]',
      secondaryLight: 'bg-white/10 text-light-yellow-1 border border-white/20 hover:bg-white/15 hover:text-dark-yellow-1 hover:border-white/30 hover:translate-y-[-2px] active:translate-y-[1px]',
      outline: 'bg-transparent border border-current text-dark-green-6 hover:bg-dark-green-1/10 hover:translate-y-[-2px] active:translate-y-[1px]',
      ghost: 'bg-transparent text-dark-green-6 hover:bg-dark-green-1/10 hover:translate-y-[-2px] active:translate-y-[1px]',
      link: 'bg-transparent p-0 h-auto text-dark-green-7 hover:text-dark-yellow-1 hover:translate-x-2 active:translate-x-0',
      ctaHero: 'bg-dark-yellow-1 text-dark-green-7 font-semibold border-none shadow-[0_4px_6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.08),0_0_0_4px_rgba(235,235,71,0.1)] hover:translate-y-[-2px] hover:bg-light-yellow-4 hover:shadow-[0_8px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),0_0_0_4px_rgba(235,235,71,0.2)] active:translate-y-[1px] active:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06),0_0_0_4px_rgba(235,235,71,0.15)]',
      lime: 'bg-logo-lime text-dark-green-7 shadow-sm border border-logo-lime hover:bg-logo-lime/90 hover:translate-y-[-2px] hover:shadow-md active:translate-y-[1px] active:shadow-none',
      limeOutline: 'bg-logo-lime/15 border border-logo-lime/50 text-dark-green-7 hover:bg-logo-lime/20 hover:border-logo-lime/70 hover:translate-y-[-2px] hover:shadow-sm active:translate-y-[1px] active:shadow-none',
      custom: ''
    },
    size: {
      xs: 'h-8 px-3 text-xs rounded-[16px]',
      sm: 'h-10 px-4 text-sm rounded-[20px]',
      md: 'h-12 px-6 text-base rounded-[24px]',
      lg: 'h-14 px-8 text-lg rounded-[28px]',
      xl: 'h-[72px] px-12 text-xl rounded-[36px] gap-5'
    },
    isActive: {
      true: ''
    },
    isFullWidth: {
      true: 'w-full',
      false: ''
    },
    isDisabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
      false: ''
    },
    isLoading: {
      true: 'relative cursor-wait',
      false: ''
    }
  },
  compoundVariants: [
    {
      variant: 'link',
      isActive: true,
      class: 'text-dark-yellow-1'
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    isFullWidth: false,
    isDisabled: false,
    isLoading: false
  }
});

/**
 * Button component for user interactions
 *
 * @param {string} label - Button text
 * @param {string} variant - Visual variant (primary, secondary, secondaryLight, outline, ghost, link, ctaHero, lime, limeOutline, custom)
 * @param {string} size - Size variant (xs, sm, md, lg, xl)
 * @param {string} to - Internal link destination (for React Router)
 * @param {string} href - External link destination (for regular anchor tags)
 * @param {string} target - Target for external links (e.g., "_blank")
 * @param {function} onClick - Click handler
 * @param {boolean} isActive - Whether the button is active
 * @param {boolean} isFullWidth - Whether the button should take full width
 * @param {boolean} isDisabled - Whether the button is disabled
 * @param {boolean} isLoading - Whether the button is in loading state
 * @param {string} type - Button type (button, submit, reset)
 * @param {string} iconName - Name of the icon to display
 * @param {string} iconPosition - Position of the icon (left, right)
 * @param {string} iconAnimation - Animation for the icon
 * @param {React.ReactNode} children - Custom button content
 * @param {string} className - Additional CSS classes
 */
export default function Button({
  label,
  variant,
  size,
  to,
  href,
  target,
  onClick,
  isActive,
  isFullWidth,
  isDisabled,
  isLoading,
  type = 'button',
  iconName,
  iconPosition = 'left',
  iconAnimation = 'none',
  children,
  className,
  ...props
}) {
  const buttonClasses = buttonStyles({
    variant,
    size,
    isActive,
    isFullWidth,
    isDisabled: isDisabled || isLoading,
    isLoading,
    className
  });

  // Handle icon animation for CTA hero button
  const iconClasses = variant === 'ctaHero'
    ? 'transition-transform duration-300 group-hover:translate-x-1 ml-1'
    : (iconPosition === 'right' ? 'ml-1' : 'mr-1');

  // Determine icon size based on button size
  const getIconSize = () => {
    if (variant === 'ctaHero') {
      switch (size) {
        case 'xl': return 'lg';
        case 'lg': return 'md';
        default: return 'md';
      }
    }

    switch (size) {
      case 'xs': return 'xs';
      case 'sm': return 'sm';
      case 'md': return 'md';
      case 'lg': return 'lg';
      case 'xl': return 'lg';
      default: return 'md';
    }
  };

  const loadingSpinner = (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
    </div>
  );

  const content = children || (
    <>
      {iconName && iconPosition === 'left' && !isLoading && (
        <ActionIcon
          name={iconName}
          size={getIconSize()}
          className={iconClasses}
          animation={iconAnimation}
        />
      )}
      {isLoading ? (
        <>
          <span className="opacity-0">{label}</span>
          {loadingSpinner}
        </>
      ) : (
        label
      )}
      {iconName && iconPosition === 'right' && !isLoading && (
        <ActionIcon
          name={iconName}
          size={getIconSize()}
          className={iconClasses}
          animation={iconAnimation}
        />
      )}
    </>
  );

  // Use Link for internal routes (Next.js)
  if (to) {
    return (
      <Link
        href={to}
        className={`group ${buttonClasses}`}
        {...props}
        aria-disabled={isDisabled || isLoading}
      >
        {content}
      </Link>
    );
  }

  // Use anchor tag for external links
  if (href) {
    return (
      <a
        href={href}
        className={`group ${buttonClasses}`}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        aria-disabled={isDisabled || isLoading}
        {...props}
      >
        {content}
      </a>
    );
  }

  // For custom variants that supply their own className, pass through the content but use the custom className
  if (variant === 'custom') {
    return (
      <button
        className={`group ${className || ''}`}
        onClick={onClick}
        type={type}
        disabled={isDisabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }

  // Use button for onClick functionality
  return (
    <button
      className={`group ${buttonClasses}`}
      onClick={onClick}
      type={type}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {content}
    </button>
  );
}