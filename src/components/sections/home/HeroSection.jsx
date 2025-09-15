import React, { useState, useEffect, useRef } from 'react';
import { Section } from '../../ui/layout';
import { FileArrowDown, Storefront } from '@phosphor-icons/react';
import { useTranslation } from '../../../utils/i18n';
import translations from './translations/HeroSection';
import { cn } from '@/utils/cn';
import { ProductCarousel } from '@/components/features/product';
import { scrollToCatalog } from '@/utils/scrollUtils';

export default function HeroSection() {
  const { t, locale } = useTranslation(translations);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);


  const scrollToCatalogSection = () => {
    scrollToCatalog({ behavior: 'smooth' });
  };

  // Parse the title with break and highlighted text
  const titleText = t('title');
  const mobileTitle = t('mobile_title') || 'Welcome to DikaFood';

  // Split the title into two parts for clean 2-line layout
  const titleParts = titleText.split('{break}');
  const firstLine = titleParts[0]?.trim() || '';
  const secondLineWithHighlight = titleParts[1]?.trim() || '';
  
  // Extract highlighted text from second line
  const [beforeHighlightSecondLine, withHighlight] = secondLineWithHighlight.split('<');
  const highlightedText = withHighlight ? withHighlight.replace('>', '') : '';
  const secondLineStart = beforeHighlightSecondLine?.trim() || '';

  // Format mobile title with brand highlight
  const formatMobileTitle = (title) => {
    if (!title) return null;

    // In English and French, "DikaFood" is at the end
    if (locale === 'en' || locale === 'fr') {
      const parts = title.split('DikaFood');
      if (parts.length > 1) {
        return (
          <>
            <span className="text-white">{parts[0]}</span>
            <span className="text-dark-yellow-1">DikaFood</span>
          </>
        );
      }
    }

    // For Arabic or any other case, just return the original
    return <span className="text-white">{title}</span>;
  };

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[75vh] overflow-hidden pb-12 md:pb-6" suppressHydrationWarning>
      {/* Hero Background - contained within hero section */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Section
          className={cn(
            "absolute inset-0 w-full h-full max-w-none md:px-0",
            mounted ? "opacity-100" : "opacity-0"
          )}
          background="image"
          backgroundSrc="/images/backgrounds/hero-banner"
          backgroundAlt="DikaFood Moroccan Olive Oil"
          backgroundHasWebp={true}
          backgroundHasRetina={false}
          backgroundHasResponsive={false}
          backgroundExtension="jpg"
          backgroundObjectFit="cover"
          backgroundObjectPosition="center center"
          backgroundCustomStyles={{
            height: '100%',
            width: '100%',
            transform: 'none',
            transition: 'none',
            willChange: 'auto',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          backgroundCustomContainerStyles={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            transform: 'none',
            transition: 'none',
            willChange: 'auto',
            position: 'absolute',
            inset: 0
          }}
          overlayType="custom"
          overlayColor="bg-black/100"
          padding="none"
          fullWidth={true}
        />
      </div>

      {/* Additional darker overlay for better text legibility */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10",
        mounted ? "opacity-100" : "opacity-0"
      )}></div>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-l from-black/40 to-transparent z-10",
        mounted ? "opacity-100" : "opacity-0"
      )}></div>

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-between w-full pt-[calc(var(--navbar-height)+1rem)] md:pt-[calc(var(--navbar-height)+4rem)] pb-6 md:pb-12">
        <div className="container mx-auto">
          {/* Hero Title and CTA */}
          <div className={cn(
            "w-full max-w-5xl mx-auto px-4 md:px-6 flex flex-col gap-3 md:gap-5 text-center transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {/* Unified title for mobile and desktop - Clean 2-line layout */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-medium font-heading text-white mb-4 md:mb-6 leading-tight max-w-4xl mx-auto">
              <span className="block text-white">{firstLine}</span>
              <span className="block">
                <span className="text-white">{secondLineStart} </span>
                <span className="text-dark-yellow-1">{highlightedText}</span>
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-3 mt-1 md:mt-2">
              {/* Download catalog button */}
              <button
                onClick={scrollToCatalogSection}
                className="group inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 h-[42px] md:h-[48px] text-sm md:text-base rounded-full bg-dark-yellow-1 hover:bg-dark-yellow-2 text-dark-green-7 font-semibold shadow-sm hover:translate-y-[-1px] hover:shadow-md active:translate-y-[0.5px] active:shadow-sm transition-all duration-300 whitespace-nowrap min-w-fit"
              >
                <FileArrowDown weight="duotone" size={14} className={`${locale === 'ar' ? 'ml-1' : 'mr-1'} transition-transform duration-300 group-hover:${locale === 'ar' ? 'translate-x-1' : '-translate-x-1'}`} />
                <span>{t('cta_primary')}</span>
              </button>

              {/* Discover products button */}
              <a
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 h-[42px] md:h-[48px] text-sm md:text-base rounded-full bg-white/10 hover:bg-white/20 backdrop-filter backdrop-blur-sm text-white hover:text-white border border-white/20 font-semibold transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[0.5px] whitespace-nowrap min-w-fit"
              >
                <Storefront weight="duotone" size={14} className={`${locale === 'ar' ? 'ml-1' : 'mr-1'} transition-transform duration-300 group-hover:${locale === 'ar' ? 'translate-x-1' : '-translate-x-1'}`} />
                <span>{t('cta_secondary')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Product Carousel - Now in a separate div outside the hero content */}
      <div className={cn(
        "relative z-20 w-full mt-4 md:mt-8 mb-8 md:mb-16 transition-all duration-700",
        mounted ? "opacity-100" : "opacity-0"
      )}>
        <div className="container mx-auto px-2 md:px-6 flex justify-center">
          <ProductCarousel
            className="w-full max-w-screen-xl"
          />
        </div>
      </div>
    </div>
  );
}