import React, { useState } from 'react';
import { Star } from "@phosphor-icons/react";
import './ProductReviews.scss';

const ProductReviews = ({ product }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!product || !product.reviews) {
    return (
      <div className="product-reviews">
        <div className="empty-reviews">
          <p>No reviews yet for this product.</p>
          <button className="write-review-button">Write a Review</button>
        </div>
      </div>
    );
  }

  const { reviews, rating } = product;
  const totalReviews = reviews.length;
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // Create rating breakdown
  const ratingCounts = Array(5).fill(0);
  reviews.forEach(review => {
    const ratingIndex = Math.floor(review.rating) - 1;
    if (ratingIndex >= 0 && ratingIndex < 5) {
      ratingCounts[ratingIndex]++;
    }
  });

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => {
          if (index < Math.floor(rating)) {
            // Full star
            return <Star key={index} weight="duotone" className="star-filled duotone" />;
          } else if (index < Math.ceil(rating) && !Number.isInteger(rating)) {
            // Half star
            return <Star key={index} weight="duotone" className="star-half duotone" />;
          } else {
            // Empty star
            return <Star key={index} weight="duotone" className="star-empty duotone" />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="product-reviews">
      <div className="reviews-summary">
        <h3>Customer Reviews</h3>

        <div className="rating-summary">
          <div className="rating-overall">
            <div className="rating-value">{rating.toFixed(1)}</div>
            {renderStars(rating)}
            <p>Based on {totalReviews} reviews</p>
          </div>

          <div className="rating-breakdown">
            {ratingCounts.map((count, index) => {
              const starNumber = 5 - index;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div className="rating-bar" key={starNumber}>
                  <div className="star-label">{starNumber} stars</div>
                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="count">{count}</div>
                </div>
              );
            }).reverse()}
          </div>
        </div>
      </div>

      <div className="reviews-list">
        <h4>Reviews ({totalReviews})</h4>

        {displayedReviews.map((review, index) => (
          <div className="review-item" key={index}>
            <div className="review-header">
              <div className="reviewer-info">
                <span className="reviewer-name">{review.name}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>

            {review.title && (
              <h5 className="review-title">{review.title}</h5>
            )}

            <p className="review-text">{review.text}</p>
          </div>
        ))}

        {reviews.length > 3 && (
          <div className="load-more">
            <button
              className="load-more-button"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? 'Show Less' : `Load More Reviews (${reviews.length - 3})`}
            </button>
          </div>
        )}
      </div>

      <div className="review-actions">
        <button className="write-review-button">Write a Review</button>
      </div>
    </div>
  );
};

export default ProductReviews;