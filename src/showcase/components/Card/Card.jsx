import React from 'react';
import './card.scss';

/**
 * Card Component - Base card with customizable sections
 *
 * @param {Object} props - The component props
 * @param {string} [props.variant=''] - Card variant: 'product', 'premium', etc.
 * @param {React.ReactNode} [props.header] - Card header content
 * @param {React.ReactNode} [props.footer] - Card footer content
 * @param {React.ReactNode} [props.image] - Card image content
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ReactNode} props.children - Card body content
 */
export default function Card({
  variant = '',
  header,
  footer,
  image,
  className = '',
  children,
  ...rest
}) {
  const cardClasses = [
    'card',
    variant && `card--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {header && <div className="card__header">{header}</div>}
      {image && <div className="card__image">{image}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

/**
 * Product Card - Specialized card for product display
 *
 * @param {Object} props - The component props
 * @param {Object} props.product - Product data
 * @param {Object} [props.activeVariant] - Active product variant
 * @param {Function} [props.onVariantChange] - Function to call when variant changes
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function ProductCard({
  product,
  activeVariant,
  onVariantChange,
  className = '',
  ...rest
}) {
  // Function to get the appropriate icon based on brand
  const getBrandIcon = (brand) => {
    // This would be replaced with actual brand icon logic
    return null;
  };

  return (
    <Card
      variant="product"
      className={className}
      image={
        <img
          src={activeVariant?.image || product.image}
          alt={`${product.brand} - ${activeVariant?.size || 'Product'}`}
          width={200}
          height={200}
        />
      }
      footer={
        <div className="price-tag">
          {/* Tag icon would go here */}
          <span className="amount">{activeVariant?.price || product.price}</span>
          <span className="currency">MAD</span>
        </div>
      }
      {...rest}
    >
      {product.variants?.length > 0 && (
        <div className="variant-selector">
          {product.variants.map((variant) => (
            <button
              key={variant.size}
              className={`btn btn--variant ${activeVariant?.size === variant.size ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onVariantChange?.(variant);
              }}
            >
              {variant.size}
            </button>
          ))}
        </div>
      )}

      <div className="card__content">
        <div className="brand-tag">
          {getBrandIcon(product.brand)}
          {product.brand}
        </div>
        <h3 className="product-name">{product.name}</h3>
      </div>
    </Card>
  );
}