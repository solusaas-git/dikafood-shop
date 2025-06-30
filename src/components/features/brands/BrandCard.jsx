import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/data-display';
import { Icon } from '@/components/ui/icons';
import { useTranslation } from '@/utils/i18n';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '@/styles/tippy-custom.css';
import { followCursor } from 'tippy.js';
import { BrandTooltip } from '@/components/features/brands';
import useBreakpoint from '@/hooks/useBreakpoint';
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
const BrandCard = React.memo(({
  brand,
  className = ''
}) => {
  const [logoUrl, setLogoUrl] = useState(brand?.logo || '/images/brands/placeholder-logo.svg');
  const [error, setError] = useState(false);
  const { locale } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
    const brandsSection = document.getElementById('brands-section');
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

  // Mobile click handler
  const handleClick = () => {
    if (isMobile) {
      setShowTooltip(true);
    }
  };

  // Hover handlers
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Tooltip content
  const tooltipContent = <BrandTooltip brand={brand} isMobile={false} />;

  // Create the card content
  const cardContent = (
    <div className="brand-image w-full h-full flex items-center justify-center p-3 pt-6">
      {error ? (
        <div className="logo-fallback flex flex-col items-center justify-center text-dark-green-5">
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
          className="max-w-[85%] max-h-[90%] object-contain transition-transform duration-250"
          draggable="false"
          onError={() => setError(true)}
        />
      )}
    </div>
  );

  // Mobile tooltip drawer using portal
  const mobileTooltipPortal = showTooltip && isMobile && createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setShowTooltip(false)}
      ></div>
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

  // For mobile, render the card without Tippy
  if (isMobile) {
    return (
      <>
        <div
          className={`relative w-[240px] h-52 flex items-center justify-center transition-all duration-200 ease-in-out hover:-translate-y-1 ${className}`}
        >
          <Card
            variant="brandLime"
            padding="none"
            className="w-full h-full"
          >
            {cardContent}
          </Card>
          {/* Transparent overlay for click handling */}
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handleClick}
            aria-label={`View ${brand?.displayName || 'brand'} details`}
          />
        </div>
        {mobileTooltipPortal}
      </>
    );
  }

  // For desktop, create a wrapper with hover detection
  return (
    <div
      className={`relative w-[240px] h-52 flex items-center justify-center transition-all duration-200 ease-in-out ${isHovering ? '-translate-y-1' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        variant="brandLime"
        padding="none"
        className={`w-full h-full ${isHovering ? 'ring-2 ring-logo-lime' : ''}`}
      >
        {cardContent}
      </Card>

      {/* Transparent overlay for tooltip trigger */}
      <Tippy
        content={tooltipContent}
        plugins={[followCursor]}
        followCursor={true}
        arrow={false}
        interactive={false}
        appendTo={document.body}
        maxWidth={320}
        duration={0}
        delay={[0, 100]}
        zIndex={90}
        trigger="mouseenter"
        hideOnClick={false}
        popperOptions={{
          strategy: 'fixed',
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: document.body,
                padding: 8,
              },
            },
          ],
        }}
      >
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`View ${brand?.displayName || 'brand'} details`}
        />
      </Tippy>
    </div>
  );
});

export default BrandCard;