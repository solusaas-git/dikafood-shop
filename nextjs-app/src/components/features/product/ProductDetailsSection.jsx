import React from 'react';
import { ContentContainer } from '@components/ui/layout';
import { ProductFeatureList } from '@/components/features/product';

/**
 * ProductDetailsSection component for displaying product description and details
 * @param {Object} props - Component props
 * @param {string} props.description - Product description
 * @param {string} props.shortDescription - Product short description
 * @param {Array} props.features - Array of feature objects with name and value properties
 * @param {Array} props.allergens - Array of allergen strings
 * @param {Object} props.additionalDetails - Additional product details to display (key-value pairs)
 * @param {boolean} props.isDescriptionOpen - Whether description section is open
 * @param {Function} props.setIsDescriptionOpen - Function to toggle description section
 * @param {boolean} props.isDetailsOpen - Whether details section is open
 * @param {Function} props.setIsDetailsOpen - Function to toggle details section
 * @param {string} props.className - Additional class names
 */
const ProductDetailsSection = ({
  description,
  shortDescription,
  features = [],
  allergens = [],
  additionalDetails = {},
  isDescriptionOpen = true,
  setIsDescriptionOpen,
  isDetailsOpen = false,
  setIsDetailsOpen,
  className = ""
}) => {
  return (
    <div className={className}>
      {/* Short Description */}
      {shortDescription && (
        <ContentContainer
          title="Résumé"
          variant="default"
          headerVariant="default"
          collapsible
          defaultOpen={true}
          className="mb-4"
        >
          <p className="text-gray-700">{shortDescription}</p>
        </ContentContainer>
      )}

      {/* Description - Full Width */}
      <div className="mb-6">
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
      </div>

      {/* Features and Allergens - Side by Side Grid */}
      {((features && features.length > 0) || (allergens && allergens.length > 0)) && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features Column */}
            {features && features.length > 0 ? (
              <ContentContainer
                title="Bienfaits"
                variant="default"
                headerVariant="default"
                collapsible
                defaultOpen={true}
                className="h-fit"
              >
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-logo-lime rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </ContentContainer>
            ) : (
              <div></div>
            )}

            {/* Allergens Column */}
            {allergens && allergens.length > 0 ? (
              <ContentContainer
                title="Allergènes"
                variant="default"
                headerVariant="default"
                collapsible
                defaultOpen={true}
                className="h-fit"
              >
                <div className="space-y-2">
                  {allergens.map((allergen, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-red-700 text-sm">{allergen}</span>
                    </div>
                  ))}
                </div>
              </ContentContainer>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}

      {/* Additional Details - Full Width */}
      {additionalDetails && Object.keys(additionalDetails).length > 0 && (
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
            features={[]}
            additionalDetails={additionalDetails}
          />
        </ContentContainer>
      )}
    </div>
  );
};

export default ProductDetailsSection;