import React, { useEffect, useRef } from 'react';
import { Card } from '../../../ui/data-display';
import { Icon } from '../../../ui/icons';
import { useTranslation } from '../../../../utils/i18n';
import translations from './translations/BrandComponents';

/**
 * BrandTooltip component for displaying detailed brand information
 * Displayed on hover or tap depending on device
 */
const BrandTooltip = ({
  brand,
  position,
  isMobile = false,
  onClose
}) => {
  const tooltipRef = useRef(null);
  const { t, locale } = useTranslation(translations);

  // Set tooltip position on mount and update
  useEffect(() => {
    if (!tooltipRef.current || !position || !brand) return;

    const el = tooltipRef.current;
    const rect = el.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Only position for desktop - mobile uses fixed positioning for drawer effect
    if (!isMobile) {
      // For desktop, position relative to cursor
      let left = position.x + 15; // Offset from cursor
      let top = position.y - 20; // Offset from cursor

      // Boundary checks
      if (left + rect.width > windowWidth - 20) {
        left = position.x - rect.width - 15; // Show on left side if no room on right
      }

      if (top + rect.height > windowHeight - 20) {
        top = windowHeight - rect.height - 20; // Keep from going offscreen at bottom
      }

      if (top < 20) {
        top = 20; // Keep from going offscreen at top
      }

      // Apply position for desktop
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    }
  }, [position, isMobile, brand]);

  // Early return if no brand is active
  if (!brand) {
    return null;
  }

  // Get localized content based on current language
  const displayName = brand && locale === 'ar' && brand.displayNameAr ? brand.displayNameAr : (brand?.displayName || 'Brand');
  const description = brand && locale === 'ar' && brand.descriptionAr ? brand.descriptionAr : (brand?.description || '');
  const characteristics = brand && locale === 'ar' && brand.characteristicsAr ? brand.characteristicsAr : brand?.characteristics;
  const usage = brand && locale === 'ar' && brand.usageAr ? brand.usageAr : brand?.usage;
  const type = brand && locale === 'ar' && brand.typeAr ? brand.typeAr : (brand?.type || '');

  // For mobile, render a drawer that slides up from the bottom
  if (isMobile) {
    return (
      <>
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-80 transition-opacity duration-300 ${brand ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose}
        ></div>

        {/* Bottom drawer */}
        <div
          ref={tooltipRef}
          className={`fixed bottom-0 left-0 right-0 z-80 transition-transform duration-300 ease-out ${brand ? 'translate-y-0' : 'translate-y-full'}`}
          style={{
            maxHeight: '70vh',
            visibility: brand ? 'visible' : 'hidden'
          }}
        >
          <Card
            variant="white"
            className="brand-tooltip shadow-lg border-t border-logo-lime/15 rounded-t-2xl rounded-b-none"
          >
            {/* Handle for drag interaction */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>

            {/* Header with brand name and close button */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-logo-lime/15">
              <h3 className="text-dark-green-7 font-semibold text-lg">{displayName}</h3>
              <button
                onClick={onClose}
                className="text-dark-green-7/70 hover:text-dark-green-7 transition-colors p-2"
                aria-label={t('close')}
              >
                <Icon name="x" size="md" weight="bold" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-1 pb-safe">
              {/* Oil Type */}
              <div className="mb-3">
                <span className="text-sm font-medium text-dark-green-7/80">{t('type')}:</span>
                <p className="text-base text-dark-green-7">{type}</p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <span className="text-sm font-medium text-dark-green-7/80">{t('description')}:</span>
                <p className="text-base text-dark-green-7">{description}</p>
              </div>

              {/* Characteristics Row */}
              {characteristics && (
                <div className="flex items-start mb-3 p-3 bg-logo-lime/5 rounded-lg">
                  <div className="flex-shrink-0 pt-0.5">
                    <Icon name="checkCircle" size="md" weight="duotone" className="text-logo-lime mr-2" />
                  </div>
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-dark-green-7/80">{t('characteristics')}:</span>
                    <p className="text-base text-dark-green-7">{characteristics}</p>
                  </div>
                </div>
              )}

              {/* Usage Row */}
              {usage && (
                <div className="flex items-start mb-3 p-3 bg-logo-lime/5 rounded-lg">
                  <div className="flex-shrink-0 pt-0.5">
                    <Icon name="leaf" size="md" weight="duotone" className="text-logo-lime mr-2" />
                  </div>
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-dark-green-7/80">{t('usage')}:</span>
                    <p className="text-base text-dark-green-7">{usage}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Desktop tooltip
  return (
    <div
      ref={tooltipRef}
      className={`fixed z-90 w-[300px] transition-opacity duration-200
        ${brand ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        visibility: brand ? 'visible' : 'hidden',
        // Initial position to be updated in useEffect
        left: position.x,
        top: position.y
      }}
    >
      <Card
        variant="white"
        className="brand-tooltip shadow-lg border border-logo-lime/15"
      >
        {/* Header with brand name */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-logo-lime/15">
          <h3 className="text-dark-green-7 font-semibold">{displayName}</h3>
        </div>

        {/* Oil Type */}
        <div className="mb-2">
          <span className="text-sm text-dark-green-7/80">{t('type')}:</span>
          <p className="text-sm text-dark-green-7">{type}</p>
        </div>

        {/* Description */}
        <div className="mb-3">
          <span className="text-sm text-dark-green-7/80">{t('description')}:</span>
          <p className="text-sm text-dark-green-7">{description}</p>
        </div>

        {/* Characteristics Row */}
        {characteristics && (
          <div className="flex items-start mb-2">
            <div className="flex-shrink-0 pt-0.5">
              <Icon name="checkCircle" size="sm" weight="duotone" className="text-logo-lime mr-1.5" />
            </div>
            <div className="flex-grow">
              <span className="text-sm text-dark-green-7/80">{t('characteristics')}:</span>
              <p className="text-sm text-dark-green-7">{characteristics}</p>
            </div>
          </div>
        )}

        {/* Usage Row */}
        {usage && (
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Icon name="leaf" size="sm" weight="duotone" className="text-logo-lime mr-1.5" />
            </div>
            <div className="flex-grow">
              <span className="text-sm text-dark-green-7/80">{t('usage')}:</span>
              <p className="text-sm text-dark-green-7">{usage}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BrandTooltip;