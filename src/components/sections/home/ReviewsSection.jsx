import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../../utils/i18n';
import SectionHeader from '../../ui/layout/SectionHeader';
import Card from '../../ui/data-display/Card';
import { Icon } from '../../ui/icons';
import reviewsData from '../../../data/reviews.json';
import translations from './translations/ReviewsSection';
import SectionDecorations from '../../ui/decorations/SectionDecorations';
import { EmblaReviewCarousel } from '@/components/features/reviews';
import useBreakpoint from '@/hooks/useBreakpoint';

// Format relative time function
const formatRelativeTime = (dateString, t) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now - date;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths > 0) {
    return t('months_ago', { count: diffInMonths });
  } else if (diffInDays > 0) {
    return t('days_ago', { count: diffInDays });
  } else if (diffInHours > 0) {
    return t('hours_ago', { count: diffInHours });
  } else if (diffInMinutes > 0) {
    return t('minutes_ago', { count: diffInMinutes });
  } else {
    return t('just_now');
  }
};

// Component for rendering stars based on rating
const RatingStars = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Icon
          key={index}
          name="star"
          size="sm"
          weight="duotone"
          className={index < Math.floor(rating)
            ? "text-dark-yellow-1"
            : (index < Math.ceil(rating) && !Number.isInteger(rating))
              ? "text-dark-yellow-1 opacity-75"
              : "text-dark-yellow-1 opacity-30"
          }
        />
      ))}
    </div>
  );
};

// Review Card component
const ReviewCard = ({ review }) => {
  const { t } = useTranslation(translations);
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = React.useRef(null);

  // Check if text needs truncation (optimized)
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Use requestAnimationFrame to batch DOM reads
        requestAnimationFrame(() => {
          if (textRef.current) {
            setNeedsTruncation(textRef.current.scrollHeight > textRef.current.clientHeight);
          }
        });
      }
    };

    // Throttled version to prevent excessive calls
    const throttledCheckTruncation = () => {
      if (checkTruncation._throttleTimer) return;
      
      checkTruncation._throttleTimer = setTimeout(() => {
        checkTruncation();
        checkTruncation._throttleTimer = null;
      }, 100);
    };

    // Initial check
    checkTruncation();

    // Check again after a short delay to ensure content has rendered properly
    const timer = setTimeout(checkTruncation, 100);

    // Check on window resize with throttling
    window.addEventListener('resize', throttledCheckTruncation, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', throttledCheckTruncation);
      
      // Clear any pending throttle timer
      if (checkTruncation._throttleTimer) {
        clearTimeout(checkTruncation._throttleTimer);
        checkTruncation._throttleTimer = null;
      }
    };
  }, [review.comment]);

  return (
    <Card
      variant="brandLime"
      padding="none"
      className="w-full max-w-[320px] md:max-w-[360px] h-auto min-h-[260px] md:min-h-[280px] transition-all duration-300 hover:shadow-lg hover:shadow-logo-lime/10 hover:-translate-y-2 cursor-default"
    >
      <Card.Header
        hasDivider={true}
        padding="medium"
        className="bg-gradient-to-br from-logo-lime/10 to-light-yellow-1/30 border-b border-logo-lime/20"
      >
        <div className="w-full space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base md:text-lg font-medium text-dark-green-7 m-0">{review.author.name}</h3>
              <p className="text-xs md:text-sm text-dark-green-6 m-0">{review.author.location}</p>
            </div>
            <RatingStars rating={review.rating} />
          </div>

          <div className="flex items-center justify-between">
            {review.verified ? (
              <div className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-0.5 bg-white rounded-full border border-dark-yellow-1 text-dark-green-7 text-[10px] md:text-xs font-medium">
                <Icon name="checkCircle" size="xs" className="text-dark-green-7" />
                <span className="hidden sm:inline">{t('verifiedPurchase')}</span>
                <span className="sm:hidden">{t('verified')}</span>
              </div>
            ) : (
              <div></div>
            )}
            <span className="text-[10px] md:text-xs text-dark-green-6">{formatRelativeTime(review.date, t)}</span>
          </div>
        </div>
      </Card.Header>

      <Card.Body padding="medium" className="flex flex-col pt-2 md:pt-3 pb-2 px-3 md:px-4">
        <div className="flex flex-col relative px-1 pb-6 md:pb-7">
          <Icon
            name="quotes"
            weight="fill"
            className="absolute top-0 left-0 text-logo-lime/40 border border-logo-lime/20 rounded-full p-0.5 md:p-1 -translate-x-1.5 md:-translate-x-2 -translate-y-1 shadow-sm bg-white/80"
            sizeInPixels={16}
          />

          <div
            ref={textRef}
            className={`text-sm md:text-base text-dark-green-7 leading-relaxed pt-1 px-1.5 md:px-2 ${!isExpanded ? 'line-clamp-4' : ''} relative z-10`}
          >
            {review.comment}
          </div>

          <Icon
            name="quotes"
            weight="fill"
            className="absolute bottom-1 right-0 text-logo-lime/40 border border-logo-lime/20 rounded-full p-0.5 md:p-1 translate-x-1.5 md:translate-x-2 translate-y-1 rotate-180 z-0 shadow-sm bg-white/80"
            sizeInPixels={16}
          />

          {needsTruncation && (
            <button
              className="mt-1 z-10 flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-medium text-logo-lime hover:text-dark-green-7 transition-colors self-start absolute bottom-0 left-1.5 md:left-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon
                name="caretDown"
                size="xs"
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
              {isExpanded ? t('showLess') : t('showMore')}
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

/**
 * ReviewsSection component
 */
export default function ReviewsSection() {
  const { t, locale } = useTranslation(translations);
  const carouselRef = useRef(null);

  // Duplicate reviews for smoother infinite scrolling with unique keys
  const reviews = [
    ...reviewsData.map(review => ({ ...review, key: `original-${review.id}` })),
    ...reviewsData.map(review => ({ ...review, key: `duplicate-${review.id}` }))
  ];

  // Function to render a review card (to be passed to the carousel)
  const renderReviewCard = (review) => {
    return <ReviewCard review={review} />;
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-white via-logo-lime/5 to-light-yellow-1/30 relative overflow-hidden">
      {/* Top and bottom decorative borders */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-logo-lime/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-logo-lime/40 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#1A472A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      {/* Section Decorations with soft lime green filter */}
      <SectionDecorations
        variant="lime"
        positions={['top-right', 'bottom-left']}
        customStyles={{
          topRight: {
            opacity: 0.25,
            filter: 'sepia(60%) hue-rotate(50deg) saturate(0.7) brightness(1.3)'
          },
          bottomLeft: {
            opacity: 0.25,
            filter: 'sepia(60%) hue-rotate(50deg) saturate(0.7) brightness(1.3)'
          }
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-40 left-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-logo-lime/10 to-light-yellow-1/20 blur-2xl opacity-70 animate-pulse [animation-duration:8s]"></div>
      <div className="absolute bottom-32 right-[10%] w-32 h-32 rounded-full bg-gradient-to-tl from-logo-lime/20 to-light-yellow-2/20 blur-3xl opacity-60 animate-pulse [animation-duration:12s] [animation-delay:1s]"></div>
      <div className="absolute top-1/2 right-[5%] w-16 h-16 rounded-full bg-gradient-to-tr from-dark-yellow-1/10 to-light-yellow-1/30 blur-xl opacity-80 animate-pulse [animation-duration:6s] [animation-delay:2s]"></div>
      <div className="absolute top-[30%] left-[15%] w-20 h-20 rounded-full bg-gradient-to-br from-dark-yellow-1/10 to-light-yellow-1/30 blur-xl opacity-50 animate-pulse [animation-duration:10s] [animation-delay:0.5s]"></div>

      <div className="container mx-auto px-4 sm:px-6 mb-6 md:mb-8 relative z-10">
        <SectionHeader
          icon="chatCircleText"
          title={t('title')}
          subtitle={t('subtitle')}
          variant="light"
          size="small"
          hasDecorators={true}
          customIconStyles={{
            containerClassName: 'w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-logo-lime/15 border border-logo-lime/30',
            iconClassName: 'text-dark-green-7'
          }}
        />
      </div>

      <div className="relative z-10 mt-2 md:mt-4 mx-auto max-w-[95%] md:max-w-[95%]">
        <EmblaReviewCarousel
          reviews={reviews}
          renderReviewCard={renderReviewCard}
          className="mt-2 md:mt-4"
          locale={locale}
          ref={carouselRef}
          autoScroll={true}
          autoScrollInterval={6000}
        />
      </div>
    </section>
  );
}