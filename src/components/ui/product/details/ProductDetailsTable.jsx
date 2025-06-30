import React, { useState } from 'react';
import { Icon } from '@components/ui/icons';

/**
 * ProductDetailsTable component
 * Shows detailed information about the product
 */
const ProductDetailsTable = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <div
        className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200"
        onClick={toggleDetails}
      >
        <div className="flex items-center gap-2">
          <Icon name="clipboardtext" weight="duotone" size="md" className="text-logo-lime" />
          <h3 className="text-lg font-medium text-dark-green-7">Détails</h3>
        </div>
        <Icon
          name="caretright"
          weight="bold"
          size="md"
          className={`text-dark-green-7 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Marque</span>
            <span className="text-sm font-medium text-gray-800">
              {typeof product.brand === 'object'
                ? product.brand.name || 'Non spécifiée'
                : product.brand || 'Non spécifiée'}
            </span>
          </div>

          {product.origin && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Origine</span>
              <span className="text-sm font-medium text-gray-800">{product.origin}</span>
            </div>
          )}

          {product.acidity && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Acidité</span>
              <span className="text-sm font-medium text-gray-800">{product.acidity}</span>
            </div>
          )}

          {product.features && product.features.map((feature, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">{feature.name}</span>
              <span className="flex items-center gap-1 text-sm font-medium text-gray-800">
                <Icon name="check" size="sm" className="text-logo-lime" />
                <span>Oui</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsTable;