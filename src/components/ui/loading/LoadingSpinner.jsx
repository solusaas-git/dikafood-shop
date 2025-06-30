import React from 'react';
import { tv } from 'tailwind-variants';

// Styles for the spinner component
const styles = tv({
  base: 'inline-block rounded-full border-2 border-transparent border-t-current animate-spin',
  variants: {
    size: {
      xs: 'w-4 h-4 border-[1.5px]',
      sm: 'w-5 h-5 border-2',
      md: 'w-8 h-8 border-2',
      lg: 'w-12 h-12 border-3',
      xl: 'w-16 h-16 border-4',
    },
    color: {
      primary: 'text-dark-green-6',
      secondary: 'text-dark-yellow-1',
      white: 'text-white',
      gray: 'text-neutral-400',
    },
    speed: {
      slow: 'animate-spin-slow',
      normal: 'animate-spin',
      fast: 'animate-spin-fast',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    speed: 'normal',
  },
});

const containerStyles = tv({
  base: 'flex flex-col items-center justify-center',
  variants: {
    fullscreen: {
      true: 'fixed inset-0 bg-black/10 backdrop-blur-sm z-80',
      false: '',
    },
  },
  defaultVariants: {
    fullscreen: false,
  },
});

/**
 * LoadingSpinner component
 *
 * @param {string} size - Size of the spinner (xs, sm, md, lg, xl)
 * @param {string} color - Color of the spinner (primary, secondary, white, gray)
 * @param {string} speed - Speed of the animation (slow, normal, fast)
 * @param {boolean} fullscreen - Whether to display the spinner fullscreen with overlay
 * @param {string} text - Optional text to display below the spinner
 * @param {string} className - Additional classes for the spinner
 * @param {string} containerClassName - Additional classes for the container
 */
export default function LoadingSpinner({
  size,
  color,
  speed,
  fullscreen = false,
  text,
  className,
  containerClassName,
  ...props
}) {
  const spinner = (
    <div className={containerStyles({ fullscreen, className: containerClassName })}>
      <div
        className={styles({ size, color, speed, className })}
        role="status"
        aria-label="Loading"
        {...props}
      />
      {text && (
        <p className={`mt-2 text-sm ${color === 'white' ? 'text-white' : 'text-dark-green-7'}`}>
          {text}
        </p>
      )}
    </div>
  );

  return spinner;
}