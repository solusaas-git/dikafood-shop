import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { BrandCard } from '@/components/features/brands';
import PropTypes from 'prop-types';
import useBreakpoint from '@/hooks/useBreakpoint';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

/**
 * EmblaBrandCarousel component for the brands section
 * Displays brand cards in a carousel using Embla Carousel
 */
const EmblaBrandCarousel = React.forwardRef(function EmblaBrandCarousel(props, ref) {
  const { isMobile, isTablet } = useBreakpoint();
  const [isVisible, setIsVisible] = useState(true);
  const carouselRef = useRef(null);
  const [shouldShowControls, setShouldShowControls] = useState(true);
  const [allCardsVisible, setAllCardsVisible] = useState(false);
  const reInitRef = useRef(false);

  const {
    brands,
    className,
    refreshTrigger,
    locale
  } = props || {};

  // Embla carousel options - show maximum brands on load
  const emblaOptions = {
    align: 'center',
    containScroll: 'keepSnaps',
    dragFree: false,
    loop: true,
    slidesToScroll: 1,
    draggable: true,
    skipSnaps: false,
    startIndex: 0
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(true);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Check if all slides are visible to hide controls (optimized)
  const checkIfAllSlidesVisible = useCallback(() => {
    if (!emblaApi || !carouselRef.current) return;

    // Use requestAnimationFrame to batch DOM reads
    requestAnimationFrame(() => {
      if (!emblaApi || !carouselRef.current) return;
      
      // Get the container width
      const containerWidth = carouselRef.current.clientWidth;

      // Get the total width of all slides
      const slidesWidth = emblaApi.slideNodes().reduce((total, slide) => {
        return total + slide.offsetWidth;
      }, 0);

      // If all slides fit within the container, hide controls
      setShouldShowControls(slidesWidth > containerWidth);
    });
  }, [emblaApi]);

  // Throttled version to prevent excessive calls
  const throttledCheckIfAllSlidesVisible = useCallback(() => {
    if (checkIfAllSlidesVisible._throttleTimer) return;
    
    checkIfAllSlidesVisible._throttleTimer = setTimeout(() => {
      checkIfAllSlidesVisible();
      checkIfAllSlidesVisible._throttleTimer = null;
    }, 100);
  }, [checkIfAllSlidesVisible]);

  // Embla carousel navigation buttons
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  // Update button states
  const updateButtonStates = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Initial setup and event listeners
  useEffect(() => {
    if (!emblaApi) return;

    // Add event listeners for resize and slide changes with throttling
    window.addEventListener('resize', throttledCheckIfAllSlidesVisible, { passive: true });
    emblaApi.on('reInit', throttledCheckIfAllSlidesVisible);
    emblaApi.on('resize', throttledCheckIfAllSlidesVisible);
    emblaApi.on('select', updateButtonStates);
    emblaApi.on('reInit', updateButtonStates);

    // Initial check
    checkIfAllSlidesVisible();
    updateButtonStates();

    // On desktop, if all slides fit, center them by going to a middle slide
    setTimeout(() => {
      if (!isMobile && emblaApi && carouselRef.current) {
        const containerWidth = carouselRef.current.clientWidth;
        const slidesWidth = emblaApi.slideNodes().reduce((total, slide) => {
          return total + slide.offsetWidth;
        }, 0);
        
        // If all slides fit, center them by scrolling to the middle
        if (slidesWidth <= containerWidth) {
          const middleIndex = Math.floor(brands.length / 2);
          emblaApi.scrollTo(middleIndex, false); // false = no animation
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', throttledCheckIfAllSlidesVisible);
      emblaApi.off('reInit', throttledCheckIfAllSlidesVisible);
      emblaApi.off('resize', throttledCheckIfAllSlidesVisible);
      emblaApi.off('select', updateButtonStates);
      emblaApi.off('reInit', updateButtonStates);
      
      // Clear any pending throttle timer
      if (checkIfAllSlidesVisible._throttleTimer) {
        clearTimeout(checkIfAllSlidesVisible._throttleTimer);
        checkIfAllSlidesVisible._throttleTimer = null;
      }
    };
  }, [emblaApi, checkIfAllSlidesVisible, throttledCheckIfAllSlidesVisible, updateButtonStates, isMobile, brands.length]);

  // Empty state
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full relative flex flex-col items-center ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Carousel Container */}
      <div className="relative w-full mx-auto px-4 md:px-8 flex justify-center" ref={carouselRef}>
        {/* Viewport */}
        <div className={`overflow-hidden w-full ${isMobile ? 'max-w-[420px]' : 'max-w-[900px] md:max-w-[1100px] lg:max-w-screen-xl'}`} ref={emblaRef}>
          {/* Container */}
          <div className={`flex select-none items-center`}>
            {brands.map((brand, index) => (
              <div className={`relative flex-shrink-0 flex items-center justify-center ${isMobile ? 'px-2' : 'px-2'}`} key={`${brand.id}-${locale}-${refreshTrigger}-${index}`}>
                <div className={`relative h-full ${isMobile ? 'py-2' : 'py-4'} flex items-center justify-center`}>
                  <BrandCard
                    brand={brand}
                    className="mx-0 my-1 flex-shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons - positioned below the carousel */}
      {shouldShowControls && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-dark-green-7 shadow-lg hover:shadow-xl border border-dark-green-6/20 hover:border-dark-green-6/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-logo-lime/50 focus:ring-offset-2 backdrop-blur-sm ${!prevBtnEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous brand"
            type="button"
          >
            <ArrowLeft weight="bold" size={isMobile ? 18 : 22} className="text-dark-green-7" />
          </button>
          <button
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center rounded-full bg-white/95 hover:bg-white text-dark-green-7 shadow-lg hover:shadow-xl border border-dark-green-6/20 hover:border-dark-green-6/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-logo-lime/50 focus:ring-offset-2 backdrop-blur-sm ${!nextBtnEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next brand"
            type="button"
          >
            <ArrowRight weight="bold" size={isMobile ? 18 : 22} className="text-dark-green-7" />
          </button>
        </div>
      )}
    </div>
  );
});

EmblaBrandCarousel.propTypes = {
  brands: PropTypes.array.isRequired,
  className: PropTypes.string,
  refreshTrigger: PropTypes.number,
  locale: PropTypes.string
};

export default EmblaBrandCarousel;