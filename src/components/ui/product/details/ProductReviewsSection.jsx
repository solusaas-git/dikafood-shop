import React, { useState } from 'react';
import { Icon } from '@components/ui/icons';
import { Button } from '@components/ui/inputs';
import { Rating } from '@components/ui/feedback';
import { EmblaReviewCarousel } from '@/components/features/reviews';
import SectionDecorations from '@components/ui/decorations/SectionDecorations';

// Component for rendering stars based on rating
const RatingStars = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Icon
          key={index}
          name="star"
          size="sm"
          weight="duotone"
          className={index < Math.floor(rating)
            ? "text-dark-yellow-1"
            : (index < Math.ceil(rating) && !Number.isInteger(rating))
              ? "text-dark-yellow-1 opacity-75"
              : "text-dark-yellow-1 opacity-30"
          }
        />
      ))}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  // Ensure author is a string
  const authorName = typeof review.author === 'string' 
    ? review.author 
    : review.author?.name || 'Utilisateur anonyme';

  return (
    <div className="bg-white rounded-xl border border-logo-lime/20 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center">
            <Icon name="user" size="md" className="text-dark-green-7" />
          </div>
          <div>
            <h4 className="font-medium text-dark-green-7">{authorName}</h4>
            <p className="text-xs text-dark-green-6">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="text-sm text-dark-green-6 leading-relaxed">{review.comment}</p>
    </div>
  );
};

/**
 * ProductReviewsSection component
 * Shows product reviews in a carousel format
 */
const ProductReviewsSection = ({ reviews = [], isPaused, setIsPaused, product }) => {
  // Mock data for fallback
  const mockReviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      comment: "Excellent produit ! La qualité est au rendez-vous et la livraison était rapide.",
      date: "2024-01-15"
    },
    {
      id: 2,
      author: "Ahmed K.",
      rating: 4,
      comment: "Très satisfait de mon achat. Le produit correspond parfaitement à la description.",
      date: "2024-01-10"
    },
    {
      id: 3,
      author: "Fatima L.",
      rating: 5,
      comment: "Je recommande vivement ! Service client excellent et produit de qualité.",
      date: "2024-01-08"
    },
    {
      id: 4,
      author: "Youssef B.",
      rating: 4,
      comment: "Bon rapport qualité-prix. Livraison dans les temps.",
      date: "2024-01-05"
    },
    {
      id: 5,
      author: "Aicha R.",
      rating: 5,
      comment: "Parfait ! Exactement ce que je cherchais. Je recommande.",
      date: "2024-01-03"
    }
  ];

  // Use provided reviews or fallback to mock data
  const baseReviews = reviews.length > 0 ? reviews : mockReviews;
  
  // For display purposes, get unique reviews (remove duplicates if extended from parent)
  const displayReviews = reviews.length > 0 
    ? reviews.filter((review, index, arr) => 
        arr.findIndex(r => r.id === review.id) === index
      ).slice(0, 10) // Limit to first 10 unique reviews for display count
    : mockReviews;

  // Create unique reviews for carousel (no duplication if already extended from parent)
  const carouselReviews = reviews.length > 0 
    ? reviews // Use reviews as-is if provided from parent (already extended)
    : [
        ...mockReviews.map((review, index) => ({ ...review, key: `original-${review.id}-${index}` })),
        ...mockReviews.map((review, index) => ({ ...review, key: `duplicate-${review.id}-${index}` }))
      ];

  const averageRating = displayReviews.length > 0
    ? displayReviews.reduce((acc, review) => acc + review.rating, 0) / displayReviews.length
    : 0;

  // Function to render a review card (to be passed to the carousel)
  const renderReviewCard = (review) => {
    return <ReviewCard review={review} />;
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-white via-logo-lime/5 to-light-yellow-1/30 relative overflow-hidden">
      {/* Top and bottom decorative borders */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-logo-lime/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-logo-lime/40 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#1A472A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      {/* Section Decorations */}
      <SectionDecorations
        variant="lime"
        positions={['top-right', 'bottom-left']}
        customStyles={{
          topRight: {
            opacity: 0.25,
            filter: 'sepia(60%) hue-rotate(50deg) saturate(0.7) brightness(1.3)'
          },
          bottomLeft: {
            opacity: 0.25,
            filter: 'sepia(60%) hue-rotate(50deg) saturate(0.7) brightness(1.3)'
          }
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-40 left-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-logo-lime/10 to-light-yellow-1/20 blur-2xl opacity-70 animate-pulse [animation-duration:8s]"></div>
      <div className="absolute bottom-32 right-[10%] w-32 h-32 rounded-full bg-gradient-to-tl from-logo-lime/20 to-light-yellow-2/20 blur-3xl opacity-60 animate-pulse [animation-duration:12s] [animation-delay:1s]"></div>

      <div className="container mx-auto px-4 sm:px-6 mb-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center">
              <Icon name="chatCircleText" weight="duotone" size="lg" className="text-dark-green-7" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-normal text-dark-green-7">
                Avis clients ({displayReviews.length})
              </h2>
              {displayReviews.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={averageRating} />
                  <span className="text-sm font-medium text-dark-green-6">
                    {averageRating.toFixed(1)} sur 5
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="text-dark-green-6 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de ce produit
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 mx-auto max-w-[90%] md:max-w-[95%]">
        <EmblaReviewCarousel
          reviews={carouselReviews}
          renderReviewCard={renderReviewCard}
          className="mt-4"
          autoScroll={true}
          autoScrollInterval={6000}
        />
      </div>
    </section>
  );
};

export default ProductReviewsSection;