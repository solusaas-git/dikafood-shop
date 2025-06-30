import React from 'react';
import Icon from './Icon';
import { tv } from 'tailwind-variants';

const actionIconStyles = tv({
  base: 'inline-flex items-center justify-center',
  variants: {
    variant: {
      default: '',
      button: 'p-2 rounded-full hover:bg-neutral-100 transition-colors',
      floating: 'p-3 rounded-full shadow-md hover:shadow-lg transition-all',
      badge: 'absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs',
    },
    color: {
      primary: 'text-dark-green-6 hover:text-dark-green-7',
      secondary: 'text-dark-yellow-1 hover:text-dark-yellow-2',
      white: 'text-white hover:text-neutral-200',
      danger: 'text-feedback-error hover:text-red-700',
      gray: 'text-neutral-500 hover:text-neutral-700',
    }
  },
  defaultVariants: {
    variant: 'default',
    color: 'primary',
  },
});

/**
 * ActionIcon component for buttons and interactive elements
 *
 * @param {string} name - Icon name from Phosphor icons
 * @param {string} variant - Visual variant (default, button, floating, badge)
 * @param {string} color - Color variant
 * @param {string} size - Size variant (sm, md, lg, xl)
 * @param {function} onClick - Click handler function
 * @param {string} className - Additional CSS classes
 */
export default function ActionIcon({
  name,
  variant,
  color,
  size = 'md',
  onClick,
  className,
  weight = 'duotone',
  animation = 'none',
  ...props
}) {
  // Common action icons if name is a shorthand
  const actionIconMap = {
    add: 'Plus',
    remove: 'Minus',
    delete: 'Trash',
    edit: 'PencilSimple',
    save: 'FloppyDisk',
    close: 'X',
    menu: 'List',
    share: 'ShareNetwork',
    download: 'DownloadSimple',
    upload: 'UploadSimple',
    refresh: 'ArrowsClockwise',
    favorite: 'Heart',
    cart: 'ShoppingCart',
    filter: 'Funnel',
    sort: 'SortAscending',
    settings: 'Gear',
    more: 'DotsThree',
    send: 'PaperPlaneTilt',
    user: 'User',
    signIn: 'SignIn',
    userPlus: 'UserPlus',
    caretDown: 'CaretDown',
    fileArrowDown: 'FileArrowDown',
    storefront: 'Storefront',
  };

  // Use mapped icon name if provided as shorthand
  const iconName = actionIconMap[name] || name;

  return (
    <span
      className={actionIconStyles({ variant, color, className })}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Icon
        name={iconName}
        size={size}
        weight={weight}
        animation={animation}
        {...props}
      />
    </span>
  );
}