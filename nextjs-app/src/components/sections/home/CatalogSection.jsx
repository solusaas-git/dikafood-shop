import React, { useState, useCallback, useEffect } from 'react';
import { paths } from '@/utils/paths';
import CatalogForm from '@/components/features/catalog/CatalogForm';
import CatalogCover from '@/components/features/catalog/CatalogCover';
import CatalogDownloadModal from '@/components/features/catalog/CatalogDownloadModal';
import { api } from '@/services/api';
import { Icon } from '@/components/ui/icons';
import { useTranslation } from '@/utils/i18n';
import translations from './translations/CatalogSection';
import SectionDecorations from '@/components/ui/decorations/SectionDecorations';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * CatalogSection component - Section for catalog download
 * Shows a form to request catalog download and a preview of the catalog
 */
const CatalogSection = () => {
  const { t, locale } = useTranslation(translations);
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Handler for successful form submission
  const handleFormSuccess = useCallback(({ userData }) => {
    setSubmittedData(userData);
    setIsModalOpen(true);
    
    // Show success message if email was sent
    if (userData.emailSent) {
      console.log('✅ Catalog sent successfully to:', userData.email);
    }
  }, []);

  // Handler for catalog download from modal
  const handleDownload = async (language) => {
    try {
      if (!submittedData?.catalogUrls?.[language]) {
        throw new Error(t('modal.download.not_available'));
      }

      // Download catalog using new API service
      return await api.getCatalog(language);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Modal close handler
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSubmittedData(null);
  }, []);

  const isRTL = locale === 'ar';

  return (
    <>
      <section
        id="catalog"
        className="relative overflow-hidden px-4 sm:px-6 md:px-8 py-12 md:py-16 lg:py-20"
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-logo-lime/5 via-logo-lime/10 to-light-green-1/15 pointer-events-none"></div>

        {/* Section Decorations */}
        <SectionDecorations
          variant="lime"
          positions={['top-right', 'bottom-left']}
          customStyles={{
            topRight: { opacity: 0.25 },
            bottomLeft: { opacity: 0.25 }
          }}
        />

        {/* Main content container */}
        <div className={`flex flex-col ${isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'} rounded-3xl overflow-hidden border border-logo-lime/30 relative z-10 mx-auto max-w-screen-lg`}>
          {/* Catalog Preview Side */}
          <div className="w-full lg:w-1/2 bg-light-yellow-1/30 flex items-center justify-center p-2 py-6 md:p-4 md:py-7 lg:py-8">
            <CatalogCover className="transform scale-[0.58] sm:scale-[0.62] md:scale-[0.68] origin-center" />
          </div>

          {/* Form Side */}
          <div className={`w-full lg:w-1/2 bg-white flex flex-col border-${isRTL ? 'r' : 'l'} border-logo-lime/30`}>
            {/* Form Header */}
            <div className="p-4 pt-7 pb-5 md:pt-8 md:pb-6 border-b border-logo-lime/20 bg-gradient-to-br from-light-yellow-1/70 to-light-yellow-1/40 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center mx-auto mb-4 md:mb-5">
                <Icon
                  name="clipboard"
                  sizeInPixels={isMobile === null ? 28 : isMobile ? 28 : 36}
                  weight="duotone"
                  className="text-dark-green-7"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-dark-green-7 mb-1">{t('title')}</h2>
              <p className="text-xs md:text-sm text-dark-green-6 max-w-xs mx-auto">{t('subtitle')}</p>
            </div>

            {/* Form Content */}
            <div className="p-4 py-7 md:p-6 md:py-8 lg:py-9 bg-white">
              <CatalogForm onSubmitSuccess={handleFormSuccess} className="max-w-sm mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <CatalogDownloadModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          userData={submittedData}
          onDownload={handleDownload}
        />
      )}
    </>
  );
};

export default CatalogSection;