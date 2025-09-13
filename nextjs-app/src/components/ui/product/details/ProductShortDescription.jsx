import React, { useState } from 'react';
import { Icon } from '@components/ui/icons';

/**
 * ProductShortDescription component
 * Shows product description
 */
const ProductShortDescription = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <div
        className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200"
        onClick={toggleDescription}
      >
        <div className="flex items-center gap-2">
          <Icon name="info" weight="duotone" size="md" className="text-logo-lime" />
          <h3 className="text-lg font-medium text-dark-green-7">Description</h3>
        </div>
        <Icon
          name="caretright"
          weight="bold"
          size="md"
          className={`text-dark-green-7 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductShortDescription;