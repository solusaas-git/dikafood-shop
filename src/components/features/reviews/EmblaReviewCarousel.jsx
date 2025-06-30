import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import PropTypes from 'prop-types';
import useBreakpoint from '@/hooks/useBreakpoint';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

/**
 * EmblaReviewCarousel component for the reviews section
 * Displays review cards in a carousel using Embla Carousel
 */
const EmblaReviewCarousel = React.forwardRef(function EmblaReviewCarousel(props, ref) {
  const { isMobile, isTablet } = useBreakpoint();
  const [isVisible, setIsVisible] = useState(true);
  const carouselRef = useRef(null);
  const [shouldShowControls, setShouldShowControls] = useState(true);
  const [allCardsVisible, setAllCardsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollIntervalRef = useRef(null);

  const {
    reviews,
    className,
    renderReviewCard,
    locale,
    autoScroll = true,
    autoScrollInterval = 5000
  } = props || {};

  // Embla carousel options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: isMobile ? 'center' : 'start',
    containScroll: 'trimSnaps',
    dragFree: !isMobile,
    loop: true,
    slidesToScroll: 1
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(true);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Setup auto-scrolling
  useEffect(() => {
    if (!emblaApi || !autoScroll || isPaused) return;

    const scrollNext = () => {
      if (emblaApi) emblaApi.scrollNext();
    };

    // Set up the interval for auto-scrolling
    autoScrollIntervalRef.current = setInterval(scrollNext, autoScrollInterval);

    // Clean up the interval when component unmounts or dependencies change
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [emblaApi, autoScroll, isPaused, autoScrollInterval]);

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
  }, [emblaApi, checkIfAllSlidesVisible, throttledCheckIfAllSlidesVisible]);

  // Empty state
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full relative flex justify-center items-center ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full mx-auto px-2 md:px-6" ref={carouselRef}>
        {/* Viewport */}
        <div className={`overflow-hidden w-full ${allCardsVisible ? 'flex justify-center' : ''}`} ref={emblaRef}>
          {/* Container */}
          <div className={`flex select-none ${allCardsVisible ? 'justify-center' : '-ml-2 md:-ml-4'}`}>
            {reviews.map((review, index) => (
              <div
                className={`relative min-w-0 ${isMobile ? 'pl-2 w-[calc(90%-8px)]' : 'pl-4 w-[360px]'} md:w-[360px] flex-shrink-0`}
                key={review.key || `review-${review.id || index}-${index}-${locale || ''}`}
              >
                <div className="relative overflow-hidden px-1 h-full pt-2 pb-3">
                  {renderReviewCard(review)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons - only shown when needed */}
        {shouldShowControls && (
          <>
            <button
              className="absolute z-10 top-1/2 -translate-y-1/2 left-0 md:left-2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-light-yellow-1 hover:bg-light-yellow-2 text-dark-green-7 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-light-yellow-2 focus:ring-offset-2 hover:border-2 hover:border-logo-lime/60 active:border-2 active:border-logo-lime active:shadow-[0_0_0_4px_rgba(203,245,0,0.3)]"
              onClick={scrollPrev}
              aria-label="Previous review"
              type="button"
            >
              <ArrowLeft weight="bold" size={24} className="text-dark-green-7" />
            </button>
            <button
              className="absolute z-10 top-1/2 -translate-y-1/2 right-0 md:right-2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-light-yellow-1 hover:bg-light-yellow-2 text-dark-green-7 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-light-yellow-2 focus:ring-offset-2 hover:border-2 hover:border-logo-lime/60 active:border-2 active:border-logo-lime active:shadow-[0_0_0_4px_rgba(203,245,0,0.3)]"
              onClick={scrollNext}
              aria-label="Next review"
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

EmblaReviewCarousel.propTypes = {
  reviews: PropTypes.array.isRequired,
  renderReviewCard: PropTypes.func.isRequired,
  className: PropTypes.string,
  locale: PropTypes.string,
  autoScroll: PropTypes.bool,
  autoScrollInterval: PropTypes.number
};

export default EmblaReviewCarousel;