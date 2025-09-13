import React from 'react';
import { Icon } from '@components/ui';

/**
 * ProductFeatureList component for displaying product features
 * @param {Object} props - Component props
 * @param {Array} props.features - Array of feature objects with name and value properties
 * @param {Object} props.additionalDetails - Additional product details to display (key-value pairs)
 * @param {string} props.className - Additional class names
 */
const ProductFeatureList = ({
  features = [],
  additionalDetails = {},
  className = ""
}) => {
  return (
    <div className={className}>
      {Object.entries(additionalDetails).map(([key, value], index) => (
        <div key={`detail-${index}`} className="flex justify-between py-2 border-b border-neutral-100">
          <span className="text-neutral-600">{key}</span>
          {typeof value === 'object' && value.icon ? (
            <div className="flex items-center">
              <img
                src={value.icon}
                alt={value.text || key}
                className="w-5 h-4 mr-2"
              />
              <span className="font-medium">{value.text}</span>
            </div>
          ) : (
            <span className="font-medium">{value}</span>
          )}
        </div>
      ))}

      {features.map((feature, index) => (
        <div key={`feature-${index}`} className="flex justify-between py-2 border-b border-neutral-100">
          <span className="text-neutral-600">{feature.name}</span>
          {feature.value === true ? (
            <div className="flex items-center text-logo-lime">
              <Icon name="check" size="sm" className="mr-1" />
              <span>Oui</span>
            </div>
          ) : feature.value === false ? (
            <div className="flex items-center text-red-500">
              <Icon name="x" size="sm" className="mr-1" />
              <span>Non</span>
            </div>
          ) : (
            <span className="font-medium">{feature.value}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductFeatureList;