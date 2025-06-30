import React from 'react';
import { tv } from 'tailwind-variants';
import { FeedbackIcon } from '../icons';

// Styles for badge components
const badgeStyles = tv({
  base: 'inline-flex items-center text-xs font-medium',
  variants: {
    variant: {
      solid: '',
      outline: 'border',
      light: 'bg-opacity-15',
      dot: 'pl-1.5',
    },
    color: {
      primary: 'bg-dark-green-6 text-white',
      secondary: 'bg-dark-yellow-1 text-dark-green-7',
      success: 'bg-feedback-success text-white',
      error: 'bg-feedback-error text-white',
      warning: 'bg-feedback-warning text-dark-green-7',
      info: 'bg-logo-lime text-dark-green-7',
      gray: 'bg-neutral-500 text-white',
    },
    size: {
      sm: 'px-1.5 py-0.5 rounded text-[10px]',
      md: 'px-2 py-1 rounded-md',
      lg: 'px-2.5 py-1.5 rounded-md',
    },
    pill: {
      true: 'rounded-full',
    },
  },
  compoundVariants: [
    // Outline variant color styles
    { variant: 'outline', color: 'primary', class: 'text-dark-green-6 bg-transparent border-dark-green-6' },
    { variant: 'outline', color: 'secondary', class: 'text-dark-yellow-1 bg-transparent border-dark-yellow-1' },
    { variant: 'outline', color: 'success', class: 'text-feedback-success bg-transparent border-feedback-success' },
    { variant: 'outline', color: 'error', class: 'text-feedback-error bg-transparent border-feedback-error' },
    { variant: 'outline', color: 'warning', class: 'text-feedback-warning bg-transparent border-feedback-warning' },
    { variant: 'outline', color: 'info', class: 'text-logo-lime bg-transparent border-logo-lime' },
    { variant: 'outline', color: 'gray', class: 'text-neutral-500 bg-transparent border-neutral-500' },

    // Light variant color styles
    { variant: 'light', color: 'primary', class: 'text-dark-green-7 bg-dark-green-6' },
    { variant: 'light', color: 'secondary', class: 'text-dark-green-7 bg-dark-yellow-1' },
    { variant: 'light', color: 'success', class: 'text-dark-green-7 bg-feedback-success' },
    { variant: 'light', color: 'error', class: 'text-feedback-error bg-red-100' },
    { variant: 'light', color: 'warning', class: 'text-feedback-warning bg-yellow-100' },
    { variant: 'light', color: 'info', class: 'text-dark-green-7 bg-logo-lime' },
    { variant: 'light', color: 'gray', class: 'text-neutral-700 bg-neutral-200' },

    // Pill size adjustments for uniform circular shape
    { pill: true, size: 'sm', class: 'px-2' },
    { pill: true, size: 'md', class: 'px-2.5' },
    { pill: true, size: 'lg', class: 'px-3' },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    pill: false,
  },
});

// Dot styles for dot variant
const dotStyles = tv({
  base: 'inline-block w-2 h-2 rounded-full mr-1',
  variants: {
    color: {
      primary: 'bg-dark-green-6',
      secondary: 'bg-dark-yellow-1',
      success: 'bg-feedback-success',
      error: 'bg-feedback-error',
      warning: 'bg-feedback-warning',
      info: 'bg-logo-lime',
      gray: 'bg-neutral-500',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});

/**
 * Badge component for displaying status, labels, counts, etc.
 *
 * @param {string} children - Badge content
 * @param {string} variant - Visual variant (solid, outline, light, dot)
 * @param {string} color - Color variant (primary, secondary, success, error, warning, info, gray)
 * @param {string} size - Size variant (sm, md, lg)
 * @param {boolean} pill - Whether to use pill shape (rounded-full)
 * @param {boolean} withIcon - Whether to include an icon
 * @param {string} className - Additional CSS classes
 */
export default function Badge({
  children,
  variant,
  color,
  size,
  pill,
  withIcon = false,
  className,
  ...props
}) {
  return (
    <span
      className={badgeStyles({ variant, color, size, pill, className })}
      {...props}
    >
      {variant === 'dot' && (
        <span className={dotStyles({ color })} />
      )}

      {withIcon && variant !== 'dot' && (
        <FeedbackIcon
          type={['success', 'error', 'warning', 'info'].includes(color) ? color : 'info'}
          size="xs"
          className="mr-1"
        />
      )}

      {children}
    </span>
  );
}