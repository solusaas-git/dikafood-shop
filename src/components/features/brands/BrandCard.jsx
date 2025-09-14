import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/data-display';
import { Icon } from '@/components/ui/icons';
import { useTranslation } from '@/utils/i18n';
import useBreakpoint from '@/hooks/useBreakpoint';
import { BrandTooltip } from '@/components/features/brands';
import { createPortal } from 'react-dom';

/**
 * BrandCard component for displaying brand logos in the brands section
 *
 * @param {Object} brand - Brand data object
 * @param {string} brand.id - Brand ID
 * @param {string} brand.name - Brand name
 * @param {string} brand.displayName - Brand display name
 * @param {string} brand.logo - Brand logo URL
 * @param {string} className - Additional styling for the component
 */
const BrandCard = ({
  brand,
  className = ''
}) => {
  const [logoUrl, setLogoUrl] = useState(brand?.logo || '/images/brands/placeholder-logo.svg');
  const [error, setError] = useState(false);
  const { locale } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [isHovering, setIsHovering] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
    const path = getLogoPath();
    setLogoUrl(path);
    setError(false);
  }, [brand, locale, getLogoPath]);

  // Listen for forced refreshes from parent components
  useEffect(() => {
    const brandsSection = typeof document !== 'undefined' ? document.getElementById('brands-section') : null;
    if (!brandsSection) return;

    const handleLanguageChange = () => {
      const path = getLogoPath();
      setLogoUrl(path);
      setError(false);
    };

    brandsSection.addEventListener('language-changed', handleLanguageChange);
    return () => {
      brandsSection.removeEventListener('language-changed', handleLanguageChange);
    };
  }, [getLogoPath]);

  // Hover handlers
  const handleMouseEnter = (e) => {
    setIsHovering(true);
    if (!isMobile) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
      setShowTooltip(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isMobile && showTooltip) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowTooltip(false);
  };

  // Mobile click handler
  const handleClick = () => {
    if (isMobile) {
      setShowTooltip(true);
    }
  };

  // Create the card content
  const cardContent = (
    <div className="brand-image w-full h-full flex items-center justify-center p-6">
      {error ? (
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
  );

  // Custom tooltip (React 19 compatible)
  const desktopTooltip = showTooltip && !isMobile && typeof document !== 'undefined' && createPortal(
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: Math.min(tooltipPosition.x + 15, window.innerWidth - 320),
        top: Math.max(tooltipPosition.y - 200, 20),
        maxWidth: '300px'
      }}
    >
      <BrandTooltip brand={brand} isMobile={false} />
    </div>,
    document.body
  );

  // Mobile tooltip drawer
  const mobileTooltip = showTooltip && isMobile && typeof document !== 'undefined' && createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setShowTooltip(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 z-[110]">
        <BrandTooltip
          brand={brand}
          isMobile={true}
          onClose={() => setShowTooltip(false)}
        />
      </div>
    </div>,
    document.body
  );

  // For mobile, render the card with click tooltip
  if (isMobile) {
    return (
      <>
        <div
          className={`relative w-[240px] h-52 flex items-center justify-center transition-all duration-200 ease-in-out hover:-translate-y-1 ${className}`}
        >
          <Card
            variant="brandLime"
            padding="none"
            className="w-full h-full cursor-pointer"
            onClick={handleClick}
          >
            {cardContent}
          </Card>
        </div>
        {mobileTooltip}
      </>
    );
  }

  // For desktop, create a wrapper with hover detection and tooltip
  return (
    <>
      <div
        className={`relative w-[240px] h-52 flex items-center justify-center transition-all duration-200 ease-in-out ${isHovering ? '-translate-y-1' : ''} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Card
          variant="brandLime"
          padding="none"
          className={`w-full h-full ${isHovering ? 'ring-2 ring-logo-lime' : ''}`}
        >
          {cardContent}
        </Card>

        {/* Transparent overlay for hover detection */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`View ${brand?.displayName || 'brand'} details`}
        />
      </div>
      {desktopTooltip}
    </>
  );
};

export default BrandCard;