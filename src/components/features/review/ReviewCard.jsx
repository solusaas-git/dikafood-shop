import React, { useState, useEffect, useRef } from 'react';
import Card from '@components/ui/data-display/Card';
import { Icon } from '@components/ui';
import RatingStars from '@components/ui/data-display/RatingStars';
import { formatRelativeTime } from '@/utils/date/dateUtils';

/**
 * ReviewCard component for displaying a customer review
 * @param {Object} props - Component props
 * @param {Object} props.review - Review data object
 * @param {boolean} props.isMobile - Whether the component is rendered on mobile
 */
const ReviewCard = ({ review, isMobile = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);

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

  // Get author data in a consistent format
  const authorName = typeof review.author === 'string' ? review.author : (review.author?.name || 'Anonymous');
  const authorLocation = typeof review.author === 'object' ? (review.author.location || '') : (review.location || '');
  const isVerified = review.verified || false;
  const productVariant = review.product?.variant || review.productVariant || '';

  return (
    <Card
      variant="brandLime"
      padding="none"
      className={`w-full max-w-full ${isMobile ? 'h-[280px]' : 'h-[300px]'} transition-all duration-300 hover:shadow-lg hover:shadow-logo-lime/10 hover:-translate-y-1 cursor-default mx-auto`}
    >
      <Card.Header
        hasDivider={true}
        padding={isMobile ? "small" : "medium"}
        className="bg-gradient-to-br from-logo-lime/10 to-light-yellow-1/30 border-b border-logo-lime/20"
      >
        <div className="w-full space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-dark-green-7 m-0`}>{authorName}</h3>
              {authorLocation && <p className="text-xs text-dark-green-6 m-0">{authorLocation}</p>}
            </div>
            <RatingStars rating={review.rating} />
          </div>

          <div className="flex items-center justify-between">
            {isVerified ? (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full border border-dark-yellow-1 text-dark-green-7 text-xs font-medium">
                <Icon name="checkCircle" size="xs" className="text-dark-green-7" />
                <span className={isMobile ? 'text-[10px]' : 'text-xs'}>Achat vérifié</span>
              </div>
            ) : (
              productVariant && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/70 rounded-full border border-logo-lime/30 text-dark-green-7 text-xs font-medium">
                  <Icon name="shoppingbag" size="xs" className="text-logo-lime" />
                  <span className={isMobile ? 'text-[10px]' : 'text-xs'}>{productVariant}</span>
                </div>
              )
            )}
            <span className="text-xs text-dark-green-6">{formatRelativeTime(review.date)}</span>
          </div>
        </div>
      </Card.Header>

      <Card.Body padding={isMobile ? "small" : "medium"} className="flex flex-col flex-1 pt-3 pb-2 px-4">
        <div className="flex-1 flex flex-col relative px-1 pb-7">
          <Icon
            name="quotes"
            weight="fill"
            className="absolute top-0 left-0 text-logo-lime/40 border border-logo-lime/20 rounded-full p-1 -translate-x-2 -translate-y-1 shadow-sm bg-white/80"
            sizeInPixels={isMobile ? 16 : 20}
          />

          <div
            ref={textRef}
            className={`${isMobile ? 'text-sm' : 'text-base'} text-dark-green-7 leading-relaxed pt-1 px-2 ${!isExpanded ? 'line-clamp-5' : ''} relative z-10`}
          >
            {review.comment}
          </div>

          <Icon
            name="quotes"
            weight="fill"
            className="absolute bottom-1 right-0 text-logo-lime/40 border border-logo-lime/20 rounded-full p-1 translate-x-2 translate-y-1 rotate-180 z-0 shadow-sm bg-white/80"
            sizeInPixels={isMobile ? 16 : 20}
          />

          {needsTruncation && (
            <button
              className="mt-1 z-10 flex items-center gap-1 text-xs font-medium text-logo-lime hover:text-dark-green-7 transition-colors self-start absolute bottom-0 left-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon
                name="caretDown"
                size="xs"
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;