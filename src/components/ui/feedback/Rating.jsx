import React from 'react';
import { Icon } from '@components/ui/icons';

/**
 * Rating component for displaying star ratings
 * @param {number} value - Rating value from 0-5
 * @param {boolean} readOnly - Whether the rating can be changed
 * @param {function} onChange - Callback when rating changes
 * @param {string} size - Size of the rating stars (sm, md, lg)
 */
const Rating = ({
  value = 0,
  readOnly = true,
  onChange = () => {},
  size = 'md',
  maxValue = 5,
}) => {
  // Convert value to number and ensure it's between 0 and maxValue
  const numericValue = Math.min(Math.max(0, Number(value) || 0), maxValue);

  // Size classes for the stars
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Handle click on a star
  const handleStarClick = (newValue) => {
    if (!readOnly) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(maxValue)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = numericValue >= starValue;
        const isHalfFilled = !isFilled && numericValue > index && numericValue < starValue;

        return (
          <span
            key={index}
            onClick={() => handleStarClick(starValue)}
            className={`${readOnly ? '' : 'cursor-pointer'} mx-0.5 first:ml-0 last:mr-0`}
          >
            <Icon
              name={isHalfFilled ? "starhalf" : (isFilled ? "star" : "star")}
              weight={isFilled ? "fill" : (isHalfFilled ? "duotone" : "regular")}
              className={`${sizeClasses[size] || sizeClasses.md} ${
                isFilled || isHalfFilled ? 'text-amber-400' : 'text-gray-300'
              }`}
            />
          </span>
        );
      })}
    </div>
  );
};

export default Rating;