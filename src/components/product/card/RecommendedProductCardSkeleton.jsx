import React from 'react';
import './RecommendedProductCardSkeleton.scss';

/**
 * RecommendedProductCardSkeleton component for displaying loading state of recommended product cards
 *
 * @param {Object} props
 * @param {string} props.className - Optional additional CSS class
 * @param {number} props.index - Optional index for staggered animations
 * @returns {JSX.Element}
 */
const RecommendedProductCardSkeleton = ({ className = '', index = 0 }) => {
  // Animation delays for staggered effect
  const getAnimationDelay = () => {
    if (index % 4 === 1) return '0.3s';
    if (index % 4 === 2) return '0.6s';
    if (index % 4 === 3) return '0.9s';
    return '0s';
  };

  const animationDelay = getAnimationDelay();

  return (
    <div
      className={`recommended-product-card-skeleton ${className}`}
      style={{ '--animation-delay': animationDelay }}
    >
      <div className="image-skeleton"></div>
      <div className="content-skeleton">
        <div className="title-skeleton"></div>
        <div className="meta-skeleton">
          <div className="price-skeleton"></div>
          <div className="rating-skeleton"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * RecommendedProductCardSkeletonGrid component for displaying a grid of recommended product card skeletons
 *
 * @param {Object} props
 * @param {number} props.count - Number of skeleton cards to display
 * @param {string} props.className - Optional additional CSS class for the grid
 * @returns {JSX.Element}
 */
export const RecommendedProductCardSkeletonGrid = ({ count = 4, className = '' }) => {
  return (
    <div className={`recommended-product-card-skeleton-grid ${className}`}>
      {[...Array(count)].map((_, index) => (
        <RecommendedProductCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
};

export default RecommendedProductCardSkeleton;