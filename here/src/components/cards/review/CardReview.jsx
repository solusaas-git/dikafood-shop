import React from 'react';
import { memo } from 'react';
import { Star, CheckCircle, ArrowRight } from "@phosphor-icons/react";
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
        return diffInMonths === 1 ? 'il y a 1 mois' : `il y a ${diffInMonths} mois`;
    } else if (diffInDays > 0) {
        return diffInDays === 1 ? 'il y a 1 jour' : `il y a ${diffInDays} jours`;
    } else if (diffInHours > 0) {
        return diffInHours === 1 ? 'il y a 1 heure' : `il y a ${diffInHours} heures`;
    } else if (diffInMinutes > 0) {
        return diffInMinutes === 1 ? 'il y a 1 minute' : `il y a ${diffInMinutes} minutes`;
    } else {
        return 'à l\'instant';
    }
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

    return (
        <article className="card-review-container">
            <div className="card-review">
                <header className="review-header">
                    <div className="author-info">
                        <div className="author-details">
                            <div className="author-name-location">
                                <h3>{author.name}</h3>
                                <p>{author.location}</p>
                                {verified && (
                                    <span className="verified-badge">
                                        <CheckCircle weight="duotone" /> Achat vérifié
                                    </span>
                                )}
                            </div>
                            <div className="rating-time">
                                <div className="rating" aria-label={`Note: ${rating} sur 5`}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i}
                                            weight={i < rating ? "fill" : "regular"}
                                            className={i < rating ? 'filled' : ''}
                                        />
                                    ))}
                                </div>
                                <time 
                                    dateTime={date}
                                    title={new Date(date).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                >
                                    {formatRelativeTime(date)}
                                </time>
                            </div>
                        </div>
                    </div>
                </header>

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
                    
                    <p className="review-text">{comment}</p>
                </div>
            </div>
        </article>
    );
});

CardReview.displayName = 'CardReview';

export default CardReview;
