import React, { forwardRef } from 'react';
import { tv } from 'tailwind-variants';
import { CaretDown } from '@phosphor-icons/react';

// Define the menu trigger styles using tailwind-variants
const menuTrigger = tv({
  base: 'inline-flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none',
  variants: {
    variant: {
      default: 'bg-white text-dark-green-7 border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100',
      transparent: 'bg-transparent text-white hover:text-dark-yellow-1 active:text-dark-yellow-1/80',
      glass: 'text-white hover:text-dark-yellow-1 active:text-dark-yellow-1/80', // Simplified, no backdrop-blur-sm as it's from the container
      yellow: 'bg-light-yellow-1 text-dark-green-7 border border-logo-lime/50 hover:bg-light-yellow-2 active:bg-light-yellow-2',
      green: 'bg-dark-green-7 text-white border border-dark-green-7/50 hover:bg-dark-green-8 active:bg-dark-green-8',
    },
    size: {
      xs: 'text-xs py-1 px-2 rounded',
      sm: 'text-sm py-1.5 px-2.5 rounded',
      md: 'text-sm py-2 px-3 rounded',
      lg: 'text-base py-2.5 px-4 rounded-md',
      icon: 'p-1.5',
    },
    rounded: {
      default: '',
      none: 'rounded-none',
      full: 'rounded-full',
      xl: 'rounded-xl',
    },
    isActive: {
      true: '',
    },
    isMobile: {
      true: 'w-full justify-center',
    },
    withCaret: {
      true: '',
    },
    hasChildren: {
      true: 'gap-2',
      false: '',
    },
    hasLabel: {
      true: 'gap-2',
      false: '',
    },
    isGrouped: {
      true: 'border-none rounded-none bg-transparent hover:text-dark-yellow-1 active:text-dark-yellow-1/80',
    },
  },
  compoundVariants: [
    // Active state variants for each style
    {
      variant: 'default',
      isActive: true,
      class: 'bg-neutral-50 shadow-sm',
    },
    {
      variant: 'transparent',
      isActive: true,
      class: 'text-dark-yellow-1',
    },
    {
      variant: 'glass',
      isActive: true,
      class: 'text-dark-yellow-1',
    },
    {
      variant: 'glass',
      isGrouped: true,
      isActive: true,
      class: 'text-dark-yellow-1',
    },
    {
      variant: 'yellow',
      isActive: true,
      class: 'bg-light-yellow-2',
    },
    {
      variant: 'green',
      isActive: true,
      class: 'bg-dark-green-8',
    },
    // Rounded full for mobile yellow variant
    {
      variant: 'yellow',
      isMobile: true,
      class: 'rounded-xl',
    },
    // Icon-only styles (no children)
    {
      hasChildren: false,
      size: 'md',
      class: 'p-2',
    },
    // Fix padding for grouped buttons - ensure consistent spacing
    {
      isGrouped: true,
      class: 'px-4 py-2.5 gap-2',
    },
    // Glass hover state
    {
      variant: 'glass',
      class: 'hover:text-dark-yellow-1 active:text-dark-yellow-1/80',
    },
    // Adjust padding for labels with consistent gap
    {
      hasLabel: true,
      class: 'px-4 gap-2',
    },
    // Ensure consistent mobile navbar spacing
    {
      isGrouped: false,
      size: 'icon',
      class: 'p-1.5',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
    rounded: 'default',
    hasChildren: false,
    hasLabel: false,
    isGrouped: false,
  },
});

// Styles for the caret icon
const caretStyles = tv({
  base: 'transition-all duration-200 flex-shrink-0',
  variants: {
    isOpen: {
      true: 'rotate-180',
    },
    variant: {
      default: 'text-neutral-500',
      transparent: 'text-current',
      glass: 'text-current',
      yellow: 'text-logo-lime',
      green: 'text-white',
    },
    hasChildren: {
      true: '',
      false: '',
    },
    hasLabel: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    hasChildren: false,
    hasLabel: false,
  },
});

// Styles for the counter/badge
const badgeStyles = tv({
  base: 'absolute -top-2 -right-2 text-[10px] font-medium h-5 min-w-5 rounded-full flex items-center justify-center',
  variants: {
    variant: {
      default: 'bg-dark-green-7 text-white',
      transparent: 'bg-dark-yellow-1 text-dark-green-7',
      glass: 'bg-dark-yellow-1 text-dark-green-7',
      yellow: 'bg-logo-lime text-white',
      green: 'bg-dark-yellow-1 text-dark-green-7',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Icon container for mobile menu with indicator
const mobileIconStyles = tv({
  base: 'relative flex items-center justify-center text-white hover:text-dark-yellow-1 active:text-dark-yellow-1/80 transition-all duration-200 z-100 focus:outline-none',
  variants: {
    withIndicator: {
      true: 'p-1',
    },
    isNavbarMobile: {
      true: 'p-1.5',
    }
  },
});

// Mobile indicator dot
const mobileIndicatorStyles = 'absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 bg-dark-yellow-1 rounded-full flex items-center justify-center pointer-events-none';

/**
 * Menu trigger component for dropdowns, navbars, and other menu types
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - The visual style of the trigger (default, transparent, glass, yellow, green)
 * @param {string} props.size - The size of the trigger (xs, sm, md, lg, icon)
 * @param {string} props.rounded - The border radius of the trigger (default, none, full, xl)
 * @param {boolean} props.isActive - Whether the trigger is in active state
 * @param {boolean} props.isMobile - Whether the trigger is in mobile view
 * @param {boolean} props.withCaret - Whether to show a caret icon
 * @param {boolean} props.isOpen - Whether the associated menu is open
 * @param {React.ReactNode} props.icon - The icon to show in the trigger
 * @param {React.ReactNode} props.label - Optional label text to display next to the icon
 * @param {React.ReactNode} props.children - The text content of the trigger
 * @param {number} props.count - Number for badge/counter display
 * @param {boolean} props.withMobileIndicator - Whether to show a yellow indicator dot (mobile-specific)
 * @param {boolean} props.isGrouped - Whether the trigger is part of a button group with shared container
 * @param {Function} props.onClick - Function to call when the trigger is clicked
 */
const MenuTrigger = forwardRef(({
  variant = 'default',
  size = 'md',
  rounded = 'default',
  isActive = false,
  isMobile = false,
  isNavbarMobile = false,
  withCaret = false,
  isOpen = false,
  icon,
  label,
  children,
  count,
  withMobileIndicator = false,
  isGrouped = false,
  onClick,
  className,
  ...props
}, ref) => {
  // Filter out React-specific props that shouldn't be passed to DOM elements
  const domProps = { ...props };
  const reactSpecificProps = ['component', 'ref', 'key'];
  reactSpecificProps.forEach(prop => {
    if (prop in domProps) {
      delete domProps[prop];
    }
  });

  // For mobile navbar buttons with special styling
  if (isNavbarMobile && size === 'icon') {
    return (
      <button
        ref={ref}
        className={mobileIconStyles({ withIndicator: true, isNavbarMobile })}
        onClick={onClick}
        aria-expanded={isOpen}
        type="button"
        data-state={isOpen ? "open" : "closed"}
        {...domProps}
      >
        <div className="relative flex flex-col items-center justify-center">
          {/* Icon */}
          {icon && (
            <div className="icon-container relative">
              {icon}
              {/* Mobile indicator dot */}
              {withMobileIndicator && (
                <span className="absolute -top-px -right-px w-2 h-2 bg-accent rounded-full border border-dark-green-8" />
              )}
            </div>
          )}

          {/* Bottom caret - moved to pseudo-element in CSS */}
          {isOpen && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 bg-dark-yellow-1 rounded-full flex items-center justify-center pointer-events-none">
              <CaretDown size={8} weight="fill" className="text-dark-green-7" />
            </div>
          )}
        </div>
      </button>
    );
  }

  // Regular button case
  const hasChildren = !!children;
  const hasLabel = !!label;

  return (
    <button
      ref={ref}
      className={menuTrigger({
        variant,
        size,
        rounded,
        isActive: isActive || isOpen,
        isMobile,
        withCaret,
        hasChildren,
        hasLabel,
        isGrouped,
        className,
      })}
      onClick={onClick}
      aria-expanded={isOpen}
      type="button"
      data-state={isOpen ? "open" : "closed"}
      {...domProps}
    >
      {/* Icon */}
      {icon && (
        <span className="flex items-center justify-center transition-all duration-200">
          {icon}
        </span>
      )}

      {/* Label */}
      {label && <span className="transition-all duration-200">{label}</span>}

      {/* Children content */}
      {children && <span className="transition-all duration-200">{children}</span>}

      {/* Caret */}
      {withCaret && !isNavbarMobile && (
        <CaretDown
          size={isMobile ? 10 : 12}
          weight="bold"
          className={caretStyles({
            isOpen,
            variant,
            hasChildren,
            hasLabel,
          })}
        />
      )}

      {/* Count badge */}
      {count > 0 && (
        <span className={badgeStyles({ variant })}>
          {count}
        </span>
      )}
    </button>
  );
});

MenuTrigger.displayName = 'MenuTrigger';

export default MenuTrigger;