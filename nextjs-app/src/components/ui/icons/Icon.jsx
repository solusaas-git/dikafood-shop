import React from 'react';
import { tv } from 'tailwind-variants';
import { iconRegistry } from './iconRegistry';

const iconStyles = tv({
  base: 'inline-flex items-center justify-center',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    color: {
      // Brand colors
      'logo-green': 'text-logo-green',
      'logo-lime': 'text-logo-lime',
      'primary': 'text-dark-green-6',
      'secondary': 'text-dark-yellow-1',

      // Feedback colors
      'success': 'text-feedback-success',
      'error': 'text-feedback-error',
      'warning': 'text-feedback-warning',
      'info': 'text-logo-lime',

      // Neutral colors
      'white': 'text-white',
      'black': 'text-black',
      'gray': 'text-neutral-500',
      'dark': 'text-dark-green-7',
      'light': 'text-neutral-300',

      // Section colors
      'light-green': 'text-light-green-3',
      'dark-green': 'text-dark-green-6',
      'light-yellow': 'text-light-yellow-3',
      'dark-yellow': 'text-dark-yellow-3',
      'light-purple': 'text-light-purple-3',
      'dark-purple': 'text-dark-purple-3',

      // Inherit from parent
      'inherit': 'text-inherit',
      'current': 'text-current',
    },
    weight: {
      thin: '',
      light: '',
      regular: '',
      bold: '',
      fill: '',
      duotone: '',
    },
    animation: {
      none: '',
      spin: 'animate-spin',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'inherit',
    weight: 'duotone',
    animation: 'none',
  },
});

// Map common icon names to the correct icon registry keys
// All keys are now in lowercase for consistent case-insensitive lookup
const iconNameMap = {
  'arrowright': 'arrowright',
  'arrowdownright': 'arrowdownright',
  'downloadsimple': 'downloadsimple',
  'tree': 'tree',
  'certificate': 'certificate',
  'drop': 'drop',
  'userplus': 'userplus',
  'signin': 'signin',
  'caretdown': 'caretdown',
  'caretleft': 'caretleft',
  'caretright': 'caretright',
  'caretup': 'caretup',
  'house': 'house',
  'shopping-bag': 'shoppingbag',
  'article': 'article',
  'shoppingcart': 'shoppingcart',
  'x': 'x',
  'list': 'list',
  'listchecks': 'listchecks',
  'target': 'target',
  'buildings': 'buildings',
  'waves': 'waves',
  'plant': 'plant',
  'sunhorizon': 'sunhorizon',
  'facebooklogo': 'facebooklogo',
  'instagramlogo': 'instagramlogo',
  'twitterlogo': 'twitterlogo',
  'linkedinlogo': 'linkedinlogo',
  'user': 'user',
  'translate': 'translate',
  // Add missing mappings
  'envelope': 'envelope',
  'lock': 'lock',
  'eye': 'eye',
  'eyeslash': 'eyeslash',
  'check': 'check',
  'minus': 'minus',
  'plus': 'plus',
  'trash': 'trash',
  'arrowcircleleft': 'arrowcircleleft',
  'globe': 'globe',
  'gear': 'gear',
  'creditcard': 'creditcard',
  'signout': 'signout',
  'filearrowdown': 'filearrowdown',
  'storefront': 'storefront',
  'funnel': 'funnel',
  'magnifying-glass': 'magnifyingglass',
  'warning-circle': 'warningcircle',
  'warning': 'warning',
  // Reviews section icons
  'star': 'star',
  'chatcircletext': 'chatcircletext',
  'checkcircle': 'checkcircle',
  'quotes': 'quotes',
  // Legacy camelCase mappings - convert to lowercase
  'shoppingBag': 'shoppingbag',
  'signIn': 'signin',
};

/**
 * Base Icon component that renders icons with consistent styling
 *
 * @param {string} name - The name of the icon to use
 * @param {string} size - Size variant (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
 * @param {string} color - Color variant
 * @param {string} weight - Icon weight (thin, light, regular, bold, fill, duotone)
 * @param {string} animation - Animation to apply to the icon
 * @param {number} sizeInPixels - Optional explicit size in pixels (overrides size variant)
 * @param {string} className - Additional CSS classes
 */
export default function Icon({
  name,
  size,
  color,
  weight = 'duotone',
  animation,
  sizeInPixels,
  className,
  ...props
}) {
  // Convert name to lowercase to make icon lookup case-insensitive
  const normalizedName = name?.toLowerCase?.() || '';

  // Get the correct icon key from our mapping or use the normalized name
  const iconKey = iconNameMap[normalizedName] || normalizedName;

  // Get the icon component from our registry
  const IconComponent = iconRegistry[iconKey];

  if (!IconComponent) {
    console.warn(`Icon with name "${name}" (key: "${iconKey}") does not exist in our icon registry`);
    return null;
  }

  return (
    <span className={iconStyles({ size, color, weight, animation, className })}>
      <IconComponent
        size={sizeInPixels}
        weight={weight}
        {...props}
      />
    </span>
  );
}