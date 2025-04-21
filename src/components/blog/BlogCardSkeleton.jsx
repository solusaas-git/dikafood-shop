import React from 'react';
import './BlogCardSkeleton.scss';

/**
 * BlogCardSkeleton component for displaying loading state of blog cards
 *
 * @param {Object} props
 * @param {string} props.className - Optional additional CSS class
 * @param {number} props.index - Optional index for staggered animations
 * @returns {JSX.Element}
 */
const BlogCardSkeleton = ({ className = '', index = 0 }) => {
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
      className={`blog-card-skeleton ${className}`}
      style={{ '--animation-delay': animationDelay }}
    >
      <div className="image-skeleton"></div>
      <div className="content-skeleton">
        <div className="category-skeleton"></div>
        <div className="title-skeleton"></div>
        <div className="excerpt-skeleton"></div>
        <div className="excerpt-skeleton short"></div>
        <div className="meta-skeleton"></div>
      </div>
    </div>
  );
};

/**
 * BlogCardSkeletonGrid component for displaying a grid of blog card skeletons
 *
 * @param {Object} props
 * @param {number} props.count - Number of skeleton cards to display
 * @param {string} props.className - Optional additional CSS class for the grid
 * @returns {JSX.Element}
 */
export const BlogCardSkeletonGrid = ({ count = 6, className = '' }) => {
  return (
    <div className={`blog-card-skeleton-grid ${className}`}>
      {[...Array(count)].map((_, index) => (
        <BlogCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
};

export default BlogCardSkeleton;