import React from 'react';
import { Icon } from '@components/ui';

/**
 * Renders star icons based on a rating value
 * @param {number} rating - Rating value (0-5)
 * @returns {Array} Array of star icon elements
 */
export const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Icon key={i} name="star" className="text-dark-yellow-1" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<Icon key={i} name="starHalf" className="text-dark-yellow-1" />);
    } else {
      stars.push(<Icon key={i} name="star" className="text-neutral-300" />);
    }
  }
  return stars;
};

/**
 * Generates rating bar data for displaying distribution of ratings
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {Array} Array of JSX elements representing rating bars
 */
export const renderRatingBars = (reviews = []) => {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    counts[Math.floor(review.rating) - 1]++;
  });

  const total = reviews.length;
  return [5, 4, 3, 2, 1].map(stars => {
    const count = counts[stars - 1];
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div key={stars} className="flex items-center">
        <div className="flex items-center w-12">
          <span className="text-sm font-medium">{stars}</span>
          <Icon name="star" className="text-dark-yellow-1 ml-1" size="sm" />
        </div>
        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden mx-2">
          <div
            className="h-full bg-dark-yellow-1 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="w-8 text-right text-sm text-neutral-500">{count}</div>
      </div>
    );
  });
};

/**
 * Generates mock rating bars when no real review data is available
 * @param {number} rating - Overall product rating (0-5)
 * @param {number} reviewCount - Number of reviews
 * @returns {Array} Array of JSX elements representing rating bars
 */
export const renderMockRatingBars = (rating = 0, reviewCount = 0) => {
  // Create a realistic distribution based on the overall rating
  const mockDistribution = getMockDistribution(rating, reviewCount);

  return [5, 4, 3, 2, 1].map(stars => {
    const count = mockDistribution[stars - 1];
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

    return (
      <div key={stars} className="flex items-center">
        <div className="flex items-center w-12">
          <span className="text-sm font-medium">{stars}</span>
          <Icon name="star" className="text-dark-yellow-1 ml-1" size="sm" />
        </div>
        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden mx-2">
          <div
            className="h-full bg-dark-yellow-1 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="w-8 text-right text-sm text-neutral-500">{count}</div>
      </div>
    );
  });
};

/**
 * Generates a realistic distribution of ratings based on overall rating
 * @param {number} rating - Overall product rating (0-5)
 * @param {number} reviewCount - Number of reviews
 * @returns {Array} Array of counts for each star rating [5,4,3,2,1]
 */
const getMockDistribution = (rating = 0, reviewCount = 0) => {
  if (reviewCount === 0) return [0, 0, 0, 0, 0];

  // Initialize distribution array [5★, 4★, 3★, 2★, 1★]
  const distribution = [0, 0, 0, 0, 0];

  // Calculate a realistic distribution based on the overall rating
  if (rating >= 4.5) {
    // Excellent product
    distribution[0] = Math.round(reviewCount * 0.7); // 70% 5-star
    distribution[1] = Math.round(reviewCount * 0.2); // 20% 4-star
    distribution[2] = Math.round(reviewCount * 0.05); // 5% 3-star
    distribution[3] = Math.round(reviewCount * 0.03); // 3% 2-star
    distribution[4] = Math.round(reviewCount * 0.02); // 2% 1-star
  } else if (rating >= 4) {
    // Very good product
    distribution[0] = Math.round(reviewCount * 0.5); // 50% 5-star
    distribution[1] = Math.round(reviewCount * 0.3); // 30% 4-star
    distribution[2] = Math.round(reviewCount * 0.1); // 10% 3-star
    distribution[3] = Math.round(reviewCount * 0.05); // 5% 2-star
    distribution[4] = Math.round(reviewCount * 0.05); // 5% 1-star
  } else if (rating >= 3) {
    // Average product
    distribution[0] = Math.round(reviewCount * 0.25); // 25% 5-star
    distribution[1] = Math.round(reviewCount * 0.3); // 30% 4-star
    distribution[2] = Math.round(reviewCount * 0.25); // 25% 3-star
    distribution[3] = Math.round(reviewCount * 0.1); // 10% 2-star
    distribution[4] = Math.round(reviewCount * 0.1); // 10% 1-star
  } else if (rating >= 2) {
    // Below average product
    distribution[0] = Math.round(reviewCount * 0.1); // 10% 5-star
    distribution[1] = Math.round(reviewCount * 0.2); // 20% 4-star
    distribution[2] = Math.round(reviewCount * 0.3); // 30% 3-star
    distribution[3] = Math.round(reviewCount * 0.25); // 25% 2-star
    distribution[4] = Math.round(reviewCount * 0.15); // 15% 1-star
  } else {
    // Poor product
    distribution[0] = Math.round(reviewCount * 0.05); // 5% 5-star
    distribution[1] = Math.round(reviewCount * 0.1); // 10% 4-star
    distribution[2] = Math.round(reviewCount * 0.15); // 15% 3-star
    distribution[3] = Math.round(reviewCount * 0.3); // 30% 2-star
    distribution[4] = Math.round(reviewCount * 0.4); // 40% 1-star
  }

  // Adjust for rounding errors to ensure total equals reviewCount
  const total = distribution.reduce((sum, count) => sum + count, 0);
  const diff = reviewCount - total;
  if (diff !== 0) {
    // Add or subtract the difference from the most common rating
    const maxIndex = distribution.indexOf(Math.max(...distribution));
    distribution[maxIndex] += diff;
  }

  return distribution;
};