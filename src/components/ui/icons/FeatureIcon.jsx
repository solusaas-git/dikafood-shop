import React from 'react';
import Icon from './Icon';
import { tv } from 'tailwind-variants';

const featureIconStyles = tv({
  base: 'rounded-full flex items-center justify-center',
  variants: {
    variant: {
      primary: 'bg-dark-yellow-1/20 text-dark-yellow-1',
      green: 'bg-dark-green-6/20 text-dark-green-6',
      lightGreen: 'bg-light-green-3/30 text-dark-green-6',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-light-purple-3/30 text-dark-purple-3',
      white: 'bg-white/90 text-dark-green-6',
      outlined: 'bg-transparent border-2 border-current',
    },
    size: {
      sm: 'p-2 text-lg',
      md: 'p-3 text-xl',
      lg: 'p-4 text-2xl',
      xl: 'p-5 text-3xl',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

/**
 * FeatureIcon component for section headers, benefits, and feature highlights
 *
 * @param {string} name - Icon name from Phosphor icons
 * @param {string} variant - Visual variant (primary, green, lightGreen, purple, white, outlined)
 * @param {string} size - Size variant (sm, md, lg, xl)
 * @param {string} className - Additional CSS classes
 */
export default function FeatureIcon({
  name,
  variant,
  size,
  className,
  ...props
}) {
  // Common feature icons if name is a shorthand
  const featureIconMap = {
    leaf: 'Leaf',
    medal: 'Medal',
    package: 'Package',
    shield: 'ShieldStar',
    heart: 'Heart',
    handshake: 'Handshake',
    users: 'Users',
    buildings: 'Buildings',
    sustainability: 'Tree',
    quality: 'Medal',
    delivery: 'Package',
    satisfaction: 'ShieldStar',
    organic: 'Leaf',
    natural: 'Plant',
    eco: 'Leaf',
    tree: 'Tree',
    certificate: 'Certificate',
    drop: 'Drop',
    water: 'Drop',
    arrowRight: 'ArrowRight',
  };

  // Use mapped icon name if provided as shorthand
  const iconName = featureIconMap[name] || name;

  // Calculate icon size based on container size
  const iconSizeMap = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
  };

  return (
    <div className={featureIconStyles({ variant, size, className })}>
      <Icon
        name={iconName}
        sizeInPixels={iconSizeMap[size] || 32}
        weight="duotone"
        {...props}
      />
    </div>
  );
}