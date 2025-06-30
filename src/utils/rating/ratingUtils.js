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