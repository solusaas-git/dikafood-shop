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
    align: isMobile ? 'center' : 'start',
    containScroll: 'trimSnaps',
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

  // Initial setup and event listeners
  useEffect(() => {
    if (!emblaApi) return;

    // Add event listeners for resize and slide changes with throttling
    window.addEventListener('resize', throttledCheckIfAllSlidesVisible, { passive: true });
    emblaApi.on('reInit', throttledCheckIfAllSlidesVisible);
    emblaApi.on('resize', throttledCheckIfAllSlidesVisible);

    // Initial check
    checkIfAllSlidesVisible();

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
      
      // Clear any pending throttle timer
      if (checkIfAllSlidesVisible._throttleTimer) {
        clearTimeout(checkIfAllSlidesVisible._throttleTimer);
        checkIfAllSlidesVisible._throttleTimer = null;
      }
    };
  }, [emblaApi, checkIfAllSlidesVisible, throttledCheckIfAllSlidesVisible, isMobile, brands.length]);

  // Empty state
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full relative flex justify-center items-center ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="relative w-full mx-auto px-8 md:px-12 flex justify-center" ref={carouselRef}>
        {/* Viewport */}
        <div className={`overflow-visible w-full max-w-screen-xl flex justify-center`} ref={emblaRef}>
          {/* Container */}
          <div className={`flex select-none justify-center items-center`}>
            {brands.map((brand, index) => (
              <div className="relative flex-shrink-0 flex items-center justify-center px-2" key={`${brand.id}-${locale}-${refreshTrigger}-${index}`}>
                <div className="relative h-full py-4 flex items-center justify-center">
                  <BrandCard
                    brand={brand}
                    className="mx-0 my-1 flex-shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons - positioned outside the carousel content */}
        {shouldShowControls && (
          <>
            <button
              className="absolute z-10 top-1/2 -translate-y-1/2 -left-8 md:-left-12 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-light-yellow-1 hover:bg-light-yellow-2 text-dark-green-7 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-light-yellow-2 focus:ring-offset-2 hover:border-2 hover:border-logo-lime/60 active:border-2 active:border-logo-lime active:shadow-[0_0_0_4px_rgba(203,245,0,0.3)]"
              onClick={scrollPrev}
              aria-label="Previous brand"
              type="button"
            >
              <ArrowLeft weight="bold" size={24} className="text-dark-green-7" />
            </button>
            <button
              className="absolute z-10 top-1/2 -translate-y-1/2 -right-8 md:-right-12 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-light-yellow-1 hover:bg-light-yellow-2 text-dark-green-7 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-light-yellow-2 focus:ring-offset-2 hover:border-2 hover:border-logo-lime/60 active:border-2 active:border-logo-lime active:shadow-[0_0_0_4px_rgba(203,245,0,0.3)]"
              onClick={scrollNext}
              aria-label="Next brand"
              type="button"
            >
              <ArrowRight weight="bold" size={24} className="text-dark-green-7" />
            </button>
          </>
        )}
      </div>
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