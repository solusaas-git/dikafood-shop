import React, { memo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, CheckCircle, ArrowRight, CaretDown } from "@phosphor-icons/react";
import "./card-review.scss";

const formatRelativeTime = (dateString, t) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths > 0) {
        return t('review.time.months', { count: diffInMonths });
    } else if (diffInDays > 0) {
        return t('review.time.days', { count: diffInDays });
    } else if (diffInHours > 0) {
        return t('review.time.hours', { count: diffInHours });
    } else if (diffInMinutes > 0) {
        return t('review.time.minutes', { count: diffInMinutes });
    } else {
        return t('review.time.justNow');
    }
};

const CardReview = memo(({ review }) => {
    const { t } = useTranslation();
    const {
        author,
        rating,
        date,
        product,
        verified,
        comment
    } = review;

    const [isExpanded, setIsExpanded] = useState(false);
    const [needsExpansion, setNeedsExpansion] = useState(false);
    const reviewTextRef = useRef(null);

    useEffect(() => {
        if (reviewTextRef.current) {
            const { scrollHeight, clientHeight } = reviewTextRef.current;
            setNeedsExpansion(scrollHeight > clientHeight);
        }
    }, [comment]);

    return (
        <div className={`card-review-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="card-review">
                <div className="review-header">
                    <div className="author-info">
                        <div className="author-details">
                            <div className="author-name-location">
                                <h3>{author.name}</h3>
                                <p>{author.location}</p>
                            </div>
                            <div className="rating">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        weight={index < rating ? "fill" : "regular"}
                                        size={16}
                                        className={index < rating ? 'filled' : ''}
                                    />
                                ))}
                            </div>
                        </div>
                        {verified && (
                            <span className="verified-badge" title={t('review.verifiedPurchase')}>
                                <CheckCircle size={16} weight="fill" />
                                {t('review.verifiedPurchase')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="review-content">
                    <div className="product-info">
                        <p className="review-context">{t('review.reviewedProduct')}</p>
                        <a href={`/products/${product.id}`} className="product-link">
                            <div className="product-details">
                                <p className="product-name">{product.name}</p>
                                <p className="product-variant">{product.variant}</p>
                            </div>
                            <ArrowRight className="forward-icon" weight="bold" />
                        </a>
                    </div>
                    
                    <div 
                        ref={reviewTextRef}
                        className={`review-text ${needsExpansion ? 'truncated' : ''}`}
                    >
                        {comment}
                    </div>

                    {needsExpansion && (
                        <button 
                            className="expand-button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            aria-expanded={isExpanded}
                            aria-label={t(isExpanded ? 'review.showLess' : 'review.showMore')}
                        >
                            <CaretDown 
                                weight="bold"
                                className={isExpanded ? 'rotated' : ''}
                            />
                            {t(isExpanded ? 'review.showLess' : 'review.showMore')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

CardReview.displayName = 'CardReview';

export default CardReview;
