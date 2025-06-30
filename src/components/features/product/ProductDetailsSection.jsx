import React from 'react';
import { ContentContainer } from '@components/ui/layout';
import { ProductFeatureList } from '@/components/features/product';

/**
 * ProductDetailsSection component for displaying product description and details
 * @param {Object} props - Component props
 * @param {string} props.description - Product description
 * @param {Array} props.features - Array of feature objects with name and value properties
 * @param {Object} props.additionalDetails - Additional product details to display (key-value pairs)
 * @param {boolean} props.isDescriptionOpen - Whether description section is open
 * @param {Function} props.setIsDescriptionOpen - Function to toggle description section
 * @param {boolean} props.isDetailsOpen - Whether details section is open
 * @param {Function} props.setIsDetailsOpen - Function to toggle details section
 * @param {string} props.className - Additional class names
 */
const ProductDetailsSection = ({
  description,
  features = [],
  additionalDetails = {},
  isDescriptionOpen = true,
  setIsDescriptionOpen,
  isDetailsOpen = false,
  setIsDetailsOpen,
  className = ""
}) => {
  return (
    <div className={className}>
      {/* Description */}
      <ContentContainer
        title="Description"
        variant="default"
        headerVariant="default"
        collapsible
        defaultOpen={isDescriptionOpen}
        onToggle={(isOpen) => setIsDescriptionOpen && setIsDescriptionOpen(isOpen)}
        className="mb-4"
      >
        <p>{description}</p>
      </ContentContainer>

      {/* Details */}
      <ContentContainer
        title="Détails"
        variant="default"
        headerVariant="default"
        collapsible
        defaultOpen={isDetailsOpen}
        onToggle={(isOpen) => setIsDetailsOpen && setIsDetailsOpen(isOpen)}
        className="mb-4"
      >
        <ProductFeatureList
          features={features}
          additionalDetails={additionalDetails}
        />
      </ContentContainer>
    </div>
  );
};

export default ProductDetailsSection;