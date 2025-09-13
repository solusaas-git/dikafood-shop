import React from 'react';
import { tv } from 'tailwind-variants';

// Styles for skeleton components
const skeletonStyles = tv({
  base: 'animate-skeleton bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:400%_100%]',
  variants: {
    variant: {
      text: 'h-4 rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
      avatar: 'rounded-full',
      button: 'rounded-md h-10',
      card: 'rounded-lg',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  compoundVariants: [
    {
      variant: 'text',
      size: 'xs',
      class: 'h-3',
    },
    {
      variant: 'text',
      size: 'sm',
      class: 'h-4',
    },
    {
      variant: 'text',
      size: 'md',
      class: 'h-5',
    },
    {
      variant: 'text',
      size: 'lg',
      class: 'h-6',
    },
    {
      variant: 'text',
      size: 'xl',
      class: 'h-7',
    },
    {
      variant: 'avatar',
      size: 'xs',
      class: 'w-6 h-6',
    },
    {
      variant: 'avatar',
      size: 'sm',
      class: 'w-8 h-8',
    },
    {
      variant: 'avatar',
      size: 'md',
      class: 'w-10 h-10',
    },
    {
      variant: 'avatar',
      size: 'lg',
      class: 'w-12 h-12',
    },
    {
      variant: 'avatar',
      size: 'xl',
      class: 'w-16 h-16',
    },
  ],
  defaultVariants: {
    variant: 'text',
    size: 'md',
  },
});

/**
 * Skeleton component for loading states
 */
export function Skeleton({
  variant,
  size,
  width,
  className,
  style,
  ...props
}) {
  const widthStyle = width ? { width } : {};

  return (
    <div
      className={skeletonStyles({ variant, size, className })}
      style={{ ...widthStyle, ...style }}
      {...props}
    />
  );
}

/**
 * TextSkeleton component for loading text content
 */
export function TextSkeleton({ lines = 3, lastLineWidth = '70%', gap = 'gap-2', ...props }) {
  return (
    <div className={`flex flex-col ${gap}`}>
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} variant="text" {...props} />
      ))}
      <Skeleton
        variant="text"
        style={{ width: lastLineWidth }}
        {...props}
      />
    </div>
  );
}

// Default export for convenience
export default Skeleton;