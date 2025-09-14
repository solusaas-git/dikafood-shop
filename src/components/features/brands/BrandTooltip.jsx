import React from 'react';
import { Icon } from '@/components/ui/icons';
import { useTranslation } from '@/utils/i18n';
import translations from './translations/BrandComponents';
import ContentContainer from '@/components/ui/layout/ContentContainer';

/**
 * BrandTooltip component for displaying detailed brand information
 * Simplified for use with Tippy.js follow-cursor feature
 */
const BrandTooltip = ({
  brand,
  isMobile = false,
  onClose
}) => {
  const { t, locale } = useTranslation(translations);

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

  // Determine the appropriate icon based on the brand or default to 'bottle'
  const brandIcon = brand?.icon || 'bottle';

  // For mobile, render a drawer that slides up from the bottom
  if (isMobile) {
    return (
      <ContentContainer
        variant="default"
        headerVariant="lime"
        title={
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-logo-lime/15 mr-2">
              <Icon name={brandIcon} size="md" weight="duotone" className="text-dark-green-6" />
            </div>
            <span>{displayName}</span>
          </div>
        }
        className="rounded-t-2xl rounded-b-none shadow-lg"
        headerClassName="pr-2"
        bodyClassName="max-h-[60vh] overflow-y-auto pb-safe"
      >
        {/* Close button in header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-green-7/70 hover:text-dark-green-7 p-2"
          aria-label={t('close')}
        >
          <Icon name="x" size="md" weight="bold" />
        </button>

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
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-logo-lime/15">
                <Icon name="checkCircle" size="md" weight="duotone" className="text-dark-green-6" />
              </div>
            </div>
            <div className="flex-grow ml-3">
              <span className="text-sm font-medium text-dark-green-7/80">{t('characteristics')}:</span>
              <p className="text-base text-dark-green-7">{characteristics}</p>
            </div>
          </div>
        )}

        {/* Usage Row */}
        {usage && (
          <div className="flex items-start mb-3 p-3 bg-logo-lime/5 rounded-lg">
            <div className="flex-shrink-0 pt-0.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-logo-lime/15">
                <Icon name="leaf" size="md" weight="duotone" className="text-dark-green-6" />
              </div>
            </div>
            <div className="flex-grow ml-3">
              <span className="text-sm font-medium text-dark-green-7/80">{t('usage')}:</span>
              <p className="text-base text-dark-green-7">{usage}</p>
            </div>
          </div>
        )}
      </ContentContainer>
    );
  }

  // Desktop tooltip - simplified for Tippy.js with follow-cursor
  return (
    <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-dark-green-7 max-w-sm">
      {/* Tooltip arrow */}
      <div className="absolute -left-1 top-4 w-2 h-2 bg-white border-l border-b border-gray-200 transform rotate-45"></div>
      {/* Header */}
      <div className="flex items-center mb-2 pb-2 border-b border-logo-lime/20">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-logo-lime/15 mr-1.5">
          <Icon name={brandIcon} size="sm" weight="duotone" className="text-dark-green-6" />
        </div>
        <h3 className="text-base font-semibold text-dark-green-7">{displayName}</h3>
      </div>

      {/* Oil Type */}
      <div className="mb-2">
        <span className="text-xs font-medium text-dark-green-7/80">{t('type')}:</span>
        <p className="text-sm text-dark-green-7">{type}</p>
      </div>

      {/* Description */}
      <div className="mb-3">
        <span className="text-xs font-medium text-dark-green-7/80">{t('description')}:</span>
        <p className="text-sm text-dark-green-7">{description}</p>
      </div>

      {/* Characteristics Row */}
      {characteristics && (
        <div className="flex items-start mb-2 p-2 bg-logo-lime/5 rounded-lg">
          <div className="flex-shrink-0 pt-0.5">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-logo-lime/15">
              <Icon name="checkCircle" size="sm" weight="duotone" className="text-dark-green-6" />
            </div>
          </div>
          <div className="flex-grow ml-2">
            <span className="text-xs font-medium text-dark-green-7/80">{t('characteristics')}:</span>
            <p className="text-sm text-dark-green-7">{characteristics}</p>
          </div>
        </div>
      )}

      {/* Usage Row */}
      {usage && (
        <div className="flex items-start p-2 bg-logo-lime/5 rounded-lg">
          <div className="flex-shrink-0 pt-0.5">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-logo-lime/15">
              <Icon name="leaf" size="sm" weight="duotone" className="text-dark-green-6" />
            </div>
          </div>
          <div className="flex-grow ml-2">
            <span className="text-xs font-medium text-dark-green-7/80">{t('usage')}:</span>
            <p className="text-sm text-dark-green-7">{usage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandTooltip;