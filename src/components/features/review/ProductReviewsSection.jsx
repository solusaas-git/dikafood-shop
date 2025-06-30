import React, { useState } from 'react';
import { ReviewCard } from '@/components/features/review';
import Carousel from '@components/ui/data-display/Carousel';
import SectionHeader from '@components/ui/layout/SectionHeader';
import SectionDecorations from '@components/ui/decorations/SectionDecorations';

/**
 * ProductReviewsSection component for displaying product reviews in a carousel
 * @param {Object} props - Component props
 * @param {Array} props.reviews - Array of review objects
 * @param {string} props.selectedVariant - Currently selected variant name
 * @param {boolean} props.isMobile - Whether the component is rendered on mobile
 */
const ProductReviewsSection = ({
  reviews = [],
  selectedVariant = '',
  isMobile = false
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="py-10 md:py-16 bg-gradient-to-br from-white via-logo-lime/5 to-light-yellow-1/30 relative overflow-hidden">
      {/* Top and bottom decorative borders */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-logo-lime/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-logo-lime/40 to-transparent" />

      {/* Background pattern - lighter on mobile for better text contrast */}
      <div className={`absolute inset-0 ${isMobile ? 'opacity-[0.01]' : 'opacity-[0.015]'} bg-[radial-gradient(#1A472A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none`}></div>

      {/* Section Decorations with soft lime green filter */}
      <SectionDecorations
        variant="lime"
        positions={['top-right', 'bottom-left']}
        customStyles={{
          topRight: {
            opacity: isMobile ? 0.15 : 0.25,
            filter: 'sepia(60%) hue-rotate(50deg) saturate(0.7) brightness(1.3)'
          },
          bottomLeft: {
            opacity: isMobile ? 0.15 : 0.25,
            filter: 'sepia(60%) hue-rotate(50deg) saturate(0.7) brightness(1.3)'
          }
        }}
      />

      {/* Decorative elements - fewer and lighter on mobile */}
      {!isMobile && (
        <>
          <div className="absolute top-40 left-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-logo-lime/10 to-light-yellow-1/20 blur-2xl opacity-70 animate-pulse [animation-duration:8s]"></div>
          <div className="absolute bottom-32 right-[10%] w-32 h-32 rounded-full bg-gradient-to-tl from-logo-lime/20 to-light-yellow-2/20 blur-3xl opacity-60 animate-pulse [animation-duration:12s] [animation-delay:1s]"></div>
        </>
      )}
      <div className="absolute top-1/2 right-[5%] w-16 h-16 rounded-full bg-gradient-to-tr from-dark-yellow-1/10 to-light-yellow-1/30 blur-xl opacity-80 animate-pulse [animation-duration:6s] [animation-delay:2s]"></div>
      <div className="absolute top-[30%] left-[15%] w-20 h-20 rounded-full bg-gradient-to-br from-dark-yellow-1/10 to-light-yellow-1/30 blur-xl opacity-50 animate-pulse [animation-duration:10s] [animation-delay:0.5s]"></div>

      {/* Section Header */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10 mb-6 md:mb-10">
        <div className="section-header text-center">
          <SectionHeader
            icon="chatcircletext"
            title={`Avis clients (${reviews.length})`}
            subtitle="Ce que nos clients pensent de ce produit"
            variant="light"
            size={isMobile ? "small" : "medium"}
            isMobile={isMobile}
            hasDecorators={true}
            className="mx-auto"
            customIconStyles={{
              containerClassName: `${isMobile ? 'w-10 h-10' : 'w-14 h-14'} mx-auto rounded-full flex items-center justify-center bg-logo-lime/15 border border-logo-lime/30`,
              iconClassName: 'text-dark-green-7'
            }}
          />
        </div>
      </div>

      {/* Reviews Carousel */}
      <div
        className="px-0 relative z-10 -mx-4 md:-mx-8 lg:-mx-12 my-2 md:my-4 pb-8 md:pb-4 overflow-x-visible"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Decorative side indicators - only visible on tablet/desktop */}
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-24 h-48 bg-gradient-to-r from-logo-lime/10 to-transparent pointer-events-none z-20"></div>
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-24 h-48 bg-gradient-to-l from-logo-lime/10 to-transparent pointer-events-none z-20"></div>

        <Carousel
          spacing="compact"
          itemWidth={isMobile ? "85%" : "360px"}
          padding={isMobile ? "default" : "wide"}
          snap={isMobile ? "center" : "start"}
          controlVariant="lime"
          controlsPosition="middle"
          controlsClassName="px-8 md:px-16 lg:px-24"
          controlSize={isMobile ? "small" : "medium"}
          loop={true}
          autoScroll={true}
          autoScrollSpeed={5000}
          isPaused={isPaused}
          showControls={true}
          className="w-full"
          trackClassName={isMobile ? "pl-4 md:pl-6 lg:pl-8 pr-2" : "pl-4 md:pl-6 lg:pl-8 pr-4"}
        >
          {reviews.map((review, index) => (
            <Carousel.Item
              key={`review-${review.id || index}-${index}`}
              width="auto"
              snap="center"
              className={`${isMobile ? 'w-[280px]' : 'w-[320px] md:w-[360px]'} py-0.5 md:py-1`}
            >
              <ReviewCard
                review={{
                  ...review,
                  productVariant: review.productVariant || selectedVariant,
                  // Make the format consistent for existing reviews
                  author: typeof review.author === 'string'
                    ? { name: review.author, location: '' }
                    : review.author
                }}
                isMobile={isMobile}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductReviewsSection;