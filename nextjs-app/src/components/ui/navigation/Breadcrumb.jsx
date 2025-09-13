import React from 'react';
import Link from 'next/link';
import { tv } from 'tailwind-variants';
import { NavigationIcon } from '../icons';

// Styles for breadcrumb components
const styles = {
  container: tv({
    base: 'flex items-center flex-wrap',
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }),

  item: tv({
    base: 'inline-flex items-center',
    variants: {
      isActive: {
        true: 'font-medium text-dark-green-7',
        false: 'text-dark-green-6 hover:text-dark-green-7',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }),

  separator: 'mx-2 text-dark-green-5',

  homeIcon: 'mr-1',
};

/**
 * Breadcrumb component for showing navigation path
 *
 * @param {Array} items - Array of breadcrumb items with label, href, and isActive properties
 * @param {string} size - Size variant (sm, md, lg)
 * @param {boolean} showHomeIcon - Whether to show home icon for the first item
 * @param {string} className - Additional CSS classes
 */
export default function Breadcrumb({
  items = [],
  size,
  showHomeIcon = true,
  className,
  ...props
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={styles.container({ size, className })} {...props}>
      <ol className="flex items-center flex-wrap">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isActive = isLast || item.isActive;

          return (
            <li key={index} className={styles.item({ isActive })}>
              {!isFirst && (
                <span className={styles.separator} aria-hidden="true">
                  <NavigationIcon direction="right" size="sm" />
                </span>
              )}

              {item.href && !isActive ? (
                <Link href={item.href} className="hover:underline">
                  {isFirst && showHomeIcon && (
                    <NavigationIcon name="home" size="sm" className={styles.homeIcon} />
                  )}
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isActive ? 'page' : undefined}>
                  {isFirst && showHomeIcon && (
                    <NavigationIcon name="home" size="sm" className={styles.homeIcon} />
                  )}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}