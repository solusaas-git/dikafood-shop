import React, { memo, useState, useRef, useEffect } from 'react';
import { Star, CheckCircle, ArrowRight, CaretDown } from "@phosphor-icons/react";
import "./card-review.scss";

const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths > 0) {
        return `il y a ${diffInMonths} mois`;
    } else if (diffInDays > 0) {
        return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
        return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInMinutes > 0) {
        return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else {
        return 'à l\'instant';
    }
};

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

const CardReview = memo(({ review }) => {
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
                                {renderStars(rating)}
                            </div>
                        </div>
                        {verified && (
                            <span className="verified-badge" title="Achat vérifié">
                                <CheckCircle size={16} weight="fill" />
                                Achat vérifié
                            </span>
                        )}
                    </div>
                </div>

                <div className="review-content">
                    <div className="product-info">
                        <p className="review-context">A donné son avis sur :</p>
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
                            aria-label={isExpanded ? 'Voir moins' : 'Voir plus'}
                        >
                            <CaretDown
                                weight="bold"
                                className={isExpanded ? 'rotated' : ''}
                            />
                            {isExpanded ? 'Voir moins' : 'Voir plus'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

CardReview.displayName = 'CardReview';

export default CardReview;
