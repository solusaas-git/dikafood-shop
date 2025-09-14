import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import PropTypes from 'prop-types';
import useBreakpoint from '@/hooks/useBreakpoint';

/**
 * EmblaReviewCarousel component for the reviews section
 * Displays review cards in a carousel using Embla Carousel with continuous autoplay
 */
const EmblaReviewCarousel = React.forwardRef(function EmblaReviewCarousel(props, ref) {
  const { isMobile, isTablet } = useBreakpoint();
  const [isVisible, setIsVisible] = useState(true);
  const carouselRef = useRef(null);

  const {
    reviews,
    className,
    renderReviewCard,
    locale,
    autoScroll = true,
    scrollSpeed = 2 // pixels per frame for continuous scrolling
  } = props || {};

  // Configure auto-scroll plugin for continuous smooth scrolling
  const autoScrollPlugin = useRef(
    AutoScroll({
      speed: scrollSpeed, // Pixels per frame
      startDelay: 1000, // 1 second delay before starting
      direction: 'forward',
      stopOnInteraction: false, // Don't stop on drag - we'll handle manually
      stopOnMouseEnter: false, // Don't stop on hover - we'll handle manually
      stopOnFocusIn: true
    })
  );

  // Embla carousel options for continuous smooth scrolling
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true, // Enable drag scrolling
    loop: true,
    slidesToScroll: 1,
    duration: 0 // Instant transitions for smooth continuous effect
  }, [autoScrollPlugin.current]);

  // Control auto-scroll when autoScroll setting changes
  useEffect(() => {
    const autoScrollInstance = autoScrollPlugin.current;
    if (!autoScrollInstance || !emblaApi) return;

    if (autoScroll) {
      autoScrollInstance.play();
    } else {
      autoScrollInstance.stop();
    }
  }, [autoScroll, emblaApi]);

  // Manual hover control handlers
  const handleMouseEnter = useCallback(() => {
    const autoScrollInstance = autoScrollPlugin.current;
    if (autoScrollInstance) {
      autoScrollInstance.stop();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const autoScrollInstance = autoScrollPlugin.current;
    if (autoScrollInstance && autoScroll) {
      autoScrollInstance.play();
    }
  }, [autoScroll]);


  // Empty state
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full relative flex justify-center items-center ${className || ''}`}
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full mx-auto px-2 md:px-6" ref={carouselRef}>
        {/* Viewport */}
        <div className="overflow-hidden w-full" ref={emblaRef}>
          {/* Container */}
          <div className="flex select-none -ml-2 md:-ml-4">
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
  scrollSpeed: PropTypes.number
};

export default EmblaReviewCarousel;