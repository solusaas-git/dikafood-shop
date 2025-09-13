import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { tv } from 'tailwind-variants';
import { Icon } from '../icons';

// Carousel container styles
const carouselContainerStyles = tv({
  base: 'relative w-full flex flex-col items-center',
  variants: {
    spacing: {
      none: '',
      tight: 'my-4',
      normal: 'my-6',
      wide: 'my-8',
    }
  },
  defaultVariants: {
    spacing: 'normal'
  }
});

// Carousel track styles
const carouselTrackStyles = tv({
  base: 'flex overflow-x-auto scroll-smooth hide-scrollbar carousel-track',
  variants: {
    snap: {
      none: '',
      center: 'snap-x snap-mandatory',
      start: 'snap-x snap-start snap-mandatory',
      mandatory: 'snap-x snap-mandatory'
    },
    spacing: {
      none: 'gap-0',
      tight: 'gap-2',
      normal: 'gap-4',
      wide: 'gap-6',
      md: 'gap-4'
    },
    padding: {
      none: '',
      default: 'py-4 px-1',
      wide: 'py-6 px-2',
      md: 'px-4'
    }
  },
  defaultVariants: {
    snap: 'center',
    spacing: 'normal',
    padding: 'default'
  }
});

// Carousel controls styles
const carouselControlStyles = tv({
  base: 'flex justify-center items-center w-10 h-10 rounded-full bg-white text-dark-green-7 hover:bg-light-yellow-1 hover:text-dark-green-8 focus:outline-none focus:ring-2 focus:ring-dark-yellow-1 transition-all z-10',
  variants: {
    position: {
      left: '',
      right: '',
    },
    size: {
      small: 'w-8 h-8',
      medium: 'w-10 h-10',
      large: 'w-12 h-12',
    },
    variant: {
      default: 'bg-white text-dark-green-7 hover:bg-gray-100 shadow-md',
      primary: 'bg-dark-green-6 text-white hover:bg-dark-green-7 shadow-md',
      secondary: 'bg-dark-yellow-1 text-dark-green-7 hover:bg-dark-yellow-2 shadow-md',
      accent: 'bg-dark-yellow-1 text-dark-green-7 hover:bg-dark-yellow-2 shadow-md',
      lime: 'bg-logo-lime/15 text-dark-green-7 hover:bg-logo-lime/30 border border-logo-lime/30',
    },
  },
  defaultVariants: {
    position: 'left',
    size: 'medium',
    variant: 'default'
  }
});

// Carousel controls container styles
const controlsContainerStyles = tv({
  base: 'w-full',
  variants: {
    position: {
      default: '',
      middle: 'absolute top-1/2 -translate-y-1/2 inset-x-0 flex justify-between pointer-events-none',
      bottom: 'mt-4 flex justify-center gap-2',
      top: 'mb-4 flex justify-center gap-2',
    }
  },
  defaultVariants: {
    position: 'default'
  }
});

// Carousel item styles
const carouselItemStyles = tv({
  base: 'flex-shrink-0 flex justify-center carousel-item',
  variants: {
    snap: {
      none: '',
      center: 'snap-center',
      start: 'snap-start',
    },
    width: {
      auto: 'w-auto',
      full: 'w-full',
      half: 'w-1/2',
      third: 'w-1/3',
      fourth: 'w-1/4',
      fifth: 'w-1/5',
      custom: '',
    },
  },
  defaultVariants: {
    snap: 'center',
    width: 'auto'
  }
});

/**
 * Carousel component for displaying a horizontal scrollable list of items
 *
 * @param {React.ReactNode} children - The carousel items
 * @param {string} spacing - Spacing between items (none, tight, normal, wide)
 * @param {string} snap - Scroll snap behavior (none, center, start)
 * @param {string} padding - Padding around the carousel track
 * @param {number|string} itemWidth - Width of carousel items in pixels
 * @param {boolean} showControls - Whether to show navigation controls
 * @param {string} controlSize - Size of navigation controls (small, medium, large)
 * @param {string} controlVariant - Variant of navigation controls (solid, transparent, accent)
 * @param {string} controlsPosition - Position of navigation controls (default, middle, bottom, top)
 * @param {boolean} loop - Whether the carousel should loop
 * @param {boolean} autoScroll - Whether the carousel should auto-scroll
 * @param {number} autoScrollSpeed - Speed of auto-scroll in milliseconds
 * @param {boolean} isPaused - Whether the auto-scroll is paused
 * @param {string} className - Additional CSS classes for the container
 * @param {string} trackClassName - Additional CSS classes for the track
 * @param {string} controlsClassName - Additional CSS classes for the controls container
 */
function Carousel({
  children,
  spacing = 'normal',
  snap = 'center',
  padding = 'default',
  itemWidth,
  showControls = true,
  controlSize = 'medium',
  controlVariant = 'default',
  controlsPosition = 'default',
  loop = false,
  autoScroll = false,
  autoScrollSpeed = 3000,
  isPaused = false,
  className = '',
  trackClassName = '',
  controlsClassName = '',
  ...props
}) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const autoScrollTimerRef = useRef(null);

  // Throttled update scroll state function to prevent excessive DOM measurements
  const updateScrollButtons = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Use requestAnimationFrame to batch DOM reads
    requestAnimationFrame(() => {
      // Check if carousel is scrollable (content width > container width)
      const isCarouselScrollable = carousel.scrollWidth > carousel.clientWidth;
      setIsScrollable(isCarouselScrollable);

      // Only update scroll buttons if carousel is scrollable
      if (isCarouselScrollable) {
        const scrollLeft = carousel.scrollLeft;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < maxScroll);
      } else {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
    });
  }, []);

  // Throttled version of updateScrollButtons to prevent excessive calls
  const throttledUpdateScrollButtons = useCallback(() => {
    if (updateScrollButtons._throttleTimer) return;
    
    updateScrollButtons._throttleTimer = setTimeout(() => {
      updateScrollButtons();
      updateScrollButtons._throttleTimer = null;
    }, 16); // ~60fps
  }, [updateScrollButtons]);

  // Auto-scroll function - memoized
  const autoScrollNext = useCallback(() => {
    if (carouselRef.current && autoScroll && !isPaused && isScrollable) {
      scrollToItem('next');
    }
  }, [autoScroll, isPaused, isScrollable]);

  // Scroll to next/previous item - memoized and optimized
  const scrollToItem = useCallback((direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Use requestAnimationFrame to batch DOM operations
    requestAnimationFrame(() => {
      const items = carousel.querySelectorAll('[data-carousel-item]');
      if (items.length === 0) return;

      const firstItem = items[0];
      const itemWidth = firstItem.offsetWidth;
      const gapWidth = parseInt(getComputedStyle(carousel).columnGap || '0');
      const scrollAmount = itemWidth + gapWidth;

      if (direction === 'next') {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        if (loop && currentIndex === itemCount - 1) {
          setTimeout(() => {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
            setCurrentIndex(0);
          }, 300);
        } else {
          setCurrentIndex(Math.min(currentIndex + 1, itemCount - 1));
        }
      } else {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        if (loop && currentIndex === 0) {
          setTimeout(() => {
            carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
            setCurrentIndex(itemCount - 1);
          }, 300);
        } else {
          setCurrentIndex(Math.max(currentIndex - 1, 0));
        }
      }
    });
  }, [currentIndex, itemCount, loop]);

  // Set up auto-scroll
  useEffect(() => {
    if (autoScroll && !isPaused && isScrollable) {
      autoScrollTimerRef.current = setInterval(autoScrollNext, autoScrollSpeed);
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [autoScroll, autoScrollSpeed, isPaused, autoScrollNext, isScrollable]);

  // Update scroll state and item count on mount and when children change
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Update number of items for navigation
    setItemCount(React.Children.count(children));

    // Initial update
    updateScrollButtons();

    // Add throttled scroll event listener
    carousel.addEventListener('scroll', throttledUpdateScrollButtons, { passive: true });
    window.addEventListener('resize', throttledUpdateScrollButtons, { passive: true });

    return () => {
      carousel.removeEventListener('scroll', throttledUpdateScrollButtons);
      window.removeEventListener('resize', throttledUpdateScrollButtons);
      
      // Clear any pending throttle timer
      if (updateScrollButtons._throttleTimer) {
        clearTimeout(updateScrollButtons._throttleTimer);
        updateScrollButtons._throttleTimer = null;
      }
    };
  }, [children, updateScrollButtons, throttledUpdateScrollButtons]);

  // Style for items with custom width
  const itemStyle = itemWidth ? { width: typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth } : {};

  // Memoize handlers for buttons to prevent re-renders
  const handlePrevClick = useCallback(() => scrollToItem('prev'), [scrollToItem]);
  const handleNextClick = useCallback(() => scrollToItem('next'), [scrollToItem]);

  return (
    <div className={carouselContainerStyles({ spacing, className })} {...props}>
      {/* Carousel Track */}
      <div
        ref={carouselRef}
        className={carouselTrackStyles({ spacing, snap, padding, className: trackClassName })}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            data-carousel-item
            className={carouselItemStyles({
              snap,
              className: child.props.className
            })}
            style={itemStyle}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Controls - Only show if carousel is scrollable */}
      {showControls && isScrollable && (
        <div className={controlsContainerStyles({ position: controlsPosition, className: controlsClassName })}>
          <button
            type="button"
            onClick={handlePrevClick}
            disabled={!canScrollLeft && !loop}
            className={carouselControlStyles({
              position: 'left',
              size: controlSize,
              variant: controlVariant,
            }) + ' pointer-events-auto'}
            aria-label="Previous"
            tabIndex={0}
          >
            <Icon name="caretLeft" weight="bold" size="sm" />
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            disabled={!canScrollRight && !loop}
            className={carouselControlStyles({
              position: 'right',
              size: controlSize,
              variant: controlVariant,
            }) + ' pointer-events-auto'}
            aria-label="Next"
            tabIndex={0}
          >
            <Icon name="caretRight" weight="bold" size="sm" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Carousel.Item component for carousel items with consistent styling
 */
const CarouselItem = memo(function CarouselItem({ children, className, ...props }) {
  return (
    <div className={`flex justify-center items-center ${className || ''}`} {...props}>
      {children}
    </div>
  );
});

// Attach Item component to Carousel
const MemoizedCarousel = memo(Carousel);
MemoizedCarousel.Item = CarouselItem;

export default MemoizedCarousel;