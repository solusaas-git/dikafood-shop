import React from 'react';

/**
 * BrandDisplay component for displaying brand information
 * @param {Object} props - Component props
 * @param {string|Object} props.brand - Brand name or object with name property
 * @param {boolean} props.isMobile - Whether the component is rendered on mobile
 * @param {boolean} props.showName - Whether to show the brand name
 * @param {string} props.size - Size of the brand logo (small, medium, large)
 * @param {string} props.className - Additional class names
 * @param {boolean} props.fullWidth - Whether the component should take full width
 */
const BrandDisplay = ({
  brand,
  isMobile = false,
  showName = false,
  size = 'medium',
  className = "",
  fullWidth = false
}) => {
  // Get brand name in a consistent format
  const brandName = typeof brand === 'string' ? brand : (brand?.name || '');
  const brandLogo = typeof brand === 'object' && brand?.logo ? brand.logo : null;

  // Size classes for the container and image
  const sizeClasses = {
    small: {
      container: 'w-12 h-12',
      image: 'w-9 h-9'
    },
    medium: {
      container: 'w-20 h-20',
      image: 'w-16 h-16'
    },
    large: {
      container: isMobile ? 'w-32 h-32' : 'w-28 h-28',
      image: isMobile ? 'w-28 h-28' : 'w-24 h-24'
    }
  };

  // Generate logo path from brand name
  const getBrandLogoPath = (name) => {
    const normalizedName = name ? name.toLowerCase().trim() : '';
    const map = {
      "oued-fes": "/images/brands/oued-fs-logo.svg",
      "oued fes": "/images/brands/oued-fs-logo.svg",
      "biladi": "/images/brands/biladi-logo.svg",
      "dika": "/images/brands/dika-logo.svg",
      "chourouk": "/images/brands/chourouk-logo.svg",
      "nouarati": "/images/brands/nouarati-logo.svg",
      "nourati": "/images/brands/nouarati-logo.svg", // Alternative spelling
    }
    
    // First check if we have a direct logo URL from the brand object
    if (brandLogo) return brandLogo;
    
    // Check our mapping
    if (map[normalizedName]) return map[normalizedName];
    
    // If no name provided, use placeholder
    if (!normalizedName) return '/images/placeholder-brand.svg';
    
    // Generate path from name as fallback
    return `/images/brands/${normalizedName.replace(/\s+/g, '-')}-logo.svg`;
  };

  const containerClasses = fullWidth ? "w-full" : "";
  const bgClasses = isMobile
    ? "bg-gradient-to-br from-light-yellow-1/20 to-logo-lime/20"
    : "bg-logo-lime/10";

  return (
    <div className={`${bgClasses} shadow-sm rounded-lg p-3 border border-logo-lime/20 flex items-center justify-center ${containerClasses} ${className}`}>
      <div className={`${sizeClasses[size].container} overflow-hidden rounded-full flex items-center justify-center`}>
        <img
          src={getBrandLogoPath(brandName)}
          alt={brandName}
          className={`${sizeClasses[size].image} object-contain`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder-brand.svg';
          }}
        />
      </div>
      {showName && brandName && <span className="ml-3 font-medium text-dark-green-6">{brandName}</span>}
    </div>
  );
};

export default BrandDisplay;