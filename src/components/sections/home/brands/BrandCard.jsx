import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../ui/data-display';
import { LoadingSpinner } from '../../../ui/loading';
import { Icon } from '../../../ui/icons';
import { useTranslation } from '../../../../utils/i18n';

/**
 * BrandCard component for displaying brand logos in the brands section
 *
 * @param {Object} brand - Brand data object
 * @param {string} brand.id - Brand ID
 * @param {string} brand.name - Brand name
 * @param {string} brand.displayName - Brand display name
 * @param {string} brand.logo - Brand logo URL
 * @param {Function} onMouseEnter - Mouse enter event handler for desktop tooltip
 * @param {Function} onMouseMove - Mouse move event handler for desktop tooltip
 * @param {Function} onMouseLeave - Mouse leave event handler for desktop tooltip
 * @param {Function} onClick - Click event handler for mobile detail view
 * @param {string} className - Additional styling for the component
 */
const BrandCard = ({
  brand,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
  className = '',
  active = false
}) => {
  const [logoUrl, setLogoUrl] = useState(brand?.logo || '/images/brands/placeholder-logo.svg');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { locale } = useTranslation();

  // Function to determine the correct logo path based on locale
  const getLogoPath = useCallback(() => {
    if (!brand || !brand.logo) {
      return '/images/brands/placeholder-logo.svg';
    }

    // Use Arabic variant of logos when Arabic language is selected
    // except for the Dika logo which remains the same
    if (locale === 'ar' && brand.id !== 'dika-extra') {
      const arabicLogoPath = brand.logo.replace('.svg', '-arabic.svg');
      return arabicLogoPath;
    } else {
      return brand.logo;
    }
  }, [brand, locale]);

  // Load logo on mount and whenever locale changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);

    const path = getLogoPath();
    setLogoUrl(path);

    // Use Image object to preload the image
    const img = new Image();
    img.src = path;
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [brand, locale, getLogoPath]);

  // Listen for forced refreshes from parent components
  useEffect(() => {
    const brandsSection = typeof document !== 'undefined' ? document.getElementById('brands-section') : null;
    if (!brandsSection) return;

    const handleLanguageChange = () => {
      setIsLoading(true);
      setError(false);

      const path = getLogoPath();
      setLogoUrl(path);

      // Use Image object to preload the image
      const img = new Image();
      img.src = path;
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setError(true);
        setIsLoading(false);
      };
    };

    brandsSection.addEventListener('language-changed', handleLanguageChange);
    return () => {
      brandsSection.removeEventListener('language-changed', handleLanguageChange);
    };
  }, [getLogoPath]);

  // Handler for mouseEnter that passes the brand to parent
  const handleMouseEnter = (e) => {
    if (onMouseEnter) onMouseEnter(e, brand);
  };

  return (
    <Card
      variant="brandLime"
      padding="none"
      className={`w-[280px] h-56 flex items-center justify-center transition-all duration-200 ease-in-out mx-auto ${
        active ? 'ring-2 ring-logo-lime -translate-y-1' : 'hover:-translate-y-1'
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="brand-image w-full h-full flex items-center justify-center p-6">
        {isLoading ? (
          <div className="logo-loading flex items-center justify-center w-full h-full">
            <LoadingSpinner size="md" className="text-dark-yellow-1" />
          </div>
        ) : error ? (
          <div className="logo-fallback flex flex-col items-center justify-center text-dark-green-5 w-full h-full">
            <Icon name="buildings" sizeInPixels={64} weight="duotone" className="mb-2 opacity-80" />
            <span className="text-2xl font-bold text-dark-green-6 uppercase">
              {(brand && (brand.displayName || brand.name)) ? (brand.displayName || brand.name).charAt(0) : "?"}
            </span>
          </div>
        ) : (
          <img
            key={`logo-${locale}-${brand?.id || 'unknown'}`}
            src={logoUrl}
            alt={`Logo ${brand && (brand.displayName || brand.name) ? (brand.displayName || brand.name) : 'Brand'}`}
            className="max-w-full max-h-full object-contain transition-transform duration-250"
            draggable="false"
            onError={() => setError(true)}
            style={{ 
              display: 'block',
              margin: 'auto',
              objectPosition: 'center'
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default BrandCard;