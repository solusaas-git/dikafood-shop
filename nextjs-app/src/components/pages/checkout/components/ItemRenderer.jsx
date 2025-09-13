import React from 'react';
import { CheckCircle, ShoppingCartSimple } from '@phosphor-icons/react';
import { 
  generateItemKey, 
  getItemTitle, 
  getItemImageSrc, 
  getItemQuantity, 
  getItemSize, 
  getItemPrice,
  formatItemProperties 
} from '../utils/itemUtils';

/**
 * Reusable component for rendering items in checkout
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to render
 * @param {string} props.dataSource - 'cart' or 'order'
 * @param {Function} props.formatPrice - Price formatting function
 * @param {string} props.variant - 'compact' or 'detailed'
 * @param {string} props.className - Additional CSS classes
 */
const ItemRenderer = ({ 
  items = [], 
  dataSource = 'cart', 
  formatPrice, 
  variant = 'detailed',
  className = '' 
}) => {
  if (!items.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucun article trouvé</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => {
        const itemKey = generateItemKey(item, index);
        const title = getItemTitle(item);
        const imageSrc = getItemImageSrc(item);
        const quantity = getItemQuantity(item);
        const size = getItemSize(item);
        const price = getItemPrice(item);
        const properties = formatItemProperties(item, dataSource);

        return (
          <div 
            key={itemKey}
            className={`
              flex items-center gap-3 p-3 bg-white/90 border border-logo-lime/20 rounded-lg 
              hover:shadow-sm transition-all
              ${variant === 'compact' ? 'py-2' : ''}
            `}
          >
            {/* Item Image */}
            <div className={`
              bg-white rounded-md flex items-center justify-center overflow-hidden shadow-sm border border-logo-lime/10
              ${variant === 'compact' ? 'h-10 w-10' : 'h-12 w-12'}
            `}>
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={title} 
                  className="h-full w-full object-cover" 
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-dark-green-6/70">
                  {variant === 'compact' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <ShoppingCartSimple size={20} />
                  )}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="flex-1">
              <div className={`font-medium text-dark-green-7 ${variant === 'compact' ? 'text-sm' : 'text-sm'}`}>
                {title}
              </div>
              
              {/* Item Properties and Details */}
              <div className={`text-dark-green-6 ${variant === 'compact' ? 'text-xs' : 'text-xs'}`}>
                {/* Size */}
                {size && (
                  <span className="mr-1">{size}</span>
                )}
                
                {/* Brand */}
                {(item.brand || item.brandDisplayName) && (
                  <span className="mr-1">
                    {size ? ' • ' : ''}
                    {item.brandDisplayName || item.brand}
                  </span>
                )}
                
                {/* Properties */}
                {properties.length > 0 && (
                  <span className="mr-1">
                    {(size || item.brand || item.brandDisplayName) ? ' • ' : ''}
                    {properties.join(', ')}
                  </span>
                )}
                
                {/* Quantity */}
                {quantity > 1 && (
                  <span>
                    {(size || item.brand || item.brandDisplayName || properties.length > 0) ? ' • ' : ''}
                    Qté: {quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className={`font-medium text-dark-green-7 ${variant === 'compact' ? 'text-sm' : 'text-sm'}`}>
              {formatPrice ? formatPrice(price) : `${price} MAD`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemRenderer; 