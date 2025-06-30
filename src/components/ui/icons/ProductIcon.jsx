import React from 'react';
import Icon from './Icon';
import { tv } from 'tailwind-variants';

const productIconStyles = tv({
  base: 'inline-flex items-center justify-center',
  variants: {
    variant: {
      default: '',
      badge: 'rounded-full p-1 text-xs mr-1',
      tag: 'rounded p-0.5 text-xs mr-1',
      pill: 'rounded-full px-2 py-0.5 text-xs flex items-center gap-1',
    },
    color: {
      organic: 'bg-light-green-1/20 text-dark-green-6',
      water: 'bg-blue-100/30 text-blue-700',
      origin: 'bg-amber-100/30 text-amber-700',
      sun: 'bg-yellow-100/30 text-yellow-700',
      quality: 'bg-purple-100/30 text-purple-700',
      price: 'bg-red-100/30 text-red-700',
      shipping: 'bg-gray-100/30 text-gray-700',
    }
  },
  defaultVariants: {
    variant: 'default',
    color: 'organic',
  },
});

/**
 * ProductIcon component for product features and attributes
 *
 * @param {string} feature - Product feature type (organic, water, origin, sun, quality, price, shipping)
 * @param {string} variant - Visual variant (default, badge, tag, pill)
 * @param {string} label - Optional text label for pill variant
 * @param {string} className - Additional CSS classes
 */
export default function ProductIcon({
  feature,
  variant,
  label,
  className,
  ...props
}) {
  // Map feature types to appropriate icons
  const featureIconMap = {
    organic: 'Leaf',
    water: 'Drop',
    origin: 'MapPin',
    sun: 'Sun',
    climate: 'SunHorizon',
    waves: 'Waves',
    quality: 'Medal',
    price: 'Tag',
    shipping: 'Truck',
    discount: 'Percent',
    new: 'Sparkle',
    bestseller: 'Trophy',
    rating: 'Star',
  };

  const iconName = featureIconMap[feature] || 'Info';
  const showLabel = variant === 'pill' && label;

  return (
    <span className={productIconStyles({ variant, color: feature, className })}>
      <Icon
        name={iconName}
        size={variant === 'default' ? 'md' : 'sm'}
        weight="fill"
        {...props}
      />
      {showLabel && <span className="text-xs">{label}</span>}
    </span>
  );
}