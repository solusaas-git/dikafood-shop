import React from 'react';
import './button.scss';

/**
 * Button Component
 *
 * @param {Object} props - The component props
 * @param {string} [props.variant='primary'] - Button variant: 'primary', 'secondary', 'text', 'carousel-nav', 'variant'
 * @param {string} [props.size='md'] - Button size: 'sm', 'md', 'lg'
 * @param {React.ReactNode} [props.icon] - Icon element to display
 * @param {string} [props.iconPosition='left'] - Icon position: 'left', 'right'
 * @param {boolean} [props.isActive=false] - Whether the button is active (for variant buttons)
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ButtonHTMLAttributes} props.rest - Additional button attributes
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isActive = false,
  className = '',
  children,
  ...rest
}) {
  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    icon && `btn--icon-${iconPosition}`,
    isActive && 'active',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...rest}>
      {icon && icon}
      {children}
    </button>
  );
}

/**
 * Carousel Navigation Button
 */
export function CarouselNavButton({ direction = 'next', icon, ...props }) {
  return (
    <Button
      variant="carousel-nav"
      className={`btn--${direction}`}
      icon={icon}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
      {...props}
    />
  );
}

/**
 * Variant Selector Button
 */
export function VariantButton({ isActive, children, ...props }) {
  return (
    <Button
      variant="variant"
      isActive={isActive}
      {...props}
    >
      {children}
    </Button>
  );
}