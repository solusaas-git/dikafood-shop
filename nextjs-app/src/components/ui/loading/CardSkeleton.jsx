import React from 'react';
import { Card } from '../data-display';
import { Skeleton } from './Skeleton';

/**
 * CardSkeleton component for displaying placeholder loading states for cards
 *
 * @param {boolean} showImage - Whether to display an image skeleton
 * @param {number} lines - Number of text lines to display
 * @param {string} className - Additional CSS classes
 */
export default function CardSkeleton({
  showImage = false,
  lines = 3,
  className,
  ...props
}) {
  return (
    <Card className={className} {...props}>
      {showImage && (
        <Skeleton
          variant="rectangular"
          className="w-full h-48 rounded-t-lg rounded-b-none"
        />
      )}

      <Card.Body>
        <Skeleton
          variant="text"
          size="md"
          className="mb-3 w-3/4"
        />

        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            size="sm"
            width={index === lines - 1 ? "60%" : "100%"}
            className="mb-2"
          />
        ))}

        <div className="mt-4 flex justify-between">
          <Skeleton variant="button" size="sm" width="30%" />
          <Skeleton variant="button" size="sm" width="30%" />
        </div>
      </Card.Body>
    </Card>
  );
}