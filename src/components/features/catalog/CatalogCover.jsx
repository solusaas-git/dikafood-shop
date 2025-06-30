import React, { useState } from 'react';
import { paths } from '@/utils/paths';
import { useTranslation } from '@/utils/i18n';
import translations from '@/components/sections/home/translations/CatalogSection';

/**
 * CatalogCover component - Displays the catalog cover image with styling
 *
 * @param {string} className - Additional CSS classes
 */
const CatalogCover = ({ className = '' }) => {
  const { t, locale } = useTranslation(translations);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - top) / height - 0.5) * 2; // -1 to 1
    setMousePosition({ x, y });
  };

  return (
    <div
      className={`relative aspect-[3/4] w-full max-w-[600px] mx-auto perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-out transform-gpu ${isHovered ? 'catalog-cover-hover' : ''}`}
        style={{
          transform: isHovered
            ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)'
        }}
      >
        {/* Main catalog cover with gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-light-yellow-1/30 to-light-green-6/50"></div>

        {/* Catalog cover content */}
        <div className="relative h-full flex flex-col p-8 z-10">
          {/* Company logo */}
          <div className="flex justify-center mb-6 relative">
            <img
              src="/images/logo.svg"
              alt="DikaFood Logo"
              className="w-[180px] h-auto relative z-10 drop-shadow-sm"
            />
          </div>

          {/* Title */}
          <div className={`text-center mb-auto ${locale === 'ar' ? 'rtl' : ''}`}>
            <span className="block text-dark-green-7 text-lg font-normal opacity-90 mb-3">
              2024
            </span>
            <div className="flex justify-center w-full">
              <div className="catalog-title-container">
                <span className="block font-catalog text-5xl md:text-6xl mb-4 bg-gradient-to-r from-dark-green-7 to-dark-green-5 bg-clip-text text-transparent font-normal leading-[1.15] transition-all duration-300 drop-shadow-sm"
                      style={{ textShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.05)' }}>
                  {t('cover.collection')}<br />
                  <span className="inline-block bg-gradient-to-r from-dark-green-7 to-dark-green-5 bg-clip-text text-transparent">
                    {t('cover.premium')}
                  </span>
                </span>
              </div>
            </div>
            <p className="text-dark-green-7 font-normal opacity-90 mt-2 text-base md:text-lg"
               style={{ letterSpacing: '0.05em' }}>
              {t('cover.subtitle')}
            </p>
          </div>

          {/* Product images row - aligned by their base */}
          <div className="mt-auto pt-6">
            <div className="flex justify-center items-end mx-auto">
              <div className="flex items-end justify-center relative h-[260px]">
                {/* Products lined up horizontally with proper proportions */}
                {/* Yellow plastic bottle - Chourouk 25L */}
                <div className="relative mx-[-15px] z-[6] flex items-end">
                  <img
                    src="/images/products/chourouk-25L.png"
                    alt="Chourouk 25L"
                    className="h-auto w-[130px] object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Yellow tall bottle - Chourouk 10L */}
                <div className="relative mx-[-15px] z-[5] flex items-end">
                  <img
                    src="/images/products/chourouk-10L.png"
                    alt="Chourouk 10L"
                    className="h-auto w-[115px] object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Small bottle - Biladi 1L */}
                <div className="relative mx-[-15px] z-[4] flex items-end">
                  <img
                    src="/images/products/biladi-1L.png"
                    alt="Biladi 1L"
                    className="h-auto w-[85px] object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Box packaging - DikaFood box */}
                <div className="relative mx-[-15px] z-[3] flex items-end">
                  <img
                    src="/images/products/dika-5L.png"
                    alt="Dika 5L Box"
                    className="h-auto w-[110px] object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Small round bottle - DikaFood 500ML */}
                <div className="relative mx-[-15px] z-[2] flex items-end">
                  <img
                    src="/images/products/dika-500ML.png"
                    alt="Dika 500ML"
                    className="h-auto w-[80px] object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Small bottle with sunflower - Nouarti 1L */}
                <div className="relative mx-[-15px] z-[1] flex items-end">
                  <img
                    src="/images/products/nouarti-1L.png"
                    alt="Nouarti 1L"
                    className="h-auto w-[85px] object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogCover;