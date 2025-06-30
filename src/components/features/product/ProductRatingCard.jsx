import React from 'react';
import { ContentContainer } from '@components/ui/layout';
import { renderStars, renderRatingBars, renderMockRatingBars } from '@/utils/rating/ratingUtils.jsx';

/**
 * ProductRatingCard component for displaying product rating statistics
 * @param {Object} props - Component props
 * @param {number} props.rating - Product rating (0-5)
 * @param {number} props.reviewCount - Number of reviews
 * @param {Array} props.reviews - Array of review objects
 * @param {boolean} props.useMockData - Whether to use mock data when no reviews are available
 * @param {string} props.className - Additional class names
 */
const ProductRatingCard = ({
  rating = 0,
  reviewCount = 0,
  reviews = [],
  useMockData = true,
  className = ""
}) => {
  // Default to 0 if rating is not a number
  const safeRating = typeof rating === 'number' ? rating : 0;
  // Default to 0 if reviewCount is not a number
  const safeReviewCount = typeof reviewCount === 'number' ? reviewCount : 0;

  // Determine if we should use mock data
  const shouldUseMockData = useMockData && (!reviews || reviews.length === 0) && safeRating > 0 && safeReviewCount > 0;

  return (
    <ContentContainer
      title="Notation produit"
      variant="default"
      headerVariant="default"
      className={className}
    >
      <div className="flex items-center mb-6">
        <div className="text-3xl font-bold mr-4">{safeRating.toFixed(1)}</div>
        <div>
          <div className="flex text-dark-yellow-1 mb-1">
            {renderStars(safeRating)}
          </div>
          <div className="text-sm text-neutral-500">{safeReviewCount} avis</div>
        </div>
      </div>

      <div className="space-y-2">
        {shouldUseMockData
          ? renderMockRatingBars(safeRating, safeReviewCount)
          : renderRatingBars(reviews)}
      </div>
    </ContentContainer>
  );
};

export default ProductRatingCard;