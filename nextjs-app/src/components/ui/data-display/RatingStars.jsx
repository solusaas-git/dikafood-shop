import React from 'react';
import { Icon } from '@components/ui';

/**
 * RatingStars component for displaying star ratings
 * @param {Object} props - Component props
 * @param {number} props.rating - Rating value (0-5)
 * @param {string} props.size - Size of stars (xs, sm, md, lg)
 * @param {string} props.className - Additional class names
 * @param {string} props.activeColor - Color class for active stars
 * @param {string} props.inactiveColor - Color class for inactive stars
 */
const RatingStars = ({
  rating,
  size = "sm",
  className = "",
  activeColor = "text-dark-yellow-1",
  inactiveColor = "text-dark-yellow-1 opacity-30"
}) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(5)].map((_, index) => (
        <Icon
          key={index}
          name="star"
          size={size}
          weight="duotone"
          className={index < Math.floor(rating)
            ? activeColor
            : (index < Math.ceil(rating) && !Number.isInteger(rating))
              ? "text-dark-yellow-1 opacity-75"
              : inactiveColor
          }
        />
      ))}
    </div>
  );
};

export default RatingStars;