import React from 'react';
import Icon from './Icon';

/**
 * NavigationIcon component for navigation elements like menus, breadcrumbs, and pagination
 *
 * @param {string} name - Icon name from Phosphor icons
 * @param {string} size - Size variant (xs, sm, md, lg, xl)
 * @param {boolean} active - Whether the navigation item is active
 * @param {string} direction - Direction for directional icons (left, right, up, down)
 * @param {string} className - Additional CSS classes
 */
export default function NavigationIcon({
  name,
  size = 'md',
  active = false,
  direction,
  className,
  ...props
}) {
  // Map direction to appropriate icon if specified
  let iconName = name;
  if (direction && !name) {
    const directionMap = {
      left: 'CaretLeft',
      right: 'CaretRight',
      up: 'CaretUp',
      down: 'CaretDown',
      back: 'ArrowLeft',
      forward: 'ArrowRight',
      upward: 'ArrowUp',
      downward: 'ArrowDown',
    };
    iconName = directionMap[direction] || 'CaretRight';
  }

  // Common navigation icons if name is a shorthand
  const commonNavIcons = {
    home: 'House',
    menu: 'List',
    close: 'X',
    back: 'ArrowLeft',
    next: 'ArrowRight',
    dropdown: 'CaretDown',
    breadcrumb: 'CaretRight',
    external: 'ArrowSquareOut',
    search: 'MagnifyingGlass',
    settings: 'Gear',
    user: 'User',
    cart: 'ShoppingCart',
    language: 'Translate',
  };

  // Use common icon name if provided as shorthand
  if (commonNavIcons[iconName]) {
    iconName = commonNavIcons[iconName];
  }

  return (
    <Icon
      name={iconName}
      size={size}
      color={active ? 'primary' : 'inherit'}
      weight={active ? 'fill' : 'regular'}
      className={className}
      {...props}
    />
  );
}