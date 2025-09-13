import React from 'react';
import PropTypes from 'prop-types';
import { tv } from 'tailwind-variants';

const sectionSkeletonStyles = tv({
  base: 'w-full animate-pulse',
  variants: {
    type: {
      // For sections with header + grid items (like BrandsSection)
      grid: '',
      // For sections with testimonials/cards in a row
      cards: '',
      // For sections with features or benefits
      features: '',
      // For sections with a form (like CatalogSection)
      form: '',
      // For generic sections
      default: ''
    },
    size: {
      sm: 'min-h-[200px]',
      md: 'min-h-[300px]',
      lg: 'min-h-[400px]'
    }
  },
  defaultVariants: {
    type: 'default',
    size: 'md'
  }
});

/**
 * SectionSkeleton - A skeleton loading component for sections
 *
 * Different layouts are available based on the section type:
 * - grid: For grid-based sections (like brand logos)
 * - cards: For sections with cards in a row (like testimonials)
 * - features: For sections with feature items (like benefits)
 * - form: For sections with a form layout (like catalog request)
 * - default: A generic section skeleton
 */
const SectionSkeleton = ({ type = 'default', size = 'md', className, ...props }) => {
  const baseStyles = sectionSkeletonStyles({ type, size, className });

  // Shared heading skeleton
  const HeaderSkeleton = () => (
    <div className="text-center mb-8">
      <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
    </div>
  );

  // Different skeleton layouts based on type
  const renderContent = () => {
    switch (type) {
      case 'grid':
        return (
          <>
            <HeaderSkeleton />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="aspect-square rounded-md bg-gray-200"></div>
              ))}
            </div>
          </>
        );

      case 'cards':
        return (
          <>
            <HeaderSkeleton />
            <div className="flex flex-nowrap overflow-hidden gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="w-full md:w-1/3 flex-shrink-0">
                  <div className="h-48 bg-gray-200 rounded-md mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                </div>
              ))}
            </div>
          </>
        );

      case 'features':
        return (
          <>
            <HeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="rounded-full w-16 h-16 bg-gray-200 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                </div>
              ))}
            </div>
          </>
        );

      case 'form':
        return (
          <div className="flex flex-row rounded-3xl overflow-hidden border border-gray-200">
            {/* Hero side - e.g., catalog preview */}
            <div className="hidden md:flex flex-1 bg-gray-100 p-8 items-center justify-center">
              <div className="w-[300px] h-[400px] rounded-lg bg-gray-200"></div>
            </div>

            {/* Form side */}
            <div className="w-full md:w-[480px] p-8 bg-gray-50">
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-200 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
              </div>

              {/* Form fields */}
              <div className="space-y-4 mt-8">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
                ))}
                <div className="h-12 bg-gray-300 rounded-2xl mt-6"></div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            <HeaderSkeleton />
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded-md"></div>
              <div className="h-24 bg-gray-200 rounded-md"></div>
            </div>
          </>
        );
    }
  };

  return (
    <div className={baseStyles} {...props}>
      <div className="container mx-auto px-4 py-12">
        {renderContent()}
      </div>
    </div>
  );
};

SectionSkeleton.propTypes = {
  /** Type of section to render skeleton for */
  type: PropTypes.oneOf(['grid', 'cards', 'features', 'form', 'default']),

  /** Size (height) of the skeleton */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  /** Additional CSS classes */
  className: PropTypes.string
};

export default SectionSkeleton;