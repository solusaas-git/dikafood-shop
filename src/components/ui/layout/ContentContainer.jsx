import React, { useState } from 'react';
import { tv } from 'tailwind-variants';
import { Icon } from '../icons';

// Styles for the content container
const containerStyles = tv({
  base: 'bg-white rounded-xl overflow-hidden border border-logo-lime/30',
  variants: {
    variant: {
      default: 'border-logo-lime/30',
      neutral: 'border-neutral-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const headerStyles = tv({
  base: 'px-6 py-4 border-b flex items-center',
  variants: {
    variant: {
      default: 'bg-gradient-to-br from-light-yellow-1 to-light-yellow-3/70 border-logo-lime/30',
      lime: 'bg-gradient-to-br from-lime-50 to-lime-100/70 border-logo-lime/30',
      neutral: 'bg-gradient-to-r from-gray-50 to-gray-100/70 border-neutral-200',
    },
    collapsible: {
      true: 'cursor-pointer hover:bg-opacity-90',
    }
  },
  defaultVariants: {
    variant: 'default',
    collapsible: false,
  },
});

const bodyStyles = tv({
  base: 'p-6',
  variants: {
    align: {
      left: '',
      center: 'flex flex-col items-center',
    },
    hidden: {
      true: 'hidden',
    }
  },
  defaultVariants: {
    align: 'left',
    hidden: false,
  },
});

/**
 * ContentContainer component for displaying content in a styled container
 *
 * @param {string} variant - Container border variant (default, neutral)
 * @param {string} headerVariant - Header gradient variant (default, lime, neutral)
 * @param {string} title - Header title
 * @param {React.ReactNode} children - Container content
 * @param {string} className - Additional CSS classes for the container
 * @param {string} headerClassName - Additional CSS classes for the header
 * @param {string} bodyClassName - Additional CSS classes for the body
 * @param {string} bodyAlign - Body content alignment (left, center)
 * @param {boolean} collapsible - Whether the header can be clicked to collapse/expand the content
 * @param {boolean} defaultOpen - Default open state when collapsible is true
 * @param {function} onToggle - Callback function called when the container is toggled
 */
const ContentContainer = ({
  variant,
  headerVariant,
  title,
  children,
  className,
  headerClassName,
  bodyClassName,
  bodyAlign,
  collapsible = false,
  defaultOpen = true,
  onToggle,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    if (collapsible) {
      const newState = !isOpen;
      setIsOpen(newState);
      if (onToggle) {
        onToggle(newState);
      }
    }
  };

  return (
    <div className={containerStyles({ variant, className })} {...props}>
      {title && (
        <div
          className={headerStyles({ variant: headerVariant, collapsible, className: headerClassName })}
          onClick={toggleOpen}
        >
          <h2 className="text-xl font-medium text-dark-green-7">{title}</h2>
          {collapsible && (
            <Icon
              name="caretdown"
              size="sm"
              className={`text-dark-green-6 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      )}
      <div className={bodyStyles({ align: bodyAlign, hidden: collapsible && !isOpen, className: bodyClassName })}>
        {children}
      </div>
    </div>
  );
};

export default ContentContainer;